import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    viteCommonjs({
      include: [path.resolve(__dirname, "src/balkan/familytree.js")],
    }),
  ],
  server: {
    port: 3000,
    cors: true,
    https: false,
    proxy: {
      "/google-places": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-places/, ""),
      },
      "/uploads": {
        target: "https://api.kintree.com",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  build: {
    target: "es2015",
    minify: "terser",
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.trace",
        ],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom"],
          "react-router": ["react-router"],
          "radix-dialog": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-alert-dialog",
          ],
          "radix-navigation": [
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-dropdown-menu",
          ],
          "radix-forms": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-switch",
          ],
          "radix-overlay": [
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
          ],
          "radix-layout": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-tabs",
            "@radix-ui/react-separator",
          ],

          "form-validation": ["zod"],
          "form-hooks": ["@hookform/resolvers", "react-hook-form"],

          // Map related
          "map-core": ["@react-google-maps/api"],

          // Date handling
          "date-utils": ["date-fns"],

          // Utils and helpers
          utils: ["class-variance-authority", "clsx", "tailwind-merge"],

          // i18n
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
          ],
        },
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.includes("node_modules")) {
            return "assets/vendor/[name]-[hash].js";
          }
          return "assets/js/[name]-[hash].js";
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[ext]/[name]-[hash][extname]";
        },
      },
    },
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false, // Disable compressed size reporting for faster builds
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@radix-ui/react-dialog",
      "@radix-ui/react-navigation-menu",
    ],
  },
});
