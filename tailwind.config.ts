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
          50: "#fff9e6",
          100: "#fff0b3",
          200: "#ffe680",
          300: "#ffdb4d",
          400: "#ffd11a",
          500: "#f5a623",
          600: "#e6951a",
          700: "#cc8400",
          800: "#996300",
          900: "#664200",
        },
        hive: {
          dark: "#0a0a0f",
          card: "#12121a",
          border: "#1e1e2e",
          muted: "#8888aa",
        },
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-up-delay-1": "fadeInUp 0.6s ease-out 0.1s forwards",
        "fade-in-up-delay-2": "fadeInUp 0.6s ease-out 0.2s forwards",
        "fade-in-up-delay-3": "fadeInUp 0.6s ease-out 0.3s forwards",
        "fade-in-up-delay-4": "fadeInUp 0.6s ease-out 0.4s forwards",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
