import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        flame: "#FF6B00",
        firered: "#FF2D20",
        ember: "#FFC857",
        void: "#050302",
        char: "#0D0805",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        rise: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-110vh) translateX(20px)", opacity: "0" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(255,107,0,0.35), 0 0 60px rgba(255,45,32,0.15)",
          },
          "50%": {
            boxShadow:
              "0 0 35px rgba(255,107,0,0.6), 0 0 90px rgba(255,45,32,0.3)",
          },
        },
      },
      animation: {
        flicker: "flicker 3s ease-in-out infinite",
        rise: "rise 8s linear infinite",
        sweep: "sweep 3s linear infinite",
        scanline: "scanline 2.2s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
