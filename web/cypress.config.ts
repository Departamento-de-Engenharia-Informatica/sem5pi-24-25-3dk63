import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "http://localhost:5173",
    testIsolation: true,
    specPattern: "cypress/e2e/**/*.spec.ts",
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
