import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";



export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET ?? "http://127.0.0.1:5001",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("referer");
            proxyReq.removeHeader("origin");
          });
        },
      },
      "/uploads": {
        target: process.env.VITE_PROXY_TARGET ?? "http://127.0.0.1:5001",
        changeOrigin: true,
      },
    },
  },
});
