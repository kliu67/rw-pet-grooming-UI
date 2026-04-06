import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm run dev",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev --prefix /Users/kl/Documents/pet-grooming-services",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
