"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS = [
  { num: "01", title: "Spot Trends", desc: "Monitors what's trending on Solana" },
  { num: "02", title: "Launch Token", desc: "Deploys bee-themed coins on pump.fun" },
  { num: "03", title: "Collect Fees", desc: "Earns creator fees from every launch" },
  { num: "04", title: "Buy Back The Hive", desc: "All fees funnel back into the nest" },
];

export default function Flywheel() {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="relative py-20 px-6 overflow-hidden">
      {/* Section dividers */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Honeycomb texture overlay */}
      <div className="absolute inset-0 honeycomb-bg opacity-50 pointer-events-none" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-honey/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-honey/60 mb-3">How It Works</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-ink">
            Every token feeds the hive
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`rounded-xl bg-white/[0.03] border border-honey/[0.10] p-6 transition-all duration-700
                hover:bg-honey/[0.06] hover:border-honey/25
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${100 + i * 80}ms` }}
            >
              <span className="text-xs font-mono text-honey/50">{step.num}</span>
              <h3 className="font-heading font-bold text-base text-ink mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Flow arrows */}
        <div className="hidden lg:flex items-center justify-center mt-6 gap-1">
          {["Trend", "Launch", "Earn", "Buyback"].map((label, i) => (
            <div key={label} className="flex items-center">
              <span className="text-xs text-honey/40 font-mono">{label}</span>
              {i < 3 && (
                <svg className="w-4 h-4 text-honey/30 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
          <svg className="w-4 h-4 text-honey/30 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
