"use client";

import { usePolling } from "@/hooks/usePolling";
import { useCallback } from "react";

interface Stats {
  totalDeploys: number;
  totalBuybacks: number;
  totalBuybackSol: number;
  totalFeeClaims: number;
  walletBalance: number | null;
}

// lil svg icons so we dont have to pull in a whole icon lib
function DeployIcon() {
  return (
    <svg className="w-4 h-4 text-honey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V6m0 0l-3 3m3-3l3 3" />
    </svg>
  );
}

function BuybackIcon() {
  return (
    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function SolIcon() {
  return (
    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

export default function StatsBar() {
  const fetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const { data, loading } = usePolling<Stats>(fetcher, 30000);

  const stats = [
    {
      label: "Tokens Deployed",
      value: data?.totalDeploys ?? 0,
      icon: <DeployIcon />,
    },
    {
      label: "Buybacks",
      value: data?.totalBuybacks ?? 0,
      icon: <BuybackIcon />,
    },
    {
      label: "SOL Bought Back",
      value: `${(data?.totalBuybackSol ?? 0).toFixed(2)} SOL`,
      icon: <SolIcon />,
    },
    {
      label: "Wallet Balance",
      value: data?.walletBalance != null ? `${data.walletBalance.toFixed(2)} SOL` : "--",
      icon: <WalletIcon />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-hive-card border border-hive-border rounded-xl p-4 sm:p-5 hover:border-honey-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              {s.icon}
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                {s.label}
              </span>
            </div>
            {loading ? (
              <div className="h-8 w-24 bg-hive-border rounded animate-pulse" />
            ) : (
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
                {s.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
