import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        honey: {
          DEFAULT: "#f5a623",
          light: "#ffd98e",
          dark: "#c77d0a",
          muted: "rgba(245,166,35,0.10)",
        },
        ink: {
          DEFAULT: "#e5e5e5",
          secondary: "#c4c4c4",
          muted: "#8a8a8a",
          faint: "#7a7a7a",
        },
        surface: {
          DEFAULT: "#141414",
          subtle: "#111111",
          raised: "#1a1a1a",
        },
        border: {
          DEFAULT: "#2a2a2a",
          strong: "#3a3a3a",
        },
        void: {
          DEFAULT: "#0a0a0a",
          soft: "#141414",
          card: "#1a1a1a",
        },
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      transitionTimingFunction: {
        "apple-spring": "cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        beeFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        livePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        hexPulse: {
          "0%, 100%": { opacity: "0.08" },
          "50%": { opacity: "0.18" },
        },
        honeyGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 0px #f5a623)" },
          "50%": { filter: "drop-shadow(0 0 8px #f5a623)" },
        },
        orbDrift1: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(60px, 40px)" },
          "66%": { transform: "translate(-30px, 70px)" },
        },
        orbDrift2: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(-50px, -30px)" },
          "66%": { transform: "translate(40px, -60px)" },
        },
        orbDrift3: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(30px, -50px)" },
          "66%": { transform: "translate(-60px, 20px)" },
        },
        beeFlutter: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "25%": { transform: "rotate(-8deg) scale(1.1)" },
          "75%": { transform: "rotate(8deg) scale(1.1)" },
        },
        hexSweep: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in-up-delay-1": "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s forwards",
        "fade-in-up-delay-2": "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards",
        "fade-in-up-delay-3": "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s forwards",
        "fade-in-up-delay-4": "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s forwards",
        "gradient-shift": "gradientShift 4s ease infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        "bee-float": "beeFloat 3s ease-in-out infinite",
        "live-pulse": "livePulse 2s ease-in-out infinite",
        "honey-glow": "honeyGlow 2s ease-in-out infinite",
        "hex-pulse": "hexPulse 3s ease-in-out infinite",
        "orb-drift-1": "orbDrift1 25s ease-in-out infinite",
        "orb-drift-2": "orbDrift2 30s ease-in-out infinite",
        "orb-drift-3": "orbDrift3 20s ease-in-out infinite",
        "bee-flutter": "beeFlutter 0.4s ease-in-out",
        "hex-sweep": "hexSweep 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
