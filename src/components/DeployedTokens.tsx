"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePolling } from "@/hooks/usePolling";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MAIN_TOKEN_CA, URLS } from "@/lib/constants";

interface Token {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  deployedAt: string;
  status: string;
}

/* ── Hex geometry ─────────────────────────────────────────── */

const R = 20; // circumradius
const S = 22; // spacing (R + gap)

function hexPath(r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });
  return `M${pts.join("L")}Z`;
}

function axialToPixel(q: number, r: number): [number, number] {
  const x = S * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = S * (3 / 2) * r;
  return [x, y];
}

/* ── Fixed 6-cell beehive layout ──────────────────────────── */

// 1 center + 5 surrounding = 6 cells (partial first ring)
const HIVE_POSITIONS: [number, number][] = [
  [0, 0],    // center
  [1, 0],    // right
  [0, 1],    // bottom-right
  [-1, 1],   // bottom-left
  [-1, 0],   // left
  [0, -1],   // top-left
];

/* ── HexTokenCell ─────────────────────────────────────────── */

function HexCell({
  token,
  q,
  r,
  index,
  isMain,
  isSelected,
  onClick,
}: {
  token: Token | null;
  q: number;
  r: number;
  index: number;
  isMain: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [cx, cy] = axialToPixel(q, r);
  const filled = token !== null;
  const displayText = filled ? token.symbol.slice(0, 3).toUpperCase() : "";

  return (
    <motion.g
      transform={`translate(${cx},${cy})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.05 * index,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ cursor: filled ? "pointer" : "default" }}
      onClick={filled ? onClick : undefined}
    >
      {/* Hex border */}
      <path
        d={hexPath(R)}
        fill="none"
        stroke={
          isSelected
            ? "rgba(245,166,35,0.6)"
            : filled
              ? "rgba(245,166,35,0.15)"
              : "rgba(245,166,35,0.08)"
        }
        strokeWidth={isSelected ? 1.5 : 1}
        className={`transition-all duration-200${!filled ? " animate-hex-pulse" : ""}`}
        style={!filled ? { animationDelay: `${index * 0.4}s` } : undefined}
      />
      {/* Fill — honey gradient if token, empty if not */}
      <path
        d={hexPath(R - 1)}
        fill={
          filled
            ? isMain
              ? "url(#hex-fill-main)"
              : "url(#hex-fill)"
            : "url(#hex-fill-empty)"
        }
        className={`transition-all duration-200${!filled ? " animate-hex-pulse" : ""}`}
        style={!filled ? { animationDelay: `${index * 0.4}s` } : undefined}
      />
      {filled && (
        <>
          {token.imageUrl ? (
            <>
              <defs>
                <clipPath id={`hex-clip-${index}`}>
                  <path d={hexPath(R - 1)} />
                </clipPath>
              </defs>
              <image
                href={token.imageUrl}
                x={-(R - 1)}
                y={-(R - 1)}
                width={(R - 1) * 2}
                height={(R - 1) * 2}
                clipPath={`url(#hex-clip-${index})`}
                className="pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              />
            </>
          ) : (
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="7"
              fontWeight="700"
              fontFamily="Syne, sans-serif"
              fill={isMain ? "#f5a623" : "#e5e5e5"}
              className="pointer-events-none select-none"
            >
              {displayText}
            </text>
          )}
          {/* Hover overlay */}
          <path
            d={hexPath(R - 1)}
            fill="transparent"
            className="hover:fill-[rgba(245,166,35,0.08)]"
          />
        </>
      )}
    </motion.g>
  );
}

/* ── Token detail popover ─────────────────────────────────── */

