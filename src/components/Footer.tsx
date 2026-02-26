"use client";

import Image from "next/image";
import { TWITTER_HANDLE, WALLET_ADDRESS, URLS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-honey/10">
      {/* Honey accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-honey/30 to-transparent" />
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/bee-logo.svg" alt="The Hive" width={18} height={18} />
          <span className="font-heading font-bold text-xs text-ink">THE HIVE</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-ink-faint">
          <a href={URLS.twitter(TWITTER_HANDLE)} target="_blank" rel="noopener noreferrer" className="hover:text-honey-dark transition-colors">
            @{TWITTER_HANDLE}
          </a>
          <a href={URLS.solscanAccount(WALLET_ADDRESS)} target="_blank" rel="noopener noreferrer" className="hover:text-honey-dark transition-colors">
            Solscan
          </a>
          <span className="text-honey/40">hiveagent.fun</span>
        </div>
      </div>
    </footer>
  );
}
