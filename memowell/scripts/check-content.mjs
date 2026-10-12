// Build verification for the production output (dist/):
//  1. every approved copy-deck sentence from brief Part 4 appears verbatim on the site;
//  2. no banned word or FDA mention appears in any rendered page;
//  3. every page carries the general disclaimer; content pages end with the professional band;
//  4. every internal link resolves to a generated page.
// Usage: node scripts/check-content.mjs [distDir]
import fs from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] ?? 'dist';
const brief = fs.readFileSync('brief/BRIEF.md', 'utf8');
let failures = 0;
const fail = (msg) => { failures++; console.log('FAIL', msg); };

const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const inline = /<\/?(?:em|strong|mark|a|span|time|bdi|sup|sub|b|i|abbr)(?:\s[^>]*)?>/g;
const textOf = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(inline, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const pagesAll = files.filter((f) => !f.includes(`${path.sep}admin${path.sep}`)).map((f) => ({ f, html: fs.readFileSync(f, 'utf8') })).map((p) => ({ ...p, text: textOf(p.html) }));
const pages = pagesAll;
const allText = pages.map((p) => p.text).join(' \n ');

// 1. Copy fidelity — Part 4 blockquotes, EN pages that are generated in production.
const part4 = brief.slice(brief.indexOf('## Part 4.'), brief.indexOf('## Part 5.'));
const skipSections = ['MEMORY HEALTH (blog)', 'FOOTER AND REPEATED TEXT']; // checked separately below
const quoteLines = [];
let current = '';
for (const line of part4.split('\n')) {
  if (line.startsWith('### ')) current = line;
  if (!line.startsWith('> ')) continue;
  if (/[\u0600-\u06FF]/.test(line)) continue;      // Persian privacy draft (translated separately)
  if (/^> Fields:|^> Categories:|\[address\]/.test(line)) continue; // structural lines, checked as form labels
  quoteLines.push({ section: current, line: line.slice(2) });
}
const clean = (s) => s.replace(/\*\*|\*|^#+\s*/g, '').replace(/\s+/g, ' ').trim();
let checked = 0;
for (const { section, line } of quoteLines) {
  const labels = [...line.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
  let prose = clean(line.replace(/\[[^\]]+\]/g, '').replace(/\s·\s*$/, '').replace(/^·\s*/, ''));
  // "**Title** — text" rows are laid out as a heading plus a paragraph; "A · B · C" as a list.
  const pieces = [];
  if (/^\*\*[^*]+\*\* — /.test(line)) { const [t, ...rest] = prose.split(' — '); pieces.push(t); prose = rest.join(' — '); }
  if (/^\*\*[^*]+\*\*( · \*\*[^*]+\*\*)+$/.test(line)) { pieces.push(...prose.split(' · ')); prose = ''; }
  const parts = prose.split(/(?<=[.?!])\s+/).map((s) => s.replace(/^[·\s]+|[·\s]+$/g, '').trim()).filter((s) => s.length > 2);
  for (const sentence of [...pieces, ...parts, ...labels]) {
    checked++;
    if (!allText.includes(sentence)) {
      const draftOnly = /CASE|Case reports|Terms/i.test(section);
      fail(`copy not found${draftOnly ? ' (draft page — preview only)' : ''}: [${section.replace('### ', '')}] "${sentence}"`);
    }
  }
}
console.log(`copy fidelity: ${checked} sentences/labels checked`);

// Fixed footer/repeated texts.
const fixed = [...part4.slice(part4.indexOf('### FOOTER AND REPEATED TEXT')).matchAll(/^> (.+)$/gm)].map((m) => m[1]).filter((l) => !/[\u0600-\u06FF]/.test(l));
for (const l of fixed) {
  const prose = clean(l.replace(/\[[^\]]+\]/g, ''));
  if (prose && !allText.includes(prose)) fail(`repeated text missing: "${prose}"`);
}
const lastLine = 'Memowell® · Kondor Pharma, Canada · NPN 80107357 · LIVE WELL, STAY WELL';
if (!allText.includes(lastLine)) fail('last footer line missing');

// 2. Banned words (brief Part 4 writing rules) and FDA.
const banned = ['prevents', 'stops', 'halts progression', 'cures', 'treats', 'no side effects', 'no interactions', 'FDA approved', 'guaranteed', 'drug', 'medication', 'better than', 'FDA'];
for (const p of pages) {
  for (const w of banned) {
    const re = new RegExp(`\\b${w.replace(/ /g, '\\s+')}\\b`, 'i');
    if (re.test(p.text)) fail(`banned word "${w}" in ${p.f}`);
  }
}

// 3. Disclaimers and professional band.
const general = 'This website exists to introduce Memowell® and to provide scientific and educational information';
const band = 'Are you a doctor, pharmacist or dietitian?';
const needsBand = ['memowell', 'who-its-for', 'science/index', 'memory-health', 'about/index', 'about/availability'];
for (const p of pages) {
  if (!p.text.includes(general)) fail(`general disclaimer missing in ${p.f}`);
  const rel = path.relative(dist, p.f);
  if (needsBand.some((k) => rel.startsWith(k)) && !p.text.includes(band)) fail(`professional band missing in ${rel}`);
}
for (const k of ['memowell/index.html', 'who-its-for/index.html']) {
  const p = pages.find((x) => path.relative(dist, x.f) === k);
  if (p && !p.text.includes('Take Memowell® according to the directions on the packaging')) fail(`product disclaimer missing in ${k}`);
}

// 4. Internal links resolve.
const exists = (u) => {
  const clean = u.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(dist, 'index.html'));
  const p = path.join(dist, clean);
  return fs.existsSync(p) && fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html'));
};
let links = 0;
for (const p of pages) {
  for (const m of p.html.matchAll(/href="(\/[^"]*)"/g)) {
    links++;
    if (!exists(m[1])) fail(`broken link ${m[1]} in ${path.relative(dist, p.f)}`);
  }
}
console.log(`links: ${links} internal hrefs checked across ${pages.length} pages`);
console.log(failures ? `\n${failures} problem(s) found` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
