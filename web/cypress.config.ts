import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "http://localhost:5173", // Base URL para o seu app
    testIsolation: true,
    specPattern: "cypress/e2e/**/*.spec.ts", // Garante que o Cypress encontre os testes .ts
  },
});
