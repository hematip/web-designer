// Builds the DRAFT one-page doctor summary (brief Part 7, Downloads) from approved site copy only:
// what is in Memowell, how it is taken, the published studies, and the five questions (brief Part 4).
// Output: deliverables/memowell-doctor-summary-DRAFT.pdf (+ .html). Not linked from the site until the
// scientific officer approves it (Settings → downloads.summary).
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';
import { chromium } from 'playwright';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const load = (p) => yaml.load(fs.readFileSync(path.join(root, p), 'utf8'));
const product = load('content/pages/en/memowell.yml');
const science = load('content/pages/en/science.yml');
const site = load('content/site/en/strings.yml');
const sec = (page, id) => page.sections.find((s) => s.id === id);
const md = (t) => marked.parse(t ?? '');
const mdi = (t) => marked.parseInline(t ?? '');
const paras = (t) => (t ?? '').split(/\n\s*\n/);

// Five questions — brief Part 4, PRODUCT §6 note ("the five questions for the PDF").
const brief = fs.readFileSync(path.join(root, 'brief/BRIEF.md'), 'utf8');
const qBlock = brief.slice(brief.indexOf('the five questions for the PDF are:'));
const questions = [...qBlock.matchAll(/^\d\. (.+)$/gm)].slice(0, 5).map((m) => m[1]);
if (questions.length !== 5) throw new Error('Could not read the five questions from the brief');

const comp = sec(product, 'composition');
const dir = sec(product, 'directions');
const summary = sec(product, 'summary');
const s1 = sec(science, 'study-1'), s2 = sec(science, 'study-2'), s3 = sec(science, 'study-3');
// Verbatim sentences selected from /science (selection flagged for scientific-officer review).
const studies = [
  { h: s1.heading, pub: s1.published, body: [paras(s1.body)[1], paras(s1.body)[2]], src: s1.sources },
  { h: s2.heading, pub: '', body: [paras(s2.body)[1], paras(s2.body)[2]], src: s2.sources },
  { h: s3.heading, pub: s3.published, body: [paras(s3.body)[0]], src: s3.sources },
];
const font = (pkg, file) => `file://${path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)}`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Memowell — ${summary.heading} (DRAFT)</title>
<style>
@font-face{font-family:Serif;src:url(${font('source-serif-4', 'source-serif-4-latin-opsz-normal.woff2')}) format('woff2');font-weight:200 900}
@font-face{font-family:Sans;src:url(${font('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:Sans;font-style:italic;src:url(${font('atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-wght-italic.woff2')}) format('woff2');font-weight:200 800}
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Sans,system-ui,sans-serif;color:#101a47;font-size:10pt;line-height:1.38;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:13mm 14mm 11mm;position:relative;overflow:hidden;background:#fffcf5}
.draft{position:absolute;top:96mm;left:-20mm;right:-20mm;text-align:center;transform:rotate(-24deg);font:700 46pt Sans;color:rgba(42,61,171,.07);letter-spacing:.06em;pointer-events:none}
.flag{background:#fff4d6;border:1.5px dashed #e2b33a;color:#4a3300;font-size:8.4pt;padding:2mm 3mm;border-radius:2mm;margin-bottom:4mm}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #2a3dab;padding-bottom:3.5mm;margin-bottom:4mm}
header img{width:44mm}
h1{font:600 21pt/1.1 Serif;margin:0 0 1.5mm}
.lead{font-size:10.6pt;margin:0;max-width:120mm}
h2{font:600 12.5pt/1.2 Serif;margin:0 0 1.8mm;color:#2a3dab}
h3{font:700 10.4pt/1.3 Sans;margin:0 0 .6mm}
p{margin:0 0 1.6mm}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
section{margin-bottom:3.6mm}
ol.steps{margin:0;padding:0;list-style:none;counter-reset:s}
ol.steps li{counter-increment:s;position:relative;padding-left:7mm;margin-bottom:1.6mm}
ol.steps li::before{content:counter(s);position:absolute;left:0;top:.2mm;width:4.8mm;height:4.8mm;border-radius:50%;background:#2a3dab;color:#fff;font:700 8pt/4.8mm Sans;text-align:center}
.study{border-left:2.5px solid #00b4c0;padding-left:3mm;margin-bottom:2.6mm}
.src{font-size:8.6pt;color:#3b4470}
.q{background:#e7f3f5;border-radius:3mm;padding:3.5mm 4mm}
.q ol{margin:0;padding-left:5mm;columns:2;column-gap:8mm}
.q li{margin-bottom:1.3mm;font-weight:700;break-inside:avoid}
.note{font-size:8.6pt;color:#3b4470}
footer{position:absolute;left:14mm;right:14mm;bottom:9mm;border-top:1px solid #d8dbe6;padding-top:2.4mm;font-size:7.9pt;line-height:1.38;color:#3b4470}
footer p{margin:0 0 1.2mm}
strong{font-weight:700}
</style></head><body><div class="page">
<div class="draft">DRAFT — NOT APPROVED</div>
<div class="flag"><strong>DRAFT for scientific-officer approval.</strong> Assembled only from approved site copy. Open items: active ingredient per capsule (not supplied); sentence selection from the studies; the "Needs approval" claims (K-Vie™ formulation, eight weeks, use alongside medicines). Remove this box after approval.</div>
<header><div><h1>${summary.heading}</h1><p class="lead">${mdi(paras(summary.body)[0])}</p></div><img src="file://${path.join(root, 'public/brand/memowell-logo-colour-transparent.png')}" alt="Memowell"></header>
<div class="cols">
 <div>
  <section><h2>${comp.heading}</h2>${md(comp.body)}</section>
  <section><h2>${dir.heading}</h2><ol class="steps">${dir.items.map((i) => `<li><strong>${i.title}</strong> ${i.body}</li>`).join('')}</ol><p class="note">${mdi(dir.body)}</p></section>
 </div>
 <div>
  <section><h2>${science.sections[0].heading}</h2>${studies.map((s) => `<div class="study"><h3>${s.h}</h3>${s.pub ? `<p class="src">${mdi(s.pub)}</p>` : ''}${s.body.map((b) => `<p>${mdi(b)}</p>`).join('')}<p class="src">${s.src.length > 1 ? 'Sources' : 'Source'}: ${s.src.map((d) => `DOI ${d}`).join(' · ')}</p></div>`).join('')}</section>
 </div>
</div>
<section class="q"><h2>Five questions worth asking</h2><ol>${questions.map((q) => `<li>${q}</li>`).join('')}</ol></section>
<footer><p>${site.product_disclaimer}</p><p>${site.general_disclaimer}</p><p><strong>${site.footer_last_line}</strong> · memowell.kondorpharma.com</p></footer>
</div></body></html>`;

const out = path.join(root, 'deliverables');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'memowell-doctor-summary-DRAFT.html'), html);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
await page.goto('file://' + path.join(out, 'memowell-doctor-summary-DRAFT.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.setViewportSize({ width: 794, height: 1123 });
const overflow = await page.evaluate(() => { const p = document.querySelector('.page'); const f = document.querySelector('footer').getBoundingClientRect().top; return [...p.querySelectorAll('section')].some((s) => s.getBoundingClientRect().bottom > f - 2); });
if (overflow) console.warn('WARNING: content runs into the footer — shorten or adjust');
await page.pdf({ path: path.join(out, 'memowell-doctor-summary-DRAFT.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await page.screenshot({ path: path.join(out, 'memowell-doctor-summary-DRAFT.png'), fullPage: true });
await browser.close();
console.log('Wrote deliverables/memowell-doctor-summary-DRAFT.pdf');
