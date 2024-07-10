import { defineConfig } from "vite";
import { resolve } from "path";
import copy from "rollup-plugin-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        shipping: resolve(__dirname, "shipping.html"),
      },
      plugins: [
        copy({
          targets: [
            { src: "404.html", dest: "dist" },
            { src: "_redirects", dest: "dist" },
          ],
        }),
      ],
    },
  },
});
