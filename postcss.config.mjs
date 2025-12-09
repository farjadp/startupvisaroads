// ============================================================================
// Config Source: postcss.config.mjs
// Version: 1.0.0 — PostCSS Configuration
// Why: Configure PostCSS for Tailwind CSS processing
// ============================================================================

/** @type {import('postcss-load-config').Config} */
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const config = {
  plugins: {
    tailwindcss,
    autoprefixer,
  },
};

export default config;
