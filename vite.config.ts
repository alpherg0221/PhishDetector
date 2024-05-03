import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        warning: resolve(__dirname, `src/warning/index.html`),
        popup: resolve(__dirname, `src/popup/index.html`),
        startup: resolve(__dirname, `src/startup/index.html`),
      },
      output: {
        assetFileNames: `src/assets/[name].[ext]`,
        entryFileNames: `src/assets/[name].js`,
      }
    },
    outDir: "ext/"
  }
})
