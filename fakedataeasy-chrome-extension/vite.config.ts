import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup/index.html'),
        options: resolve(__dirname, 'options/options.html'),
        cpf: resolve(__dirname, 'pages/cpf.html'),
        cnpj: resolve(__dirname, 'pages/cnpj.html'),
        nome: resolve(__dirname, 'pages/nome.html'),
        cep: resolve(__dirname, 'pages/cep.html'),
        offscreen: resolve(__dirname, 'offscreen/offscreen.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'offscreen') return 'offscreen/offscreen.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
