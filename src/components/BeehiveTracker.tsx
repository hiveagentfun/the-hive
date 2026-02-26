"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMarketCap } from "@/hooks/useMarketCap";
import type { Milestone } from "@/hooks/useMarketCap";

/* ── Hex geometry ─────────────────────────────────────────── */

const R = 18; // circumradius
const S = 19; // spacing (R + gap)

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

// 19-cell hex flower in axial coords, ordered bottom-to-top for fill
const HEX_CELLS: [number, number][] = [
  // row r=2 (bottom, 3 cells)
  [-1, 2], [0, 2], [1, 2],
  // row r=1 (4 cells)
  [-1, 1], [0, 1], [1, 1], [-2, 1],
  // row r=0 (center, 5 cells)
  [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
  // row r=-1 (4 cells)
  [-1, -1], [0, -1], [1, -1], [2, -1],
  // row r=-2 (top, 3 cells)
  [0, -2], [1, -2], [-1, -2],
];

/* ── HexCell ──────────────────────────────────────────────── */

function HexCell({
  q,
  r,
  fillFraction,
  index,
  gradientId,
}: {
  q: number;
  r: number;
  fillFraction: number;
  index: number;
  gradientId: string;
}) {
  const [cx, cy] = axialToPixel(q, r);
  const clipId = `clip-${gradientId}-${index}`;
  // Hex bounding box for clip rect
  const top = cy - R;
  const height = R * 2;
  const fillHeight = height * fillFraction;
  const fillY = top + height - fillHeight;

  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Border */}
      <path
        d={hexPath(R)}
        fill="none"
        stroke="rgba(245,166,35,0.12)"
        strokeWidth={1}
      />
      {/* Honey fill clipped from bottom */}
      {fillFraction > 0 && (
        <>
          <defs>
            <clipPath id={clipId}>
              <motion.rect
                x={-R}
                width={R * 2}
                initial={{ y: R, height: 0 }}
                animate={{ y: fillY - cy, height: fillHeight }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </clipPath>
          </defs>
          <path
            d={hexPath(R - 0.5)}
            fill={`url(#${gradientId})`}
            clipPath={`url(#${clipId})`}
          />
        </>
      )}
    </g>
  );
}

/* ── HiveSVG ──────────────────────────────────────────────── */

