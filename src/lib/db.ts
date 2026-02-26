import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbReady: boolean | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "signature" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "timestamp" DATETIME NOT NULL,
  "description" TEXT,
  "amount" REAL,
  "tokenMint" TEXT,
  "tokenSymbol" TEXT,
  "tokenName" TEXT,
  "fromAddress" TEXT,
  "toAddress" TEXT,
  "rawData" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_signature_key" ON "Transaction"("signature");
CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX IF NOT EXISTS "Transaction_timestamp_idx" ON "Transaction"("timestamp");

CREATE TABLE IF NOT EXISTS "DeployedToken" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "mintAddress" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "imageUrl" TEXT,
  "deploySignature" TEXT NOT NULL,
  "deployedAt" DATETIME NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "DeployedToken_mintAddress_key" ON "DeployedToken"("mintAddress");
CREATE INDEX IF NOT EXISTS "DeployedToken_status_idx" ON "DeployedToken"("status");
CREATE INDEX IF NOT EXISTS "DeployedToken_deployedAt_idx" ON "DeployedToken"("deployedAt");

CREATE TABLE IF NOT EXISTS "Buyback" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "signature" TEXT NOT NULL,
  "solAmount" REAL NOT NULL,
  "tokenAmount" REAL NOT NULL,
  "tokenMint" TEXT NOT NULL,
  "timestamp" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "Buyback_signature_key" ON "Buyback"("signature");
CREATE INDEX IF NOT EXISTS "Buyback_timestamp_idx" ON "Buyback"("timestamp");

CREATE TABLE IF NOT EXISTS "EcosystemStats" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
  "totalDeploys" INTEGER NOT NULL DEFAULT 0,
  "totalBuybacks" INTEGER NOT NULL DEFAULT 0,
  "totalBuybackSol" REAL NOT NULL DEFAULT 0,
  "totalFeeClaims" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export async function ensureDb() {
  if (globalForPrisma.dbReady) return;
  try {
    await prisma.$queryRaw`SELECT 1 FROM "Transaction" LIMIT 1`;
    globalForPrisma.dbReady = true;
  } catch {
    console.log("Tables missing, creating via raw SQL...");
    const statements = CREATE_TABLES_SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log("Tables created successfully");
    globalForPrisma.dbReady = true;
  }
}
