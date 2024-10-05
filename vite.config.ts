import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path"

export default defineConfig(({ mode }) => {
  if (mode === "firefox") {
    return {
      plugins: [react()],
      publicDir: resolve(__dirname, 'public-firefox'),
      build: {
        rollupOptions: {
          input: {
            'assets/warning': resolve(__dirname, `src/warning/index.html`),
            'assets/popup': resolve(__dirname, `src/popup/index.html`),
            'assets/startup': resolve(__dirname, `src/startup/index.html`),
            'assets/list': resolve(__dirname, `src/list/index.html`),
            'detector': resolve(__dirname, `src/detector.ts`),
            'background': resolve(__dirname, `src/background.ts`),
            'loader': resolve(__dirname, `src/loader.ts`),
          },
          output: {
            assetFileNames: `src/assets/[name].[ext]`,
            entryFileNames: `src/[name].js`,
            chunkFileNames: `assets/[name].js`,
          },
        },
        outDir: "ext-firefox/"
      }
    };
  } else {
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            'assets/warning': resolve(__dirname, `src/warning/index.html`),
            'assets/popup': resolve(__dirname, `src/popup/index.html`),
            'assets/startup': resolve(__dirname, `src/startup/index.html`),
            'assets/list': resolve(__dirname, `src/list/index.html`),
            'detector': resolve(__dirname, `src/detector.ts`),
            'background': resolve(__dirname, `src/background.ts`),
            'loader': resolve(__dirname, `src/loader.ts`),
          },
          output: {
            assetFileNames: `src/assets/[name].[ext]`,
            entryFileNames: `src/[name].js`,
            chunkFileNames: `assets/[name].js`,
          },
        },
        outDir: "ext/"
      }
    };
  }
});
