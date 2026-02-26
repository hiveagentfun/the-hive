import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

// POST /api/admin/reset — wipe all data and start fresh
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  await ensureDb();
  if (!ADMIN_SECRET || auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.transaction.deleteMany();
  await prisma.deployedToken.deleteMany();
  await prisma.buyback.deleteMany();
  await prisma.ecosystemStats.deleteMany();

  return NextResponse.json({ status: "reset complete" });
}
