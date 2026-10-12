// Single route table for every language. Views live in src/views.
import { publishedLocales, getPage, getArticlesWithFallback, section, DEFAULT_LOCALE } from './content.js';

// path (without locale prefix) -> page content id
export const PAGES = [
  { path: '/', id: 'home', view: 'Home' },
  { path: '/memowell', id: 'memowell', view: 'Product' },
  { path: '/who-its-for', id: 'who-its-for', view: 'WhoItsFor' },
  { path: '/science', id: 'science', view: 'Science' },
  { path: '/science/professionals', id: 'professionals', view: 'Professionals' },
  { path: '/science/professionals/case-reports', id: 'case-reports', view: 'CaseReports' },
  { path: '/memory-health', id: 'memory-health', view: 'BlogIndex' },
  { path: '/about', id: 'about', view: 'About' },
  { path: '/about/availability', id: 'availability', view: 'Availability' },
  { path: '/about/partners', id: 'partners', view: 'Partners' },
  { path: '/contact', id: 'contact', view: 'Contact' },
  { path: '/privacy', id: 'privacy', view: 'Legal' },
  { path: '/terms', id: 'terms', view: 'Legal' },
];

export const pageIdForPath = (path) => PAGES.find((p) => p.path === path)?.id;

/** True when an internal path resolves to a page generated in this build. */
export function pathIsLive(locale, path) {
  const clean = path.split('#')[0] || '/';
  const entry = PAGES.find((p) => p.path === clean);
  if (!entry) return clean.startsWith('/memory-health/');
  return !!getPage(locale, entry.id);
}

const prefix = (locale, path) => (locale === DEFAULT_LOCALE ? path : `/${locale}${path === '/' ? '' : path}`);
const toParam = (full) => (full === '/' ? undefined : full.replace(/^\//, ''));

export function buildRoutes() {
  const routes = [];
  for (const locale of publishedLocales()) {
    for (const p of PAGES) {
      const page = getPage(locale, p.id);
      if (!page) continue;
      routes.push({ params: { path: toParam(prefix(locale, p.path)) }, props: { locale, view: p.view, id: p.id, routePath: p.path } });
    }

    // Blog: paginated index, category pages and articles.
    const blog = getPage(locale, 'memory-health');
    if (!blog) continue;
    const size = blog.data.page_size ?? 6;
    const { list } = getArticlesWithFallback(locale);
    const paginate = (items, base, extra) => {
      const total = Math.max(1, Math.ceil(items.length / size));
      for (let n = 1; n <= total; n++) {
        if (n === 1 && base === '/memory-health') continue; // page 1 is the main route above
        const routePath = n === 1 ? base : `${base}/page/${n}`;
        routes.push({ params: { path: toParam(prefix(locale, routePath)) }, props: { locale, view: 'BlogIndex', id: 'memory-health', routePath, pageNumber: n, ...extra } });
      }
    };
    paginate(list, '/memory-health', {});
    for (const cat of blog.data.categories ?? []) {
      paginate(list.filter((a) => a.category === cat.slug), `/memory-health/category/${cat.slug}`, { category: cat.slug });
    }
    for (const article of list) {
      const routePath = `/memory-health/${article.slug}`;
      routes.push({ params: { path: toParam(prefix(locale, routePath)) }, props: { locale, view: 'Article', id: 'memory-health', routePath, slug: article.slug } });
    }
  }
  return routes;
}

export { section };
