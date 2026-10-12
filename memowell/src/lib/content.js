// Content loading, locale fallback, publishing gates and small text helpers.
// All public copy lives in src/content (edited through Decap CMS at /admin).
import yaml from 'js-yaml';
import { marked } from 'marked';

export const MODE = process.env.SITE_MODE === 'preview' ? 'preview' : 'production';
export const IS_PREVIEW = MODE === 'preview';

export const LOCALES = [
  { code: 'en', name: 'English', short: 'EN', dir: 'ltr' },
  { code: 'fr', name: 'Français', short: 'FR', dir: 'ltr' },
  { code: 'ar', name: 'العربية', short: 'AR', dir: 'rtl' },
];
export const DEFAULT_LOCALE = 'en';

const pageFiles = import.meta.glob('/content/pages/*/*.yml', { query: '?raw', import: 'default', eager: true });
const siteFiles = import.meta.glob('/content/site/*/strings.yml', { query: '?raw', import: 'default', eager: true });
const articleFiles = import.meta.glob('/content/articles/*/*.md', { query: '?raw', import: 'default', eager: true });
const settingsFiles = import.meta.glob('/content/settings/*.yml', { query: '?raw', import: 'default', eager: true });

const parse = (raw) => yaml.load(raw) ?? {};

export const settings = parse(settingsFiles['/content/settings/site.yml']);
export const formDefs = parse(settingsFiles['/content/settings/forms.yml']);

export function publishedLocales() {
  return IS_PREVIEW ? LOCALES.map((l) => l.code) : settings.published_locales ?? [DEFAULT_LOCALE];
}
export const localeInfo = (code) => LOCALES.find((l) => l.code === code) ?? LOCALES[0];

// An entry is visible in production only when approved. Preview shows everything, flagged.
export const isVisible = (entry) => !!entry && (IS_PREVIEW || entry.status === 'approved');

function rawPage(locale, id) {
  const raw = pageFiles[`/content/pages/${locale}/${id}.yml`];
  return raw ? parse(raw) : null;
}

/**
 * Returns { data, locale, fallback } — the page in the requested locale, or the English
 * original when no translation exists (fallback: true; only reachable in preview builds).
 */
export function getPage(locale, id) {
  const own = rawPage(locale, id);
  if (own && isVisible(own)) return { data: own, locale, fallback: false };
  const en = rawPage(DEFAULT_LOCALE, id);
  if (locale !== DEFAULT_LOCALE && en && isVisible(en)) return { data: en, locale: DEFAULT_LOCALE, fallback: true };
  if (locale === DEFAULT_LOCALE && en && isVisible(en)) return { data: en, locale, fallback: false };
  return null;
}

export function pageExists(locale, id) {
  return !!getPage(locale, id);
}

export function getSite(locale) {
  const own = siteFiles[`/content/site/${locale}/strings.yml`];
  const en = parse(siteFiles[`/content/site/${DEFAULT_LOCALE}/strings.yml`]);
  if (own) {
    const data = parse(own);
    if (isVisible(data)) return { data: { ...en, ...data, ui: { ...en.ui, ...(data.ui ?? {}) } }, fallback: false };
  }
  return { data: en, fallback: locale !== DEFAULT_LOCALE };
}

export const section = (page, id) => page?.sections?.find((s) => s.id === id) ?? {};

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  return { data: parse(m[1]), body: m[2].trim() };
}

export function getArticles(locale) {
  const out = [];
  for (const [path, raw] of Object.entries(articleFiles)) {
    const [, loc, file] = path.match(/articles\/([^/]+)\/([^/]+)\.md$/);
    if (loc !== locale) continue;
    const { data, body } = parseFrontmatter(raw);
    if (!isVisible(data)) continue;
    out.push({ ...data, slug: file, body, locale: loc });
  }
  // Newest first by published date, then the editorial order.
  return out.sort((a, b) => (b.published || '').localeCompare(a.published || '') || (a.order ?? 99) - (b.order ?? 99));
}

/** Articles for a locale; in preview, untranslated locales fall back to English entries. */
export function getArticlesWithFallback(locale) {
  const own = getArticles(locale);
  if (own.length || locale === DEFAULT_LOCALE) return { list: own, fallback: false };
  return { list: getArticles(DEFAULT_LOCALE), fallback: true };
}

// Markdown helpers. Content is trusted CMS content committed to the repository.
export const md = (text = '') => (text ? marked.parse(String(text), { async: false }) : '');
export const mdInline = (text = '') => (text ? marked.parseInline(String(text), { async: false }) : '');

/** Locale-aware internal href. External links, hashes and mailto pass through untouched. */
export function href(locale, path = '/') {
  if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path === '/' ? '/' : path}`;
}

export const doiUrl = (doi) => `https://doi.org/${doi}`;

export function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}
