"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "market-cap", label: "Market Cap" },
  { id: "tokens", label: "Ecosystem" },
  { id: "activity", label: "Activity" },
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
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-honey/10"
                : "hover:bg-honey/[0.04]"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full shrink-0 transition-all duration-200 ${
                isActive
                  ? "bg-honey scale-125"
                  : "bg-ink-faint/40 group-hover:bg-ink-faint"
              }`}
            />
            <span
              className={`text-[11px] font-medium transition-colors duration-200 ${
                isActive
                  ? "text-honey"
                  : "text-ink-faint/60 group-hover:text-ink-faint"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
