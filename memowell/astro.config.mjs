import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://memowell.kondorpharma.com',
  // Output always goes to dist/ (Vercel's Astro preset). `npm run build:preview` writes to dist-preview/ via --outDir.
  // SITE_MODE=preview produces the review build (all languages, drafts, pending markers, noindex).
  outDir: './dist',
  trailingSlash: 'ignore',
  // The plain-language science page was retired (2026-11-21); its address and the old professional paths go to /science.
  // The About section is one page since 2026-11-25: the former availability, partners and contact pages are its sections.
  redirects: {
    '/science/professionals': '/science', '/science/professionals/case-reports': '/science/case-reports',
    '/about/availability': '/about#availability', '/about/partners': '/about#partners', '/contact': '/about#contact',
    '/fr/about/availability': '/fr/about#availability', '/fr/about/partners': '/fr/about#partners', '/fr/contact': '/fr/about#contact',
    '/ar/about/availability': '/ar/about#availability', '/ar/about/partners': '/ar/about#partners', '/ar/contact': '/ar/about#contact',
  },
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    define: { 'process.env.SITE_MODE': JSON.stringify(process.env.SITE_MODE ?? 'production') },
  },
});
