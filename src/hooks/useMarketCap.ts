"use client";

import { useCallback, useMemo } from "react";
import { usePolling } from "./usePolling";

export interface Milestone {
  label: string;
  target: number;
  progress: number;
  reached: boolean;
}

const MILESTONES = [
  { label: "Bonding", target: 69_000 },
  { label: "$100K", target: 100_000 },
  { label: "$150K", target: 150_000 },
  { label: "$200K", target: 200_000 },
  { label: "$300K", target: 300_000 },
  { label: "$500K", target: 500_000 },
  { label: "$1M", target: 1_000_000 },
];

interface StatsResponse {
  marketCap: number | null;
}

export function useMarketCap() {
  const fetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const { data } = usePolling<StatsResponse>(fetcher, 10_000);

  const marketCap = data?.marketCap ?? 0;

  const milestones: Milestone[] = useMemo(
    () =>
      MILESTONES.map((m, i) => {
        const floor = i === 0 ? 0 : MILESTONES[i - 1].target;
        const range = m.target - floor;
        const progress =
          marketCap >= m.target
            ? 1
            : marketCap <= floor
              ? 0
              : (marketCap - floor) / range;
        return {
          label: m.label,
          target: m.target,
          progress,
          reached: marketCap >= m.target,
        };
      }),
    [marketCap]
  );

  return { marketCap, milestones };
}
