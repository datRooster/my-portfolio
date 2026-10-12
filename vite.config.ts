import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { emptyOutDir: false },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { proxy: { '/api': { target: process.env.PHP_API_URL || 'http://127.0.0.1:8080', changeOrigin: false } } },
});
