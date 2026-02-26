"use client";

import { usePolling } from "@/hooks/usePolling";
import { useCallback } from "react";

interface Stats {
  totalDeploys: number;
  totalBuybacks: number;
  totalBuybackSol: number;
}

function DeployIcon() {
  return (
    <svg className="w-5 h-5 text-honey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V6m0 0l-3 3m3-3l3 3" />
    </svg>
  );
}

function BuybackIcon() {
  return (
    <svg className="w-5 h-5 text-honey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function SolIcon() {
  return (
    <svg className="w-5 h-5 text-honey-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      label: "Tokens Launched",
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
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="hex-card bg-hive-card p-6 sm:p-8 text-center hover:glow-amber transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              {s.icon}
              <span className="text-xs text-hive-muted uppercase tracking-wider">
                {s.label}
              </span>
            </div>
            {loading ? (
              <div className="h-10 w-28 mx-auto bg-hive-border rounded animate-pulse" />
            ) : (
              <p className="text-4xl sm:text-5xl font-heading font-bold text-white">
                {s.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
