// ─────────────────────────────────────────────────────────────────────────────
//  Friwok Smart-Hire — Config Vite locale (Mac / dev sans Replit)
//  Usage : npx vite --config vite.config.local.ts
// ─────────────────────────────────────────────────────────────────────────────

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // Alias principal des composants
      "@": path.resolve(__dirname, "src"),

      // Assets partagés
      "@assets": path.resolve(__dirname, "../../attached_assets"),

      // Packages workspace → sources directes (pas de build requis)
      "@workspace/api-client-react": path.resolve(
        __dirname,
        "../../lib/api-client-react/src/index.ts"
      ),
      "@workspace/integrations-openai-ai-react": path.resolve(
        __dirname,
        "../../lib/integrations-openai-ai-react/src/index.ts"
      ),
    },
    dedupe: ["react", "react-dom"],
  },

  server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
    // Proxy les appels API vers l'Express backend (port 3000)
    // NB : /cv et /emploi sont des routes wouter — pas dans le proxy
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/interview": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 5173,
    host: "0.0.0.0",
  },
});
