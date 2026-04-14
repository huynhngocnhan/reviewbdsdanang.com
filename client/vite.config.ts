import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze"
      ? visualizer({
          filename:
            process.env.ANALYZE_FORMAT === "raw"
              ? "dist/bundle-stats.json"
              : "dist/bundle-stats.html",
          template:
            process.env.ANALYZE_FORMAT === "raw" ? "raw-data" : "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : undefined,
  ].filter(Boolean),
}));
