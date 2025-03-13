import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { getLinkPreview } from "link-preview-js";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      viteCommonjs({
        include: [path.resolve(__dirname, "src/balkan/familytree.js")],
      }),
      mode === "development" && {
        name: "link-preview-middleware",
        configureServer(server) {
          server.middlewares.use("/api/link-preview", async (req, res) => {
            // Set CORS headers
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");

            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
              return;
            }

            try {
              const urlParam = new URL(
                req.url,
                "http://localhost"
              ).searchParams.get("url");

              if (!urlParam) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "URL is required" }));
                return;
              }

              const decodedUrl = decodeURIComponent(urlParam);

              try {
                new URL(decodedUrl);
              } catch (e) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid URL format" }));
                return;
              }

              const metadata = await getLinkPreview(decodedUrl, {
                timeout: 5000,
                followRedirects: "follow",
                headers: {
                  "user-agent":
                    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                  Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                  "Accept-Language": "en-US,en;q=0.5",
                },
                handleRedirects: (baseURL, forwardedURL) => forwardedURL,
                imagesPropertyType: "og", // Prioritize OpenGraph images
              });

              // Process and validate image URLs
              let imageUrl = "";
              if (metadata.images && metadata.images.length > 0) {
                imageUrl = metadata.images[0];
                // Ensure image URL is absolute
                try {
                  imageUrl = new URL(imageUrl, decodedUrl).toString();
                } catch (e) {
                  console.warn("Invalid image URL:", imageUrl);
                  imageUrl = "";
                }
              }

              const response = {
                title: metadata.title || "No title available",
                description: metadata.description || "",
                image: imageUrl,
                url: decodedUrl,
                siteName: metadata.siteName || new URL(decodedUrl).hostname,
              };

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(response));
            } catch (error) {
              console.error("Link preview error:", error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Failed to fetch link preview",
                  details: error.message,
                  url: req.url,
                })
              );
            }
          });
        },
      },
    ],
    server: {
      port: 3000,
      cors: true,
      https: false,
      proxy: {
        "/google-places": {
          target:
            env.VITE_GOOGLE_PLACES_API_URL || "https://maps.googleapis.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/google-places/, ""),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              // Add CORS headers
              proxyRes.headers["Access-Control-Allow-Origin"] = "*";
              proxyRes.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
              proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type";
            });
          },
        },
        "/uploads": {
          target: env.VITE_KINTREE_BASE_URL || "https://api.kintree.com",
          changeOrigin: true,
          secure: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
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
        "/api": {
          target: env.VITE_KINTREE_BASE_URL || "https://api.kintree.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/api/link-preview": {
          target: env.VITE_API_BASE_URL || "https://api.kintree.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) =>
            path.replace(/^\/api\/link-preview/, "/link-preview"),
        },
        "/image-proxy": {
          target: "http://localhost:3000",
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              // Add CORS headers
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
            "radix-navigation": ["@radix-ui/react-dropdown-menu"],
            "radix-forms": [
              "@radix-ui/react-checkbox",
              "@radix-ui/react-label",
              "@radix-ui/react-select",
              "@radix-ui/react-switch",
            ],
            "radix-overlay": ["@radix-ui/react-popover"],
            "radix-layout": ["@radix-ui/react-accordion"],

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
      include: ["react", "react-dom", "react-router"],
    },
  };
});
