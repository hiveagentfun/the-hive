"use client";

import { useState, useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { URLS } from "@/lib/constants";

interface Transaction {
  id: string;
  signature: string;
  type: string;
  timestamp: string;
  description: string;
  amount: number | null;
  tokenMint: string | null;
  tokenSymbol: string | null;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "deploy", label: "Launches" },
  { key: "buyback", label: "Buybacks" },
  { key: "fee_claim", label: "Earnings" },
];

const TYPE_BADGES: Record<string, { color: string; label: string }> = {
  deploy: { color: "bg-honey-500/20 text-honey-400 border-honey-500/30", label: "LAUNCH" },
  buyback: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "BUYBACK" },
  fee_claim: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "EARNINGS" },
  buy_sell: { color: "bg-honey-600/20 text-honey-500 border-honey-600/30", label: "SWAP" },
  transfer: { color: "bg-honey-800/20 text-honey-700 border-honey-800/30", label: "TRANSFER" },
  unknown: { color: "bg-hive-border text-hive-muted border-hive-border", label: "OTHER" },
};

const HUMAN_LABELS: Record<string, string> = {
  deploy: "Launched a new token",
  buyback: "Bought back tokens",
  fee_claim: "Collected earnings",
  buy_sell: "Swapped tokens",
  transfer: "Sent a transfer",
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LiveFeed() {
  const [filter, setFilter] = useState("all");

  const fetcher = useCallback(
    () =>
      fetch(`/api/transactions?type=${filter}&limit=10`).then((r) => r.json()),
    [filter]
  );
  const { data, loading } = usePolling<{
    transactions: Transaction[];
    total: number;
  }>(fetcher, 15000);

  const transactions = data?.transactions || [];

  return (
    <section id="activity" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-bold text-2xl text-white">
            What&apos;s Buzzing
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-honey-400">
            <span className="w-1.5 h-1.5 rounded-full bg-honey-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-hive-card border border-hive-border rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                filter === f.key
                  ? "bg-honey-500/20 text-honey-400"
                  : "text-hive-muted hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-hive-card border border-hive-border rounded-xl overflow-hidden">
        {loading && transactions.length === 0 ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-hive-border rounded animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-hive-muted text-sm">
            No activity yet. The bees are resting.
          </div>
        ) : (
          <div className="divide-y divide-hive-border">
            {transactions.map((tx) => {
              const badge = TYPE_BADGES[tx.type] || TYPE_BADGES.unknown;
              const label = tx.description || HUMAN_LABELS[tx.type] || "Activity";
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300 truncate">
                        {label}
                      </p>
                      <p className="text-xs text-hive-muted">
                        {timeAgo(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {tx.amount != null && (
                      <span className="text-sm font-mono text-honey-400">
                        {tx.amount.toFixed(4)}
                      </span>
                    )}
                    <a
                      href={URLS.solscan(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-hive-muted hover:text-honey-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
