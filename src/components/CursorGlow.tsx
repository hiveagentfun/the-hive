"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[1] opacity-0 transition-opacity duration-300 hidden lg:block"
      style={{
        background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
