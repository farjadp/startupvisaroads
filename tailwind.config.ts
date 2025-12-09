import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-bodoni)", "serif"], // فونت لوکس و کلاسیک
        sans: ["var(--font-space)", "sans-serif"], // فونت مدرن و عجیب
      },
      colors: {
        paper: "#F2F0E9", // رنگ کاغذ کاهی/استخوانی
        ink: "#1a1a1a",   // مشکی جوهری (کمی گرم)
        acid: "#CCFF00",  // سبز نئونی/فسفری (برای تضاد)
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;