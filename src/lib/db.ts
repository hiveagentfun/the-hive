import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbReady: boolean | undefined;
};

export async function ensureDb() {
  if (globalForPrisma.dbReady) return;
  try {
    const p = globalForPrisma.prisma ?? new PrismaClient();
    await p.$queryRaw`SELECT 1 FROM Transaction LIMIT 1`;
    globalForPrisma.dbReady = true;
  } catch {
    console.log("Tables missing, running prisma db push...");
    try {
      execSync("npx prisma db push --accept-data-loss --skip-generate", {
        stdio: "inherit",
        timeout: 30000,
      });
      console.log("prisma db push complete");
    } catch (e) {
      console.error("prisma db push failed:", e);
    }
    globalForPrisma.dbReady = true;
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
