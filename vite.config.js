import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/curlycoder/',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
