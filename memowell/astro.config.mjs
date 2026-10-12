import { defineConfig } from 'astro/config';

const preview = process.env.SITE_MODE === 'preview';

export default defineConfig({
  site: 'https://memowell.kondorpharma.com',
  outDir: preview ? './dist-preview' : './dist',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    define: { 'process.env.SITE_MODE': JSON.stringify(process.env.SITE_MODE ?? 'production') },
  },
});
