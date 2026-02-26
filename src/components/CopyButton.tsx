"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label?: string;
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hive-card border border-hive-border
        hover:border-honey-500/50 transition-all duration-200 text-sm font-mono ${className}`}
    >
      {label && <span className="text-gray-400">{label}</span>}
      <span className="text-honey-400">
        {text.slice(0, 4)}...{text.slice(-4)}
      </span>
      <span className="text-xs">
        {copied ? (
          <span className="text-green-400">Copied!</span>
        ) : (
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}
