/**
 * Content scripts MV3 não podem usar ES modules (import no ficheiro injectado).
 * Build separado: um único IIFE em dist/content/field-helper.js.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: resolve(__dirname, 'src/content/field-helper.ts'),
      output: {
        format: 'iife',
        name: 'FDEFieldHelper',
        inlineDynamicImports: true,
        entryFileNames: 'content/field-helper.js',
      },
    },
  },
});
