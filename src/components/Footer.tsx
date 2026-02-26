"use client";

import Image from "next/image";
import { TWITTER_HANDLE, WALLET_ADDRESS, URLS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-hive-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/bee-logo.svg" alt="The Hive" width={28} height={28} />
            <span className="font-heading font-bold text-lg text-white">
              THE HIVE
            </span>
            <span className="text-hive-muted text-sm">|</span>
            <span className="text-hive-muted text-sm">
              Solana
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Twitter CTA */}
            <a
              href={URLS.twitter(TWITTER_HANDLE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey-500/10 text-honey-400 hover:bg-honey-500/20 transition-colors text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              follow @{TWITTER_HANDLE}
            </a>
            <a
              href={URLS.solscanAccount(WALLET_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hive-muted hover:text-honey-400 transition-colors text-sm"
            >
              Solscan
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-hive-border/50 text-center">
          <p className="text-xs text-hive-muted">
            hiveagent.fun
          </p>
        </div>
      </div>
    </footer>
  );
}
