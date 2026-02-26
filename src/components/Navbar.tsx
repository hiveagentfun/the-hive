"use client";

import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Tokens", href: "#tokens" },
  { label: "Activity", href: "#activity" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-hive-dark/80 border-b border-hive-border shadow-[0_1px_12px_rgba(245,166,35,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Image src="/bee-logo.svg" alt="The Hive" width={40} height={40} />
            <span className="font-heading font-bold text-xl text-white group-hover:text-honey-400 transition-colors">
              THE HIVE
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-hive-muted hover:text-honey-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: status dot */}
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-honey-400 animate-pulse" />
            <span className="text-xs text-hive-muted">LIVE</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-hive-muted hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-hive-border bg-hive-dark/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-hive-muted hover:text-honey-400"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
