import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
    },
    plugins: [
      TanStackRouterVite(),
      tsConfigPaths(),
      tailwindcss(),
      viteReact(),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // Add rollupOptions to handle the chunk size warning
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // This splits each library into its own JS file
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
  };
});
