"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { id: "how-it-works", label: "How It Works", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "market-cap", label: "Market Cap", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { id: "tokens", label: "Ecosystem", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "activity", label: "Activity", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export default function SideNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActive(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-0.5">
      <div className="bg-surface/60 backdrop-blur-md border border-border/40 rounded-2xl p-2 shadow-lg shadow-black/20">
        {SECTIONS.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-honey/10"
                  : "hover:bg-white/[0.04]"
              }`}
              title={label}
            >
              <svg
                className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-honey"
                    : "text-ink-faint/50 group-hover:text-ink-faint"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={icon} />
              </svg>
              <span
                className={`text-[11px] font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-honey"
                    : "text-ink-faint/50 group-hover:text-ink-faint"
                }`}
              >
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
