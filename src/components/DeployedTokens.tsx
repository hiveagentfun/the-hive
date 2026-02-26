"use client";

import { useCallback } from "react";
import Image from "next/image";
import { usePolling } from "@/hooks/usePolling";
import { URLS } from "@/lib/constants";
import CopyButton from "./CopyButton";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  deployedAt: string;
  status: string;
}

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
        Deployed Tokens
      </h2>

      {loading && tokens.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-hive-card border border-hive-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-hive-card border border-hive-border rounded-xl p-12 text-center text-gray-500 font-mono text-sm">
          No deployed tokens yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="bg-hive-card border border-hive-border rounded-xl p-5 hover:border-honey-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 mb-3">
                {token.imageUrl ? (
                  <Image
                    src={token.imageUrl}
                    alt={token.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-honey-500/10 flex items-center justify-center text-honey-400 font-bold text-sm">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-white truncate">
                    {token.name}
                  </h3>
                  <p className="text-xs text-honey-400 font-mono">${token.symbol}</p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    token.status === "active"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : token.status === "graduated"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {token.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-3">
                <CopyButton text={token.mintAddress} className="w-full justify-center text-xs" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-mono">
                  {new Date(token.deployedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <a
                    href={URLS.pumpFun(token.mintAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-honey-400 font-mono transition-colors"
                  >
                    pump.fun
                  </a>
                  <a
                    href={URLS.dexscreener(token.mintAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-honey-400 font-mono transition-colors"
                  >
                    dexscreener
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
