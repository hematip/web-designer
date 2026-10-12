import { settings, IS_PREVIEW } from '../lib/content.js';
export function GET() {
  const body = IS_PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nDisallow: /admin/\nSitemap: ${new URL('/sitemap.xml', settings.site_url).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
