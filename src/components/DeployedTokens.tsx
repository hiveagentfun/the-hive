"use client";

import { useCallback } from "react";
import Image from "next/image";
import { usePolling } from "@/hooks/usePolling";
import { URLS } from "@/lib/constants";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  deployedAt: string;
  status: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: "LIVE", color: "bg-honey-500/20 text-honey-400 border-honey-500/30" },
  graduated: { label: "ON DEX", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  rugged: { label: "DEAD", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function DeployedTokens() {
  const fetcher = useCallback(
    () => fetch("/api/tokens?limit=20").then((r) => r.json()),
    []
  );
  const { data, loading } = usePolling<{ tokens: Token[] }>(fetcher, 30000);

  const tokens = data?.tokens || [];

  return (
    <section id="tokens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">
        Launched Tokens
      </h2>

      {loading && tokens.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-hive-card border border-hive-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-hive-card border border-hive-border rounded-xl p-12 text-center text-hive-muted text-sm">
          No tokens launched yet. The bees are warming up.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => {
            const status = STATUS_MAP[token.status] || STATUS_MAP.active;
            return (
              <div
                key={token.id}
                className="hex-card bg-hive-card p-6 hover:glow-amber transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {token.imageUrl ? (
                    <Image
                      src={token.imageUrl}
                      alt={token.name}
                      width={52}
                      height={52}
                      unoptimized
                      className="w-13 h-13 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-lg bg-honey-500/10 flex items-center justify-center text-honey-400 font-bold text-lg">
                      {token.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-bold text-white text-lg truncate">
                      {token.name}
                    </h3>
                    <p className="text-sm text-honey-400 font-mono">${token.symbol}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-hive-muted">
                    {new Date(token.deployedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={URLS.pumpFun(token.mintAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-xs bg-honey-500/10 text-honey-400 hover:bg-honey-500/20 transition-colors"
                    >
                      pump.fun
                    </a>
                    <a
                      href={URLS.dexscreener(token.mintAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-xs bg-honey-500/10 text-honey-400 hover:bg-honey-500/20 transition-colors"
                    >
                      dexscreener
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
