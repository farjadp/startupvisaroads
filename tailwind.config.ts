import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // lib/ holds the locale typography tokens. Without this glob Tailwind
    // never sees a class that only appears there, silently emits no rule for
    // it, and the component renders with whatever it inherited — which is how
    // `prose-headings:font-estedad` left Persian article headings in DM Serif
    // Display while every other token appeared to work, because those happen
    // to be written literally somewhere under components/ as well.
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {

        // اتصال متغیر فونت جدید به کلاس font-serif
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-space)", "sans-serif"],
        vazir: ["var(--font-vazir)", "sans-serif"],
        estedad: ["var(--font-estedad)", "var(--font-vazir)", "sans-serif"],
        iransans: ["IRANSansX", "sans-serif"], // <--- Added this line
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