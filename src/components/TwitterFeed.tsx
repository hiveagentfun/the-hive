"use client";

import { useEffect, useRef } from "react";
import { TWITTER_HANDLE } from "@/lib/constants";

export default function TwitterFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">
        Latest Updates
      </h2>

      <div
        ref={containerRef}
        className="bg-hive-card border border-hive-border rounded-xl overflow-hidden max-h-[600px]"
      >
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-chrome="noheader nofooter noborders transparent"
          data-height="580"
          href={`https://twitter.com/${TWITTER_HANDLE}`}
        >
          Loading tweets...
        </a>
      </div>
    </section>
  );
}
