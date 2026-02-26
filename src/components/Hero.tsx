"use client";

import CopyButton from "./CopyButton";
import { WALLET_ADDRESS, TWITTER_HANDLE, URLS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.08)_0%,transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto">
        {/* Tagline */}
        <p className="opacity-0 animate-fade-in-up text-honey-500 font-mono text-sm tracking-widest uppercase mb-4">
          Wallet Tracker
        </p>

        {/* Title */}
        <h1 className="opacity-0 animate-fade-in-up-delay-1 font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-6">
          <span className="text-white">THE </span>
          <span className="bg-gradient-to-r from-honey-400 via-honey-500 to-honey-600 bg-clip-text text-transparent">
            HIVE
          </span>
        </h1>

        {/* Description */}
        <p className="opacity-0 animate-fade-in-up-delay-2 text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Tracking deploys, buybacks, and activity for the HIVE wallet on Solana.
          Updated live.
        </p>

        {/* Action pills */}
        <div className="opacity-0 animate-fade-in-up-delay-3 flex flex-wrap items-center justify-center gap-3">
          <CopyButton text={WALLET_ADDRESS} label="Wallet" />

          <a
            href={URLS.twitter(TWITTER_HANDLE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-card border border-hive-border
              hover:border-honey-500/50 transition-all duration-200 text-sm font-mono text-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @{TWITTER_HANDLE}
          </a>

          <a
            href={URLS.solscanAccount(WALLET_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-card border border-hive-border
              hover:border-honey-500/50 transition-all duration-200 text-sm font-mono text-gray-400 hover:text-white"
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
