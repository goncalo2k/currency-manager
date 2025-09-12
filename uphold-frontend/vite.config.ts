import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: { target: 'es2015' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test.setup.ts',
  },
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://api-sandbox.uphold.com',
        changeOrigin: true,
        secure: true,
      },
    },
    host: 'localhost',
    port: 5173,
  },
});
