"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { URLS, WALLET_ADDRESS, MAIN_TOKEN_CA } from "@/lib/constants";
import HiveBuys from "@/components/HiveBuys";
import EcosystemActivity from "@/components/EcosystemActivity";

function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!MAIN_TOKEN_CA) return;
    await navigator.clipboard.writeText(MAIN_TOKEN_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gradient-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.2)] mb-6">
      <p className="text-xs text-ink-faint uppercase tracking-wide mb-2">
        The Hive Contract Address
      </p>
      {MAIN_TOKEN_CA ? (
        <div className="flex items-center gap-3">
          <code className="text-sm font-mono text-ink truncate flex-1">
            {MAIN_TOKEN_CA}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-honey/20 hover:border-honey/40 text-xs font-medium text-honey transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <a
            href={URLS.pumpFun(MAIN_TOKEN_CA)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1.5 text-ink-faint hover:text-honey transition-colors"
            title="View on pump.fun"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-honey animate-live-pulse" />
          <p className="text-sm font-mono text-ink-muted">Launching soon</p>
        </div>
      )}
    </div>
  );
}

export default function LiveActivity() {
  const { ref, visible } = useScrollReveal();

  return (
    <section ref={ref} id="activity" className="max-w-5xl mx-auto px-6 py-20">
      <div
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-ink-faint mb-2">
              Wallet
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-ink">
              Live Activity
            </h2>
          </div>

          <a
            href={URLS.solscanAccount(WALLET_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-ink-faint hover:text-honey transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
            {WALLET_ADDRESS
              ? `${WALLET_ADDRESS.slice(0, 6)}...${WALLET_ADDRESS.slice(-4)}`
              : "..."}
          </a>
        </div>

        <ContractAddress />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HiveBuys />
          <EcosystemActivity />
        </div>
      </div>
    </section>
  );
}
