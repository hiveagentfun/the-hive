import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ensureDb();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const [buybacks, totalSol] = await Promise.all([
      prisma.buyback.findMany({
        orderBy: { timestamp: "desc" },
        take: limit,
      }),
      prisma.buyback.aggregate({ _sum: { solAmount: true } }),
    ]);

    return NextResponse.json({
      buybacks,
      totalSolSpent: totalSol._sum.solAmount || 0,
    });
  } catch {
    return NextResponse.json({ buybacks: [], totalSolSpent: 0 });
  }
}
