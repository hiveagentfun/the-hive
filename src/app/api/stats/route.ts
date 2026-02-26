import { NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";
import { getBalance } from "@/lib/helius";

export async function GET() {
  await ensureDb();
  const [stats, balance] = await Promise.all([
    prisma.ecosystemStats.findUnique({ where: { id: "singleton" } }),
    getBalance().catch(() => null),
  ]);

  return NextResponse.json({
    totalDeploys: stats?.totalDeploys || 0,
    totalBuybacks: stats?.totalBuybacks || 0,
    totalBuybackSol: stats?.totalBuybackSol || 0,
    totalFeeClaims: stats?.totalFeeClaims || 0,
    walletBalance: balance,
    lastUpdated: stats?.lastUpdated || null,
  });
}
