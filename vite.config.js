import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` gera o site normal em dist/ (para hospedar, ex.: GitHub Pages).
// `npm run build:offline` gera um único arquivo dist-offline/index.html, com fontes e
// imagens embutidas, que abre com dois cliques mesmo sem internet (bom para a banca).
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline';
  return {
    base: './',
    plugins: [react(), ...(offline ? [viteSingleFile()] : [])],
    build: offline ? { outDir: 'dist-offline', assetsInlineLimit: Number.MAX_SAFE_INTEGER } : { outDir: 'dist' },
  };
});
