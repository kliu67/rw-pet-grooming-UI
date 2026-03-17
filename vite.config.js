import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

const isCloudflare = Boolean(process.env.CF_PAGES);

export default defineConfig({
  plugins: [react(), tailwindcss(), isCloudflare && cloudflare()].filter(Boolean),
  appType: "spa",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    threads: false,
     deps: {
    inline: [
      "html-encoding-sniffer",
      "@exodus/bytes"
    ]
  },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",

      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.{js,jsx}",
        "**/*.spec.{js,jsx}"
      ],

      // ✅ Coverage thresholds
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85
      }
    }
  },
  assetsInclude: ["**/*.svg", "**/*.csv"]
});
