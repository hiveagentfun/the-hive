"use client";

import { useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { URLS } from "@/lib/constants";

interface Buyback {
  id: string;
  signature: string;
  solAmount: number;
  tokenAmount: number;
  tokenMint: string;
  timestamp: string;
}

export default function BuybackTracker() {
  const fetcher = useCallback(
    () => fetch("/api/buybacks?limit=20").then((r) => r.json()),
    []
  );
  const { data, loading } = usePolling<{
    buybacks: Buyback[];
    totalSolSpent: number;
  }>(fetcher, 30000);

  const buybacks = data?.buybacks || [];
  const totalSolSpent = data?.totalSolSpent || 0;

  return (
    <section id="buybacks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">
          Buyback Tracker
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-mono">Total Spent</p>
          <p className="text-lg font-heading font-bold text-green-400">
            {totalSolSpent.toFixed(2)} SOL
          </p>
        </div>
      </div>

      <div className="bg-hive-card border border-hive-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 px-4 sm:px-6 py-3 border-b border-hive-border text-xs text-gray-500 font-mono uppercase">
          <span>Date</span>
          <span>SOL Spent</span>
          <span className="hidden sm:block">Token</span>
          <span className="text-right">TX</span>
        </div>

        {loading && buybacks.length === 0 ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-hive-border rounded animate-pulse" />
            ))}
          </div>
        ) : buybacks.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-mono text-sm">
            No buybacks recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-hive-border">
            {buybacks.map((bb, i) => {
              // running total
              const runningTotal = buybacks
                .slice(i)
                .reduce((sum, b) => sum + b.solAmount, 0);

              return (
                <div
                  key={bb.id}
                  className="grid grid-cols-4 gap-4 px-4 sm:px-6 py-3 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="text-sm text-gray-400 font-mono">
                    {new Date(bb.timestamp).toLocaleDateString()}
                  </span>
                  <div>
                    <span className="text-sm font-mono text-green-400 font-bold">
                      {bb.solAmount.toFixed(4)} SOL
                    </span>
                    <p className="text-[10px] text-gray-600 font-mono">
                      Running: {runningTotal.toFixed(2)}
                    </p>
                  </div>
                  <span className="hidden sm:block text-xs text-gray-500 font-mono truncate">
                    {bb.tokenMint.slice(0, 8)}...
                  </span>
                  <div className="text-right">
                    <a
                      href={URLS.solscan(bb.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-honey-400 transition-colors"
                    >
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
