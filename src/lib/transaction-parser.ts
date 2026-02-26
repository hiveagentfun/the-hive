import { WALLET_ADDRESS, PUMP_FUN_PROGRAM_ID, MAIN_TOKEN_CA } from "./constants";
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
    timestamp: new Date((tx.timestamp || 0) * 1000),
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
  const nativeTransfers = tx.nativeTransfers || [];
  const tokenTransfers = tx.tokenTransfers || [];

  // deploys (pump.fun create)
  if (
    desc.includes("create") &&
    (source.includes("pump") || desc.includes(PUMP_FUN_PROGRAM_ID.toLowerCase()))
  ) {
    base.type = "deploy";
    if (tokenTransfers[0]) {
      base.tokenMint = tokenTransfers[0].mint;
      base.amount = tokenTransfers[0].tokenAmount;
    }
    return base;
  }

  // swaps — sol going out, tokens coming in
  const walletSolOut = nativeTransfers.find(
    (t) => t.fromUserAccount === WALLET_ADDRESS && t.amount > 0
  );
  const walletTokenIn = tokenTransfers.find(
    (t) => t.toUserAccount === WALLET_ADDRESS && t.tokenAmount > 0
  );

  if (
    walletSolOut &&
    walletTokenIn &&
    (source.includes("pump") ||
      source.includes("raydium") ||
      source.includes("jupiter"))
  ) {
    // only classify as buyback if buying The Hive token specifically
    const isBuyback =
      MAIN_TOKEN_CA !== null &&
      MAIN_TOKEN_CA !== "" &&
      walletTokenIn.mint === MAIN_TOKEN_CA;
    base.type = isBuyback ? "buyback" : "buy_sell";
    base.amount = walletSolOut.amount / 1e9;
    base.tokenMint = walletTokenIn.mint;
    base.tokenSymbol = null;
    base.fromAddress = WALLET_ADDRESS;
    base.toAddress = walletTokenIn.mint;
    return base;
  }

  // fee claims — sol in, NO tokens involved, from pump.fun specifically
  const walletSolIn = nativeTransfers.find(
    (t) => t.toUserAccount === WALLET_ADDRESS && t.amount > 0
  );
  if (walletSolIn && tokenTransfers.length === 0) {
    if (source.includes("pump") || (desc.includes("claim") && desc.includes("fee"))) {
      base.type = "fee_claim";
      base.amount = walletSolIn.amount / 1e9;
      base.fromAddress = walletSolIn.fromUserAccount;
      return base;
    }
  }

  // other swaps (token in or out without matching buyback pattern)
  if (
    tokenTransfers.length > 0 &&
    (source.includes("pump") ||
      source.includes("raydium") ||
      source.includes("jupiter"))
  ) {
    base.type = "buy_sell";
    const transfer = tokenTransfers[0];
    base.tokenMint = transfer.mint;
    base.amount = transfer.tokenAmount;
    base.fromAddress = transfer.fromUserAccount;
    base.toAddress = transfer.toUserAccount;
    return base;
  }

  // plain transfer
  if (nativeTransfers.length > 0 || tokenTransfers.length > 0) {
    base.type = "transfer";
    if (nativeTransfers[0]) {
      base.amount = nativeTransfers[0].amount / 1e9;
      base.fromAddress = nativeTransfers[0].fromUserAccount;
      base.toAddress = nativeTransfers[0].toUserAccount;
    }
    return base;
  }

  return base;
}
