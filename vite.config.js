/*
 * @Author: zi.yang
 * @Date: 2025-06-09 19:48:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-10 14:19:50
 * @Description: 
 * @FilePath: /short-link/vite.config.js
 */
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
