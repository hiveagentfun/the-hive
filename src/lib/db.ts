import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbInitialized: boolean | undefined;
};

if (!globalForPrisma.dbInitialized) {
  try {
    execSync("npx prisma db push --accept-data-loss --skip-generate", {
      stdio: "inherit",
    });
  } catch {
    console.error("prisma db push failed — tables may be missing");
  }
  globalForPrisma.dbInitialized = true;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
