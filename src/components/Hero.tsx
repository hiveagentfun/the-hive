"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import CopyButton from "./CopyButton";
import { WALLET_ADDRESS, MAIN_TOKEN_CA, URLS } from "@/lib/constants";
import { usePolling } from "@/hooks/usePolling";
import { useCountUp } from "@/hooks/useCountUp";

interface Stats {
  walletBalance: number | null;
}

function BeeIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="8" cy="8" rx="4" ry="2.5" fill="#f5a623" opacity="0.3" transform="rotate(-15 8 8)" />
      <ellipse cx="16" cy="8" rx="4" ry="2.5" fill="#f5a623" opacity="0.3" transform="rotate(15 16 8)" />
      <ellipse cx="12" cy="14" rx="5" ry="7" fill="#f5a623" />
      <rect x="7" y="11.5" width="10" height="1.8" rx="0.9" fill="#141414" />
      <rect x="7" y="15" width="10" height="1.8" rx="0.9" fill="#141414" />
      <circle cx="12" cy="7" r="3.5" fill="#141414" />
      <circle cx="10.5" cy="6.5" r="1" fill="white" />
      <circle cx="13.5" cy="6.5" r="1" fill="white" />
    </svg>
  );
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetcher = useCallback(
    () => fetch("/api/stats").then((r) => r.json()),
    []
  );
  const { data, loading } = usePolling<Stats>(fetcher, 10000);

  const rawBalance = data?.walletBalance ?? 0;
  const animatedBalance = useCountUp(rawBalance, 1000);

  // Typewriter effect
  const fullText = "A Solana agent that watches the current meta of the Solana trenches, launches bee-themed beta tokens, and funnels all fees back into The Hive.";
  const [typedLen, setTypedLen] = useState(0);
  const typeStarted = useRef(false);

  useEffect(() => {
    if (typeStarted.current) return;
    typeStarted.current = true;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        setTypedLen((prev) => {
          if (prev >= fullText.length) {
            clearInterval(id);
            return fullText.length;
          }
          return prev + 1;
        });
      }, 25);
    }, 800);
    return () => clearTimeout(delay);
  }, [fullText.length]);

  return (
    <section id="home" className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
      {/* Warm radial glow — slow parallax */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-honey/[0.08] blur-[120px] pointer-events-none"
        style={{ transform: `translate(-50%, calc(-50% + ${scrollY * 0.15}px))` }}
      />

      {/* Background floating bees — faster parallax */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-[15%] left-[8%] animate-bee-float opacity-[0.14]" style={{ animationDelay: "0s" }}>
          <BeeIcon className="w-10 h-10" />
        </div>
        <div className="absolute top-[20%] right-[12%] animate-bee-float opacity-[0.12]" style={{ animationDelay: "1s" }}>
          <BeeIcon className="w-12 h-12" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] animate-bee-float opacity-[0.10]" style={{ animationDelay: "2s" }}>
          <BeeIcon className="w-9 h-9" />
        </div>
        <div className="absolute bottom-[30%] right-[10%] animate-bee-float opacity-[0.08]" style={{ animationDelay: "1.5s" }}>
          <BeeIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Honeycomb bg — subtle parallax */}
      <div
        className="absolute inset-0 honeycomb-bg opacity-40 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
      />

      <div className="relative max-w-2xl mx-auto">
        <p className="opacity-0 animate-fade-in-up text-xs tracking-[0.2em] uppercase text-honey-dark mb-4">
          Solana Agent
        </p>

        <div className="relative inline-block">
          <h1 className="opacity-0 animate-fade-in-up-delay-1 font-heading font-extrabold text-5xl sm:text-6xl leading-[0.95] tracking-tight mb-5">
            <span className="text-ink">The </span>
            <span className="text-gradient-animated">Hive</span>
          </h1>
          <div className="absolute -right-7 -top-3 sm:-right-9 sm:-top-4 animate-bee-float opacity-0 animate-fade-in-up-delay-2">
            <BeeIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        <p className="opacity-0 animate-fade-in-up-delay-2 text-ink-muted text-base max-w-md mx-auto mb-10 leading-relaxed">
          {fullText.slice(0, typedLen)}
          {typedLen < fullText.length && (
            <span className="inline-block w-[2px] h-[1em] bg-honey/60 ml-0.5 align-middle animate-pulse" />
          )}
        </p>

        {/* Live Balance */}
        <div className="opacity-0 animate-fade-in-up-delay-3 mb-8">
          {loading ? (
            <div className="h-10 w-36 mx-auto skeleton" />
          ) : (
            <p className="text-4xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight transition-all duration-500">
              {animatedBalance < 0.01
                ? animatedBalance.toFixed(4)
                : animatedBalance.toFixed(2)}
              <span className="text-lg text-honey ml-2">SOL</span>
            </p>
          )}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="w-1 h-1 rounded-full bg-honey animate-live-pulse" />
            <p className="text-xs text-ink-faint tracking-wide uppercase">Live Balance</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="opacity-0 animate-fade-in-up-delay-4 flex flex-wrap items-center justify-center gap-2.5">
          {MAIN_TOKEN_CA ? (
            <a
              href={URLS.pumpFun(MAIN_TOKEN_CA)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                bg-gradient-to-r from-honey to-honey-dark text-void text-sm font-bold
                hover:shadow-lg hover:shadow-honey/25 transition-all"
            >
              Buy The Hive
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
              border border-honey/20 text-ink-faint text-sm font-bold cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-honey animate-live-pulse" />
              Buy The Hive
            </span>
          )}
          <CopyButton text={WALLET_ADDRESS} label="Wallet" showAddress />
        </div>
      </div>
    </section>
  );
}
