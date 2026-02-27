"use client";

import { useCallback } from "react";
import { usePolling } from "@/hooks/usePolling";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

interface Stats {
  totalDeploys: number;
  totalBuybacks: number;
  totalBuybackSol: number;
}

function AnimatedStat({ value, isSol, label, suffix }: { value: number; isSol: boolean; label: string; suffix: string }) {
  const animated = useCountUp(value, 1000);
  const display = isSol
    ? animated < 0.01
      ? animated.toFixed(4)
      : animated.toFixed(2)
    : Math.round(animated).toString();

  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
        {display}
        {suffix && (
          <span className="text-sm text-honey ml-1">{suffix}</span>
        )}
      </p>
      <p className="text-xs text-ink-faint mt-1">{label}</p>
    </div>
  );
}

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
        <AnimatedStat value={data?.totalDeploys ?? 0} isSol={false} label="Tokens Launched" suffix="" />
        <AnimatedStat value={data?.totalBuybacks ?? 0} isSol={false} label="Buybacks" suffix="" />
        <AnimatedStat value={data?.totalBuybackSol ?? 0} isSol={true} label="SOL Recycled" suffix=" SOL" />
      </div>
    </section>
  );
}
