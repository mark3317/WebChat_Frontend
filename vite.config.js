import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    nodePolyfills({
      // Включаем полифиллы для глобальных переменных
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Включаем полифиллы для модулей
      modules: {
        buffer: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  server: {
    port: 8080,
    hot: true,
    open: "/index.html",
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        register: resolve(__dirname, "register.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
