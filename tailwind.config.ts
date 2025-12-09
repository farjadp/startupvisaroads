// ============================================================================
// Config Source: tailwind.config.ts
// Version: 1.0.0 — Brand Identity & RTL Support
// Why: Configure Tailwind with Startup Visa Roads brand colors and RTL support
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// ============================================================================

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand color palette
        primary: {
          DEFAULT: "#1c3b6e", // Navy blue - primary brand color
          light: "#2a5298",   // Lighter variant for hover states
          dark: "#0f2343",    // Darker variant for text
        },
        secondary: {
          DEFAULT: "#f2b95e", // Gold - secondary brand color
          light: "#f5c886",   // Lighter variant
          dark: "#d99d3f",    // Darker variant
        },
        accent: {
          DEFAULT: "#a81f93", // Magenta - accent color for CTAs
          light: "#c142b1",   // Lighter variant
          dark: "#7a1769",    // Darker variant
        },
        background: {
          DEFAULT: "#e7e8ec", // Light gray background
          light: "#f5f5f7",   // Even lighter background
          dark: "#d1d2d6",    // Darker background
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
