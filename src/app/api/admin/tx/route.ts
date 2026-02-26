import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function checkAuth(req: NextRequest) {
  if (!ADMIN_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === ADMIN_SECRET;
}

// POST /api/admin/tx — manually add a transaction
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    type,
    description,
    amount,
    tokenMint,
    tokenSymbol,
    tokenName,
    fromAddress,
    toAddress,
    signature,
  } = body;

  if (!type) {
    return NextResponse.json(
      { error: "type is required (deploy, buyback, buy_sell, fee_claim, transfer)" },
      { status: 400 }
    );
  }

  const tx = await prisma.transaction.create({
    data: {
      signature: signature || `manual-${type}-${Date.now()}`,
      type,
      timestamp: new Date(),
      description: description || null,
      amount: amount != null ? parseFloat(amount) : null,
      tokenMint: tokenMint || null,
      tokenSymbol: tokenSymbol || null,
      tokenName: tokenName || null,
      fromAddress: fromAddress || null,
      toAddress: toAddress || null,
    },
  });

  // Update stats based on type
  const statsUpdate: Record<string, unknown> = { lastUpdated: new Date() };

  if (type === "buyback") {
    statsUpdate.totalBuybacks = { increment: 1 };
    if (amount) {
      statsUpdate.totalBuybackSol = { increment: parseFloat(amount) };

      // Also add to buyback table
      await prisma.buyback.create({
        data: {
          signature: tx.signature,
          solAmount: parseFloat(amount),
          tokenAmount: 0,
          tokenMint: tokenMint || "",
          timestamp: new Date(),
        },
      });
    }
  } else if (type === "fee_claim") {
    statsUpdate.totalFeeClaims = { increment: 1 };
  }

  if (Object.keys(statsUpdate).length > 1) {
    await prisma.ecosystemStats.upsert({
      where: { id: "singleton" },
      update: statsUpdate,
      create: { id: "singleton" },
    });
  }

  return NextResponse.json({ transaction: tx });
}
