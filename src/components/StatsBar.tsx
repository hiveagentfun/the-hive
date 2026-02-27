"use client";

import { useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Stats {
  totalDeploys: number;
  totalBuybacks: number;
  totalBuybackSol: number;
}

const STATS_CONFIG = [
  { key: "totalDeploys" as const, label: "Tokens Launched", suffix: "" },
  { key: "totalBuybacks" as const, label: "Buybacks", suffix: "" },
  { key: "totalBuybackSol" as const, label: "SOL Recycled", suffix: " SOL" },
];

export default function StatsBar() {
  const { ref, visible } = useScrollReveal(0.2);
  const fetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const { data } = usePolling<Stats>(fetcher, 10_000);

  return (
    <section ref={ref} className="max-w-4xl mx-auto px-6 py-10">
      <div
        className={`grid grid-cols-3 gap-4 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {STATS_CONFIG.map(({ key, label, suffix }) => {
          const value = data?.[key] ?? 0;
          const display =
            key === "totalBuybackSol"
              ? value < 0.01
                ? value.toFixed(4)
                : value.toFixed(2)
              : value.toString();

          return (
            <div key={key} className="text-center">
              <p className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                {display}
                {suffix && (
                  <span className="text-sm text-honey ml-1">{suffix}</span>
                )}
              </p>
              <p className="text-xs text-ink-faint mt-1">{label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
