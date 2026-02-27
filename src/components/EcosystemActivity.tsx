"use client";

import { useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { URLS, WALLET_ADDRESS } from "@/lib/constants";
import { Transaction, timeAgo } from "@/lib/tx-utils";

export default function EcosystemActivity() {
  const fetcher = useCallback(
    () =>
      fetch("/api/transactions?type=buy_sell&limit=15").then((r) => r.json()),
    []
  );
  const { data, loading } = usePolling<{ transactions: Transaction[] }>(
    fetcher,
    15000
  );

  const transactions = data?.transactions || [];

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border/60 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
        <h3 className="font-heading font-bold text-sm text-ink">
          Ecosystem Activity
        </h3>
      </div>

      {/* Scrollable list */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading && transactions.length === 0 ? (
          <div className="p-4 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 skeleton" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-ink-muted text-sm">
            No activity yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((tx) => {
              const isSell = tx.fromAddress === WALLET_ADDRESS;
              const wallet = isSell ? tx.toAddress : tx.fromAddress;
              const walletDisplay = wallet
                ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
                : "Unknown";

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-honey/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                        isSell ? "bg-red-400" : "bg-emerald-500"
                      }`}
                    />
                    <span className="text-xs font-mono text-ink-muted truncate">
                      {walletDisplay}
                    </span>
                    {tx.tokenSymbol && (
                      <span className="text-xs font-mono text-ink-faint shrink-0">
                        ${tx.tokenSymbol}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isSell
                          ? "text-red-400 bg-red-400/10"
                          : "text-emerald-500 bg-emerald-500/10"
                      }`}
                    >
                      {isSell ? "SELL" : "BUY"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    {tx.amount != null && (
                      <span className="text-xs font-mono text-ink-muted">
                        {tx.amount.toFixed(3)} SOL
                      </span>
                    )}
                    <span className="text-xs text-ink-faint">
                      {timeAgo(tx.timestamp)}
                    </span>
                    <a
                      href={URLS.solscan(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-faint hover:text-honey transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
