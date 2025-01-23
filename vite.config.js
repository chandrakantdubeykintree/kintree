import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCommonjs({
      include: [path.resolve(__dirname, "src/balkan/familytree.js")],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
