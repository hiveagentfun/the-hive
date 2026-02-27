"use client";

import Image from "next/image";
import { useState } from "react";
import { MAIN_TOKEN_CA, URLS } from "@/lib/constants";

function CaButton() {
  const [copied, setCopied] = useState(false);

  if (!MAIN_TOKEN_CA) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-honey/10">
        <span className="w-1 h-1 rounded-full bg-honey animate-live-pulse" />
        <span className="text-[10px] text-ink-faint font-medium">CA Soon</span>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAIN_TOKEN_CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const short = `${MAIN_TOKEN_CA.slice(0, 4)}...${MAIN_TOKEN_CA.slice(-4)}`;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-honey/20 hover:border-honey/40 transition-colors"
      >
        <span className="text-[11px] font-mono text-ink-muted">{short}</span>
        <span className="text-[10px] text-honey font-medium">
          {copied ? "Copied!" : "CA"}
        </span>
      </button>
      <a
        href={URLS.pumpFun(MAIN_TOKEN_CA)}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 text-ink-faint hover:text-honey transition-colors"
        title="View on pump.fun"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-void/80 border-b border-honey/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <a href="#" className="flex items-center gap-2 group">
            <Image src="/bee-logo.svg" alt="The Hive" width={28} height={28} className="group-hover:animate-bee-flutter transition-transform" />
            <span className="font-heading font-bold text-sm text-ink group-hover:text-honey transition-colors">THE HIVE</span>
          </a>

          <CaButton />
        </div>
      </div>

    </nav>
  );
}
