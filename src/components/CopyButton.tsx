"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label,
  showAddress = true,
  className = "",
}: {
  text: string;
  label?: string;
  showAddress?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-honey/20
        hover:border-honey/40 hover:bg-honey/[0.06] transition-all duration-200 text-sm ${className}`}
    >
      {label && <span className="text-ink-muted">{label}</span>}
      {showAddress && (
        <span className="text-ink font-mono">
          {text.slice(0, 4)}...{text.slice(-4)}
        </span>
      )}
      <span className="text-xs">
        {copied ? (
          <span className="text-honey font-medium">Copied!</span>
        ) : (
          <svg className="w-3.5 h-3.5 text-honey/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}
