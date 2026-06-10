import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Standalone build config (Vercel / local). No Replit-only plugins,
// no mandatory PORT/BASE_PATH env vars. Base path is "/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // The recruiter pages were written against an internal monorepo
      // package. We provide a typed, graceful shim in its place.
      "@workspace/api-client-react": path.resolve(
        import.meta.dirname,
        "src/lib/api-client-react.tsx",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "wouter"],
          charts: ["recharts"],
          pdf: ["jspdf", "html2canvas"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
});
