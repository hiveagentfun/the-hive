import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function checkAuth(req: NextRequest) {
  if (!ADMIN_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === ADMIN_SECRET;
}

// POST /api/admin/token — manually add a deployed token
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { mintAddress, name, symbol, imageUrl, signature } = body;

  if (!mintAddress || !name || !symbol) {
    return NextResponse.json(
      { error: "mintAddress, name, and symbol are required" },
      { status: 400 }
    );
  }

  const token = await prisma.deployedToken.upsert({
    where: { mintAddress },
    update: { name, symbol, imageUrl: imageUrl || null },
    create: {
      mintAddress,
      name,
      symbol,
      imageUrl: imageUrl || null,
      deploySignature: signature || `manual-${Date.now()}`,
      deployedAt: new Date(),
      status: "active",
    },
  });

  // Also create a deploy transaction
  await prisma.transaction.create({
    data: {
      signature: signature || `manual-deploy-${Date.now()}`,
      type: "deploy",
      timestamp: new Date(),
      description: `Launched ${name}`,
      amount: null,
      tokenMint: mintAddress,
      tokenSymbol: symbol,
      tokenName: name,
    },
  });

  // Bump stats
  await prisma.ecosystemStats.upsert({
    where: { id: "singleton" },
    update: { totalDeploys: { increment: 1 }, lastUpdated: new Date() },
    create: { id: "singleton", totalDeploys: 1 },
  });

  return NextResponse.json({ token });
}

// DELETE /api/admin/token — remove a token by mintAddress
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mintAddress = searchParams.get("mint");

  if (!mintAddress) {
    return NextResponse.json({ error: "mint param required" }, { status: 400 });
  }

  await prisma.deployedToken.deleteMany({ where: { mintAddress } });
  return NextResponse.json({ deleted: mintAddress });
}
