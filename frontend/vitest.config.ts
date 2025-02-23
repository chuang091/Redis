import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from "unplugin-auto-import/vite"; 

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['test/setup.ts'], // optional
  },
  resolve: {
    alias: {
      '#app': path.resolve(__dirname, '.nuxt'), // point #app to actual .nuxt folder
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
    },
  },
  plugins: [
    vue(),
    // ...
    AutoImport({
      imports: ["vue"],
    }),
  ],
})
