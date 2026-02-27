import { NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";
import { getBalance } from "@/lib/helius";
import { getMarketCap } from "@/lib/dexscreener";

export async function GET() {
  try {
    await ensureDb();
    const [stats, balance, marketCap] = await Promise.all([
      prisma.ecosystemStats.findUnique({ where: { id: "singleton" } }),
      getBalance().catch(() => null),
      getMarketCap().catch(() => null),
    ]);

    return NextResponse.json({
      totalDeploys: stats?.totalDeploys || 0,
      totalBuybacks: stats?.totalBuybacks || 0,
      totalBuybackSol: stats?.totalBuybackSol || 0,
      totalFeeClaims: stats?.totalFeeClaims || 0,
      walletBalance: balance,
      marketCap: marketCap,
      lastUpdated: stats?.lastUpdated || null,
    });
  } catch (err) {
    console.error("Stats API error:", err);
    const [balance, marketCap] = await Promise.all([
      getBalance().catch(() => null),
      getMarketCap().catch(() => null),
    ]);
    return NextResponse.json({
      totalDeploys: 0,
      totalBuybacks: 0,
      totalBuybackSol: 0,
      totalFeeClaims: 0,
      walletBalance: balance,
      marketCap: marketCap,
      lastUpdated: null,
    });
  }
}
