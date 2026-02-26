import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureDb();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const where = type && type !== "all" ? { type } : {};

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, limit, offset });
}
