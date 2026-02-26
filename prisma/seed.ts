import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WALLET = process.env.NEXT_PUBLIC_WALLET_ADDRESS || "WALLET_NOT_SET";
const MAIN_TOKEN = "HiveAg3ntTokenMintAddressPlaceholder1111111111";

// Fake Solana-like addresses
function fakeAddr(prefix: string): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let addr = prefix;
  while (addr.length < 44) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr.slice(0, 44);
}

function fakeSig(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let sig = "";
  for (let i = 0; i < 88; i++) sig += chars[Math.floor(Math.random() * chars.length)];
  return sig;
}

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600_000);
}

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.deployedToken.deleteMany();
  await prisma.buyback.deleteMany();
  await prisma.ecosystemStats.deleteMany();

  // --- Deployed Tokens (6 bee-themed) ---
  const tokens = [
    { name: "The Hive", symbol: "HIVE", mint: MAIN_TOKEN, hoursAgo: 72 },
    { name: "BuzzCoin", symbol: "BUZZ", mint: fakeAddr("Buzz"), hoursAgo: 48 },
    { name: "QueenBee", symbol: "QBEE", mint: fakeAddr("QBee"), hoursAgo: 36 },
    { name: "HoneyPot", symbol: "HPOT", mint: fakeAddr("HPot"), hoursAgo: 24 },
    { name: "BeeSwarm", symbol: "SWRM", mint: fakeAddr("Swrm"), hoursAgo: 12 },
    { name: "NectarFi", symbol: "NCTR", mint: fakeAddr("Nctr"), hoursAgo: 4 },
  ];

  for (const t of tokens) {
    await prisma.deployedToken.create({
      data: {
        mintAddress: t.mint,
        name: t.name,
        symbol: t.symbol,
        imageUrl: null,
        deploySignature: fakeSig(),
        deployedAt: hoursAgo(t.hoursAgo),
        status: "active",
      },
    });
  }

  // --- Deploy transactions ---
  for (const t of tokens) {
    await prisma.transaction.create({
      data: {
        signature: fakeSig(),
        type: "deploy",
        timestamp: hoursAgo(t.hoursAgo),
        description: `Launched ${t.name}`,
        amount: null,
        tokenMint: t.mint,
        tokenSymbol: t.symbol,
        tokenName: t.name,
        fromAddress: WALLET,
        toAddress: null,
      },
    });
  }

  // --- Buyback transactions (The Hive buys) ---
  const buybackAmounts = [2.5, 1.8, 0.75, 3.2, 1.1, 0.5, 4.0, 0.9, 2.1, 1.5, 0.3, 5.0, 1.7, 0.6, 2.8];
  for (let i = 0; i < buybackAmounts.length; i++) {
    const buyer = fakeAddr("Buy");
    await prisma.transaction.create({
      data: {
        signature: fakeSig(),
        type: "buyback",
        timestamp: hoursAgo(i * 2.5 + Math.random() * 2),
        description: `Bought back The Hive`,
        amount: buybackAmounts[i],
        tokenMint: MAIN_TOKEN,
        tokenSymbol: "HIVE",
        tokenName: "The Hive",
        fromAddress: buyer,
        toAddress: WALLET,
      },
    });

    await prisma.buyback.create({
      data: {
        signature: fakeSig(),
        solAmount: buybackAmounts[i],
        tokenAmount: buybackAmounts[i] * 1000 * (0.8 + Math.random() * 0.4),
        tokenMint: MAIN_TOKEN,
        timestamp: hoursAgo(i * 2.5 + Math.random() * 2),
      },
    });
  }

  // --- Buy/Sell ecosystem activity ---
  const ecoTokens = tokens.slice(1); // exclude main token
  for (let i = 0; i < 15; i++) {
    const token = ecoTokens[Math.floor(Math.random() * ecoTokens.length)];
    const isBuy = Math.random() > 0.3; // 70% buys
    const trader = fakeAddr("Trd");
    const amount = +(0.1 + Math.random() * 5).toFixed(3);

    await prisma.transaction.create({
      data: {
        signature: fakeSig(),
        type: "buy_sell",
        timestamp: hoursAgo(i * 1.5 + Math.random()),
        description: `${isBuy ? "Bought" : "Sold"} ${token.name}`,
        amount,
        tokenMint: token.mint,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        fromAddress: isBuy ? trader : WALLET,
        toAddress: isBuy ? WALLET : trader,
      },
    });
  }

  // --- Fee claims ---
  for (let i = 0; i < 5; i++) {
    const token = ecoTokens[Math.floor(Math.random() * ecoTokens.length)];
    await prisma.transaction.create({
      data: {
        signature: fakeSig(),
        type: "fee_claim",
        timestamp: hoursAgo(i * 8 + Math.random() * 4),
        description: `Collected fees from ${token.name}`,
        amount: +(0.05 + Math.random() * 1.5).toFixed(3),
        tokenMint: token.mint,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        fromAddress: null,
        toAddress: WALLET,
      },
    });
  }

  // --- Ecosystem stats ---
  const totalBuybackSol = buybackAmounts.reduce((a, b) => a + b, 0);
  await prisma.ecosystemStats.create({
    data: {
      id: "singleton",
      totalDeploys: tokens.length,
      totalBuybacks: buybackAmounts.length,
      totalBuybackSol,
      totalFeeClaims: 5,
      lastUpdated: new Date(),
    },
  });

  const txCount = await prisma.transaction.count();
  const tokenCount = await prisma.deployedToken.count();
  console.log(`Seeded: ${tokenCount} tokens, ${txCount} transactions`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
