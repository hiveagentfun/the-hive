import { NextRequest, NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/db";
import { classifyTransaction } from "@/lib/transaction-parser";
import { getTokenMetadata, type EnhancedTransaction } from "@/lib/helius";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  await ensureDb();
  const webhookSecret = process.env.HELIUS_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const provided = req.headers.get("authorization");
  if (!provided || provided !== webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const transactions: EnhancedTransaction[] = Array.isArray(body) ? body : [body];

  let processed = 0;

  for (const tx of transactions) {
    if (!tx.signature || typeof tx.timestamp !== "number") continue;

    try {
      const existing = await prisma.transaction.findUnique({
        where: { signature: tx.signature },
      });
      if (existing) continue;

      const classified = classifyTransaction(tx);

      try {
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
      } catch (err) {
        // Duplicate signature (race condition with concurrent webhooks)
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          continue;
        }
        throw err;
      }

      // update stats
      const statsUpdate: Record<string, unknown> = {
        lastUpdated: new Date(),
      };

      if (classified.type === "deploy") {
        statsUpdate.totalDeploys = { increment: 1 };

        if (classified.tokenMint) {
          const meta = await getTokenMetadata(classified.tokenMint).catch(() => null);
          await prisma.deployedToken.upsert({
            where: { mintAddress: classified.tokenMint },
            update: {
              name: meta?.name || classified.tokenName || undefined,
              symbol: meta?.symbol || classified.tokenSymbol || undefined,
              imageUrl: meta?.image || undefined,
            },
            create: {
              mintAddress: classified.tokenMint,
              name: meta?.name || classified.tokenName || "Unknown",
              symbol: meta?.symbol || classified.tokenSymbol || "???",
              imageUrl: meta?.image || null,
              deploySignature: classified.signature,
              deployedAt: classified.timestamp,
            },
          });
        }
      } else if (classified.type === "buyback") {
        statsUpdate.totalBuybacks = { increment: 1 };
        statsUpdate.totalBuybackSol = { increment: classified.amount || 0 };

        if (classified.tokenMint && classified.amount) {
          try {
            await prisma.buyback.create({
              data: {
                signature: classified.signature,
                solAmount: classified.amount,
                tokenAmount: 0,
                tokenMint: classified.tokenMint,
                timestamp: classified.timestamp,
              },
            });
          } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
              continue;
            }
            throw err;
          }
        }
      } else if (classified.type === "fee_claim") {
        statsUpdate.totalFeeClaims = { increment: 1 };
      }

      await prisma.ecosystemStats.upsert({
        where: { id: "singleton" },
        update: statsUpdate,
        create: {
          id: "singleton",
          totalDeploys: classified.type === "deploy" ? 1 : 0,
          totalBuybacks: classified.type === "buyback" ? 1 : 0,
          totalBuybackSol: classified.type === "buyback" ? (classified.amount || 0) : 0,
          totalFeeClaims: classified.type === "fee_claim" ? 1 : 0,
        },
      });

      processed++;
    } catch (err) {
      console.error(`Error processing tx ${tx.signature}:`, err);
    }
  }

  return NextResponse.json({ processed });
}