function TokenPopover({
  token,
  isMain,
  onClose,
}: {
  token: Token;
  isMain: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mt-4 mx-auto max-w-sm rounded-xl border border-border bg-surface p-4 shadow-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-ink text-sm">{token.name}</h3>
          <span className="text-xs font-mono text-ink-faint">${token.symbol}</span>
          {isMain && (
            <span className="px-1.5 py-px rounded text-[10px] font-mono text-honey bg-honey/15">
              MAIN
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-ink-faint hover:text-ink transition-colors p-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mint address */}
      <div className="flex items-center gap-2 mb-3">
        <code className="text-xs font-mono text-ink-muted truncate flex-1">
          {token.mintAddress.slice(0, 12)}...{token.mintAddress.slice(-8)}
        </code>
        <button
          onClick={handleCopy}
          className="text-xs text-ink-faint hover:text-honey transition-colors shrink-0"
        >
          {copied ? <span className="text-honey">Copied!</span> : "Copy"}
        </button>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        <a
          href={URLS.solscanAccount(token.mintAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-faint hover:text-honey transition-colors"
        >
          Solscan
        </a>
        <a
          href={URLS.pumpFun(token.mintAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-faint hover:text-honey transition-colors"
        >
          pump.fun
        </a>
        <a
          href={URLS.dexscreener(token.mintAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-faint hover:text-honey transition-colors"
        >
          DexScreener
        </a>
      </div>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export default function DeployedTokens() {
  const { ref, visible } = useScrollReveal(0.1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetcher = useCallback(
    () => fetch("/api/tokens?limit=6").then((r) => r.json()),
    []
  );
  const { data } = usePolling<{ tokens: Token[] }>(fetcher, 30000);

  const tokens = data?.tokens || [];

  // Compute viewBox from the fixed 6 positions
  const viewBox = useMemo(() => {
    const pixels = HIVE_POSITIONS.map(([q, r]) => axialToPixel(q, r));
    const xs = pixels.map(([x]) => x);
    const ys = pixels.map(([, y]) => y);
    const pad = R + 8;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  }, []);

  const selectedToken = selectedId ? tokens.find((t) => t.id === selectedId) : null;

  return (
    <section ref={ref} id="tokens" className="relative py-20 px-6 overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Subtle honeycomb bg */}
      <div className="absolute inset-0 honeycomb-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div
          className={`text-center mb-10 transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-[0.1em] bg-gradient-to-r from-honey-dark via-honey to-honey-light bg-clip-text text-transparent">Ecosystem</h2>
          <p className="text-sm text-ink-faint mt-2">Tokens launched by The Hive on pump.fun</p>
        </div>

        <div
          className={`transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Beehive SVG — always 6 cells */}
          <svg
            viewBox={viewBox}
            className="mx-auto max-w-xs w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hex-fill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(245,166,35,0.06)" />
                <stop offset="100%" stopColor="rgba(245,166,35,0.12)" />
              </linearGradient>
              <linearGradient id="hex-fill-main" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(245,166,35,0.15)" />
                <stop offset="100%" stopColor="rgba(245,166,35,0.25)" />
              </linearGradient>
              <linearGradient id="hex-fill-empty" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(245,166,35,0.02)" />
                <stop offset="100%" stopColor="rgba(245,166,35,0.04)" />
              </linearGradient>
            </defs>
            {HIVE_POSITIONS.map(([q, r], i) => {
              const token = tokens[i] || null;
              const isMain = token ? token.mintAddress === MAIN_TOKEN_CA : false;
              return (
                <HexCell
                  key={`${q}-${r}`}
                  token={token}
                  q={q}
                  r={r}
                  index={i}
                  isMain={isMain}
                  isSelected={token ? selectedId === token.id : false}
                  onClick={() => {
                    if (token) {
                      setSelectedId((prev) => (prev === token.id ? null : token.id));
                    }
                  }}
                />
              );
            })}
          </svg>

          {/* Token detail popover */}
          <AnimatePresence>
            {selectedToken && (
              <TokenPopover
                key={selectedToken.id}
                token={selectedToken}
                isMain={selectedToken.mintAddress === MAIN_TOKEN_CA}
                onClose={() => setSelectedId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
