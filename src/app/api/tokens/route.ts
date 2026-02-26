import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const where = status ? { status } : {};

  const tokens = await prisma.deployedToken.findMany({
    where,
    orderBy: { deployedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ tokens });
}
