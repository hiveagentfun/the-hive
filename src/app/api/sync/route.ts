import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";
import { fetchEnhancedTransactions } from "@/lib/helius";
import { classifyTransaction } from "@/lib/transaction-parser";
import { getTokenMetadata } from "@/lib/helius";

export async function POST(req: NextRequest) {
  await ensureDb();
  const syncSecret = process.env.HELIUS_WEBHOOK_SECRET;
  if (!syncSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const provided = req.headers.get("authorization");
  if (!provided || provided !== syncSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let totalProcessed = 0;
  let before: string | undefined;
  const maxPages = 5;

  for (let page = 0; page < maxPages; page++) {
    const transactions = await fetchEnhancedTransactions(50, before);
    if (transactions.length === 0) break;

    for (const tx of transactions) {
      const existing = await prisma.transaction.findUnique({
        where: { signature: tx.signature },
      });
      if (existing) continue;

      const classified = classifyTransaction(tx);

      await prisma.transaction.create({
        data: {
          signature: classified.signature,
          type: classified.type,
          timestamp: classified.timestamp,
          description: classified.description,
          amount: classified.amount,
          tokenMint: classified.tokenMint,
          tokenSymbol: classified.tokenSymbol,
          tokenName: classified.tokenName,
          fromAddress: classified.fromAddress,
          toAddress: classified.toAddress,
          rawData: JSON.stringify(tx),
        },
      });

      if (classified.type === "deploy" && classified.tokenMint) {
        const meta = await getTokenMetadata(classified.tokenMint);
        await prisma.deployedToken.upsert({
          where: { mintAddress: classified.tokenMint },
          update: {},
          create: {
            mintAddress: classified.tokenMint,
            name: meta?.name || "Unknown",
            symbol: meta?.symbol || "???",
            imageUrl: meta?.image || null,
            deploySignature: classified.signature,
            deployedAt: classified.timestamp,
          },
        });
      }

      if (
        classified.type === "buyback" &&
        classified.tokenMint &&
        classified.amount
      ) {
        await prisma.buyback.create({
          data: {
            signature: classified.signature,
            solAmount: classified.amount,
            tokenAmount: 0,
            tokenMint: classified.tokenMint,
            timestamp: classified.timestamp,
          },
        });
      }

      totalProcessed++;
    }

    before = transactions[transactions.length - 1].signature;
  }

  // recalc stats
  const [deploys, buybacks, feeClaims, totalBuybackSol] = await Promise.all([
    prisma.transaction.count({ where: { type: "deploy" } }),
    prisma.transaction.count({ where: { type: "buyback" } }),
    prisma.transaction.count({ where: { type: "fee_claim" } }),
    prisma.buyback.aggregate({ _sum: { solAmount: true } }),
  ]);

  await prisma.ecosystemStats.upsert({
    where: { id: "singleton" },
    update: {
      totalDeploys: deploys,
      totalBuybacks: buybacks,
      totalFeeClaims: feeClaims,
      totalBuybackSol: totalBuybackSol._sum.solAmount || 0,
      lastUpdated: new Date(),
    },
    create: {
      id: "singleton",
      totalDeploys: deploys,
      totalBuybacks: buybacks,
      totalFeeClaims: feeClaims,
      totalBuybackSol: totalBuybackSol._sum.solAmount || 0,
    },
  });

  return NextResponse.json({ processed: totalProcessed });
}
