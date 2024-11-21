import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import routeconfiguration from "./src/config/routeconfiguration.json";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: routeconfiguration.BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
