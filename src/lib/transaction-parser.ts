import { WALLET_ADDRESS, PUMP_FUN_PROGRAM_ID } from "./constants";
import type { EnhancedTransaction } from "./helius";

export type TransactionType =
  | "deploy"
  | "buyback"
  | "buy_sell"
  | "fee_claim"
  | "transfer"
  | "unknown";

export interface ClassifiedTransaction {
  signature: string;
  type: TransactionType;
  timestamp: Date;
  description: string;
  amount: number | null;
  tokenMint: string | null;
  tokenSymbol: string | null;
  tokenName: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

export function classifyTransaction(
  tx: EnhancedTransaction
): ClassifiedTransaction {
  const base: ClassifiedTransaction = {
    signature: tx.signature,
    type: "unknown",
    timestamp: new Date(tx.timestamp * 1000),
    description: tx.description || "",
    amount: null,
    tokenMint: null,
    tokenSymbol: null,
    tokenName: null,
    fromAddress: null,
    toAddress: null,
  };

  const desc = (tx.description || "").toLowerCase();
  const source = (tx.source || "").toLowerCase();

  // deploys (pump.fun create)
  if (
    desc.includes("create") &&
    (source.includes("pump") || desc.includes(PUMP_FUN_PROGRAM_ID.toLowerCase()))
  ) {
    base.type = "deploy";
    if (tx.tokenTransfers?.[0]) {
      base.tokenMint = tx.tokenTransfers[0].mint;
      base.amount = tx.tokenTransfers[0].tokenAmount;
    }
    return base;
  }

  // buybacks - sol going out, tokens coming in
  const walletSolOut = tx.nativeTransfers?.find(
    (t) => t.fromUserAccount === WALLET_ADDRESS && t.amount > 0
  );
  const walletTokenIn = tx.tokenTransfers?.find(
    (t) => t.toUserAccount === WALLET_ADDRESS && t.tokenAmount > 0
  );

  if (
    walletSolOut &&
    walletTokenIn &&
    (source.includes("pump") ||
      source.includes("raydium") ||
      source.includes("jupiter"))
  ) {
    base.type = "buyback";
    base.amount = walletSolOut.amount / 1e9;
    base.tokenMint = walletTokenIn.mint;
    base.tokenSymbol = null;
    return base;
  }

  // fee claims - sol in, no tokens involved
  const walletSolIn = tx.nativeTransfers?.find(
    (t) => t.toUserAccount === WALLET_ADDRESS && t.amount > 0
  );
  if (walletSolIn && (!tx.tokenTransfers || tx.tokenTransfers.length === 0)) {
    if (source.includes("pump") || desc.includes("claim") || desc.includes("withdraw")) {
      base.type = "fee_claim";
      base.amount = walletSolIn.amount / 1e9;
      base.fromAddress = walletSolIn.fromUserAccount;
      return base;
    }
  }

  // swaps
  if (
    tx.tokenTransfers &&
    tx.tokenTransfers.length > 0 &&
    (source.includes("pump") ||
      source.includes("raydium") ||
      source.includes("jupiter"))
  ) {
    base.type = "buy_sell";
    const transfer = tx.tokenTransfers[0];
    base.tokenMint = transfer.mint;
    base.amount = transfer.tokenAmount;
    base.fromAddress = transfer.fromUserAccount;
    base.toAddress = transfer.toUserAccount;
    return base;
  }

  // just a transfer
  if (
    (tx.nativeTransfers && tx.nativeTransfers.length > 0) ||
    (tx.tokenTransfers && tx.tokenTransfers.length > 0)
  ) {
    base.type = "transfer";
    if (tx.nativeTransfers?.[0]) {
      base.amount = tx.nativeTransfers[0].amount / 1e9;
      base.fromAddress = tx.nativeTransfers[0].fromUserAccount;
      base.toAddress = tx.nativeTransfers[0].toUserAccount;
    }
    return base;
  }

  return base;
}
