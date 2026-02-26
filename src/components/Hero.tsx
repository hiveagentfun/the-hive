"use client";

import { useCallback } from "react";
import Image from "next/image";
import CopyButton from "./CopyButton";
import { WALLET_ADDRESS, URLS } from "@/lib/constants";
import { usePolling } from "@/hooks/usePolling";

interface Stats {
  walletBalance: number | null;
}

export default function Hero() {
  const fetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const { data } = usePolling<Stats>(fetcher, 30000);

  return (
    <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.1)_0%,transparent_70%)]" />

      {/* Background bee logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Image
          src="/bee-logo.svg"
          alt=""
          width={200}
          height={200}
          className="opacity-[0.06]"
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Tagline */}
        <p className="opacity-0 animate-fade-in-up text-honey-500 text-sm tracking-widest uppercase mb-4">
          the colony never sleeps
        </p>

        {/* Title */}
        <h1 className="opacity-0 animate-fade-in-up-delay-1 font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-6">
          <span className="text-white">THE </span>
          <span className="bg-gradient-to-r from-honey-300 via-honey-500 to-honey-700 bg-clip-text text-transparent">
            HIVE
          </span>
        </h1>

        {/* Description */}
        <p className="opacity-0 animate-fade-in-up-delay-2 text-hive-muted text-lg sm:text-xl max-w-2xl mx-auto mb-8">
          we launch tokens, buy them back, and keep the hive buzzing.
          everything this wallet does, live.
        </p>

        {/* Wallet balance */}
        <div className="opacity-0 animate-fade-in-up-delay-3 mb-8">
          <p className="text-5xl sm:text-6xl font-heading font-extrabold text-white mb-1">
            {data?.walletBalance != null
              ? `${data.walletBalance.toFixed(2)} SOL`
              : "--"}
          </p>
          <p className="text-sm text-hive-muted">wallet balance</p>
        </div>

        {/* Action pills */}
        <div className="opacity-0 animate-fade-in-up-delay-4 flex flex-wrap items-center justify-center gap-3">
          <CopyButton text={WALLET_ADDRESS} label="Copy Address" showAddress={false} />

          <a
            href={URLS.solscanAccount(WALLET_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-card border border-hive-border
              hover:border-honey-500/50 transition-all duration-200 text-sm text-hive-muted hover:text-white"
          >
            Solscan
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
