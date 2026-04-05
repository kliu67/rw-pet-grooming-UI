const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm.cmd run dev -- --port 8080 --host localhost --strictPort",
    port: 8080,
    cwd: __dirname,
    reuseExistingServer: false,
  },
});
