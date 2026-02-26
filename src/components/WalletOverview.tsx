"use client";

import { useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { WALLET_ADDRESS, URLS } from "@/lib/constants";
import CopyButton from "./CopyButton";

interface Stats {
  walletBalance: number | null;
}

interface Transaction {
  id: string;
  signature: string;
  type: string;
  timestamp: string;
  amount: number | null;
}

export default function WalletOverview() {
  const statsFetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const txFetcher = useCallback(
    () => fetch("/api/transactions?limit=5").then((r) => r.json()),
    []
  );

  const { data: stats } = usePolling<Stats>(statsFetcher, 30000);
  const { data: txData } = usePolling<{ transactions: Transaction[] }>(
    txFetcher,
    30000
  );

  const recentTxs = txData?.transactions || [];

  return (
    <section id="wallet" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">
        Wallet Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Balance card */}
        <div className="bg-hive-card border border-hive-border rounded-xl p-6">
          <p className="text-xs text-gray-500 font-mono uppercase mb-2">
            SOL Balance
          </p>
          <p className="text-4xl font-heading font-bold text-white mb-4">
            {stats?.walletBalance != null
              ? `${stats.walletBalance.toFixed(2)}`
              : "--"}
            <span className="text-lg text-gray-500 ml-2">SOL</span>
          </p>

          <div className="space-y-2">
            <CopyButton text={WALLET_ADDRESS} label="Address" className="w-full justify-center" />

            <div className="flex gap-2">
              <a
                href={URLS.solscanAccount(WALLET_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-hive-border/50 text-xs font-mono text-gray-400 hover:text-honey-400 hover:bg-hive-border transition-all"
              >
                Solscan
              </a>
              <a
                href={URLS.solanaFm(WALLET_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-hive-border/50 text-xs font-mono text-gray-400 hover:text-honey-400 hover:bg-hive-border transition-all"
              >
                SolanaFM
              </a>
            </div>
          </div>
        </div>

        {/* Recent TX table */}
        <div className="lg:col-span-2 bg-hive-card border border-hive-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-hive-border">
            <p className="text-xs text-gray-500 font-mono uppercase">
              Recent Transactions
            </p>
          </div>

          {recentTxs.length === 0 ? (
            <div className="p-8 text-center text-gray-600 font-mono text-sm">
              No recent transactions.
            </div>
          ) : (
            <div className="divide-y divide-hive-border">
              {recentTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-2.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-600 font-mono">
                      {tx.type}
                    </span>
                    <span className="text-xs text-gray-500 font-mono truncate">
                      {tx.signature.slice(0, 16)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {tx.amount != null && (
                      <span className="text-xs font-mono text-honey-400">
                        {tx.amount.toFixed(4)}
                      </span>
                    )}
                    <a
                      href={URLS.solscan(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-honey-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