function HiveSVG({
  milestone,
  hiveIndex,
}: {
  milestone: Milestone;
  hiveIndex: number;
}) {
  const gradientId = `honey-grad-${hiveIndex}`;
  const glowId = `honey-glow-${hiveIndex}`;
  const totalCells = HEX_CELLS.length;

  return (
    <svg
      viewBox="-75 -65 150 130"
      className="max-w-[140px] w-full mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c77d0a" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
        <filter id={glowId}>
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f5a623" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter={milestone.reached ? `url(#${glowId})` : undefined}>
        {HEX_CELLS.map(([q, r], i) => {
          // Each cell fills sequentially based on overall progress
          const cellThreshold = i / totalCells;
          const cellProgress =
            milestone.progress <= cellThreshold
              ? 0
              : Math.min(
                  (milestone.progress - cellThreshold) / (1 / totalCells),
                  1
                );
          return (
            <HexCell
              key={`${q}-${r}`}
              q={q}
              r={r}
              fillFraction={cellProgress}
              index={i}
              gradientId={gradientId}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ── Queen Bee SVG ────────────────────────────────────────── */

function QueenBeeSVG() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-12 h-12">
      {/* Crown */}
      <polygon points="10,10 12,6 14,9 16,4 18,9 20,6 22,10" fill="#f5a623" />
      {/* Wings */}
      <ellipse cx="10" cy="14" rx="5" ry="3" fill="#f5a623" opacity="0.3" transform="rotate(-15 10 14)" />
      <ellipse cx="22" cy="14" rx="5" ry="3" fill="#f5a623" opacity="0.3" transform="rotate(15 22 14)" />
      {/* Body */}
      <ellipse cx="16" cy="20" rx="6" ry="8" fill="#f5a623" />
      {/* Stripes */}
      <rect x="10" y="17.5" width="12" height="2" rx="1" fill="#141414" />
      <rect x="10" y="21.5" width="12" height="2" rx="1" fill="#141414" />
      {/* Head */}
      <circle cx="16" cy="12" r="4" fill="#141414" />
      {/* Eyes */}
      <circle cx="14.5" cy="11.5" r="1.2" fill="white" />
      <circle cx="17.5" cy="11.5" r="1.2" fill="white" />
    </svg>
  );
}

/* ── Queen Bee Celebration Overlay ────────────────────────── */

function QueenBeeOverlay({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12;
    return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 };
  });

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Queen bee entrance */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.1, 1, 1.08, 1, 1.08, 1],
              opacity: [0, 1, 1, 1, 1, 1, 1],
            }}
            transition={{
              duration: 2,
              times: [0, 0.25, 0.35, 0.5, 0.6, 0.75, 0.85],
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 0px #f5a623)",
                  "drop-shadow(0 0 12px #f5a623)",
                  "drop-shadow(0 0 4px #f5a623)",
                ],
              }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <QueenBeeSVG />
            </motion.div>
          </motion.div>

          {/* Egg */}
          <motion.div
            className="absolute"
            style={{ top: "60%" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1.3, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              times: [0, 0.3, 0.7, 1],
            }}
          >
            <div className="w-4 h-5 rounded-full bg-gradient-to-b from-honey to-honey-dark" />
          </motion.div>

          {/* Hatched hex */}
          <motion.div
            className="absolute"
            style={{ top: "60%" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <svg viewBox="-12 -12 24 24" className="w-6 h-6">
              <path d={hexPath(10)} fill="#f5a623" />
            </svg>
          </motion.div>

          {/* Burst particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-honey"
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 1.5 + i * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}

          {/* Full overlay auto-dismiss */}
          <motion.div
            initial={{}}
            animate={{}}
            transition={{ duration: 3 }}
            onAnimationComplete={() => onComplete()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Format helpers ───────────────────────────────────────── */

function formatMarketCap(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

/* ── Main Component ───────────────────────────────────────── */

export default function BeehiveTracker() {
  const { ref, visible } = useScrollReveal(0.1);
  const { marketCap, milestones } = useMarketCap(0);
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const prevReached = useRef<boolean[]>(milestones.map((m) => m.reached));

  // Detect milestone transitions
  useEffect(() => {
    milestones.forEach((m, i) => {
      if (m.reached && !prevReached.current[i]) {
        setCelebrating(i);
      }
    });
    prevReached.current = milestones.map((m) => m.reached);
  }, [milestones]);

  const handleCelebrationEnd = useCallback(() => {
    setCelebrating(null);
  }, []);

  return (
    <section ref={ref} className="relative max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div
        className={`text-center mb-12 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-xs tracking-[0.2em] uppercase text-honey-dark mb-2">
          Market Cap
        </p>
        <div className="relative inline-block">
          <p className="text-4xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight">
            {formatMarketCap(marketCap)}
          </p>
        </div>
      </div>

      {/* Hive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
        {milestones.map((milestone, i) => (
          <div
            key={milestone.label}
            className={`text-center transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {/* Hive container */}
            <div className="relative flex items-center justify-center mb-3">
              <HiveSVG milestone={milestone} hiveIndex={i} />
              <QueenBeeOverlay
                show={celebrating === i}
                onComplete={handleCelebrationEnd}
              />
            </div>

            {/* Label */}
            <p className="text-xs font-heading font-bold text-ink mb-1.5">
              {milestone.label}
            </p>

            {/* Progress bar */}
            <div className="h-1 bg-honey/10 rounded-full overflow-hidden mx-auto max-w-[120px]">
              <motion.div
                className={`h-full rounded-full ${
                  milestone.reached
                    ? "bg-honey animate-honey-glow"
                    : "bg-gradient-to-r from-honey-dark to-honey"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(milestone.progress * 100)}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Percentage */}
            <p className="text-[10px] text-ink-faint mt-1">
              {Math.round(milestone.progress * 100)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
