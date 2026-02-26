import { WALLET_ADDRESS } from "./constants";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || "";
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const HELIUS_API = `https://api.helius.xyz/v0`;
const FETCH_TIMEOUT = 8000;

export interface EnhancedTransaction {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  description: string;
  fee: number;
  nativeTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    mint: string;
    tokenAmount: number;
    tokenStandard: string;
  }>;
  accountData: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: Array<{
      mint: string;
      rawTokenAmount: { tokenAmount: string; decimals: number };
      userAccount: string;
    }>;
  }>;
  events: Record<string, unknown>;
}

export async function fetchEnhancedTransactions(
  limit = 50,
  before?: string
): Promise<EnhancedTransaction[]> {
  if (!WALLET_ADDRESS || !HELIUS_API_KEY) return [];
  const url = `${HELIUS_API}/addresses/${WALLET_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}${before ? `&before=${before}` : ""}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT) });
  if (!res.ok) throw new Error(`Helius API error: ${res.status}`);
  return res.json();
}

export async function getBalance(): Promise<number> {
  if (!WALLET_ADDRESS || !HELIUS_API_KEY) return 0;
  const res = await fetch(HELIUS_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [WALLET_ADDRESS],
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });

  if (!res.ok) return 0;
  const data = await res.json();
  return (data.result?.value || 0) / 1e9;
}

export async function getTokenMetadata(
  mint: string
): Promise<{ name: string; symbol: string; image: string } | null> {
  if (!HELIUS_API_KEY) return null;
  const res = await fetch(HELIUS_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAsset",
      params: { id: mint },
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data.result?.content;
  if (!content) return null;

  return {
    name: content.metadata?.name || "Unknown",
    symbol: content.metadata?.symbol || "???",
    image: content.links?.image || content.json_uri || "",
  };
}
