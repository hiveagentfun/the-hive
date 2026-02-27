export interface Transaction {
  id: string;
  signature: string;
  type: string;
  timestamp: string;
  description: string | null;
  amount: number | null;
  tokenMint: string | null;
  tokenSymbol: string | null;
  tokenName: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

export function timeAgo(dateStr: string): string {
  const ms = new Date(dateStr).getTime();
  if (isNaN(ms)) return "";
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const TYPE_DOTS: Record<string, string> = {
  deploy: "bg-honey",
  buyback: "bg-emerald-500",
  fee_claim: "bg-amber-500",
  buy_sell: "bg-orange-400",
  transfer: "bg-neutral-400",
  unknown: "bg-neutral-500",
};

export const HUMAN_LABELS: Record<string, string> = {
  deploy: "Launched a new token",
  buyback: "Bought back tokens",
  fee_claim: "Collected earnings",
  buy_sell: "Swapped tokens",
  transfer: "Sent a transfer",
};
