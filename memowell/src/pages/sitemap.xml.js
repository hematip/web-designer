// Sitemap of indexable pages (production: approved content in published languages only).
import { buildRoutes } from '../lib/routes.js';
import { settings, IS_PREVIEW } from '../lib/content.js';

export function GET() {
  const urls = IS_PREVIEW ? [] : buildRoutes()
    .filter((r) => r.props.view !== 'CaseReports')
    .map((r) => new URL(r.params.path ? `/${r.params.path}` : '/', settings.site_url).href);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
