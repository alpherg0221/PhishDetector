import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        warning: resolve(__dirname, `src/warning/index.html`),
      },
      output: {
        assetFileNames: `src/assets/[name].[ext]`,
        entryFileNames: `src/assets/[name].js`,
      }
    },
    outDir: "ext/"
  }
})
