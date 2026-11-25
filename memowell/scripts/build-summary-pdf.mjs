// Builds the one-page doctor summary (brief Part 2: the primary action; Part 7, Downloads) from approved site copy
// only: what is in Memowell, how it is taken, the published studies, and the five questions (brief Part 4).
// Output: public/downloads/memowell-doctor-summary.pdf (+ deliverables/memowell-doctor-summary.html/.png for review).
// Linked from the site through Settings → downloads.summary. Run after any change to the product or science copy.
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
const cautions = sec(product, 'cautions');
const summary = sec(product, 'summary');
const s1 = sec(science, 'study-1'), s2 = sec(science, 'study-2'), s3 = sec(science, 'study-3');
// Verbatim sentences selected from /science.
const studies = [
  { h: s1.heading, pub: s1.published, body: [paras(s1.body)[1], paras(s1.body)[2]], src: s1.sources },
  { h: s2.heading, pub: '', body: [paras(s2.body)[1], paras(s2.body)[2]], src: s2.sources },
  { h: s3.heading, pub: s3.published, body: [paras(s3.body)[0]], src: s3.sources },
];
const compParas = paras(comp.body).slice(0, 3); // composition, resin, K-Vie™ — the gluten note stays on the page
const font = (file) => `file://${path.join(root, 'node_modules/@fontsource-variable/ibm-plex-sans/files', file)}`;
const mime = { png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' };
const img = (p) => `data:${mime[p.split('.').pop()]};base64,${fs.readFileSync(path.join(root, 'public', p)).toString('base64')}`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Memowell® — ${summary.heading}</title>
<style>
@font-face{font-family:Plex;src:url(${font('ibm-plex-sans-latin-wght-normal.woff2')}) format('woff2');font-weight:100 700}
@font-face{font-family:Plex;src:url(${font('ibm-plex-sans-latin-ext-wght-normal.woff2')}) format('woff2');font-weight:100 700;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Plex;font-style:italic;src:url(${font('ibm-plex-sans-latin-wght-italic.woff2')}) format('woff2');font-weight:100 700}
@page{size:A4;margin:0}
*{box-sizing:border-box}
:root{--navy:#243677;--navy-deep:#282764;--blue:#1a428a;--blue-bright:#124a95;--cyan:#06b2c8;--cyan-stripe:#5ecfd9;--sky:#e3eef8;--ink:#1b2a5a;--ink-soft:#3f4f7e;--line:#dbe3f0}
body{margin:0;font-family:Plex,system-ui,sans-serif;color:var(--ink);font-size:9.3pt;line-height:1.36;font-weight:450;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:10mm 13mm 9mm;position:relative;overflow:hidden;background:#fff}
header{display:grid;grid-template-columns:1fr auto;gap:8mm;align-items:center;border-bottom:2px solid var(--navy);padding-bottom:3mm;margin-bottom:3.6mm}
header img.logo{width:36mm;display:block;margin-left:auto}
.kicker{font-size:8pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin:0 0 1.2mm}
h1{font-size:19pt;line-height:1.05;font-weight:600;letter-spacing:-.02em;margin:0 0 1.6mm;color:var(--navy)}
.lead{font-size:9.4pt;margin:0;max-width:118mm;color:var(--ink-soft)}
h2{font-size:11pt;line-height:1.2;font-weight:600;letter-spacing:-.01em;margin:0 0 1.4mm;color:var(--navy)}
h3{font-size:9.4pt;line-height:1.3;font-weight:600;margin:0 0 .6mm;color:var(--navy)}
p{margin:0 0 1.3mm}
em{font-style:italic}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
section{margin-bottom:3.6mm}
.amount{display:inline-block;background:var(--sky);color:var(--blue);font-weight:600;padding:1mm 2.4mm;border-radius:99mm;margin:.4mm 0 1.8mm}
ol.steps{margin:0;padding:0;list-style:none;counter-reset:s}
ol.steps li{counter-increment:s;position:relative;padding-left:7.2mm;margin-bottom:1.8mm}
ol.steps li::before{content:counter(s);position:absolute;left:0;top:.2mm;width:5.2mm;height:5.2mm;border-radius:50%;background:var(--navy);color:#fff;font-size:8pt;font-weight:600;display:flex;align-items:center;justify-content:center}
.note{font-size:8.4pt;color:var(--ink-soft)}
.study{border-left:2.5px solid var(--cyan);padding-left:3mm;margin-bottom:2.6mm}
.pub{font-size:8.4pt;color:var(--ink-soft);margin:-.2mm 0 1.2mm}
.src{font-size:7.8pt;color:var(--ink-soft);margin:0}
.qs{background:var(--sky);border-radius:4mm;padding:4.2mm 5mm 3.4mm;margin-top:1.5mm}
.qs h2{margin-bottom:2mm}
.qs ol{margin:0;padding:0 0 0 5mm;columns:2;column-gap:7mm;font-weight:500}
.qs li{margin-bottom:1mm;break-inside:avoid;padding-left:1mm}
.bottle{position:absolute;right:16mm;top:176mm;width:22mm;filter:drop-shadow(0 2mm 2.4mm rgba(27,42,90,.18))}
footer{position:absolute;left:13mm;right:13mm;bottom:8mm;border-top:1px solid var(--line);padding-top:2.2mm;font-size:7pt;line-height:1.3;color:var(--ink-soft)}
footer p{margin:0 0 1mm}
footer .brand{color:var(--navy);font-weight:600}
</style></head><body><div class="page">
<img class="bottle" src="${img('img/bottle-360.webp')}" alt="">
<header>
  <div>
    <p class="kicker">Memowell® · for your doctor or pharmacist</p>
    <h1>${summary.heading}</h1>
    <p class="lead">${mdi(summary.body.trim())}</p>
  </div>
  <img class="logo" src="${img('brand/memowell-logo-colour-transparent.png')}" alt="Memowell">
</header>
<div class="cols">
  <div>
    <section>
      <h2>${comp.heading}</h2>
      ${md(compParas[0])}
      <span class="amount">${mdi(comp.per_capsule_amount)}</span>
      ${md(compParas[1])}${md(compParas[2])}
    </section>
    <section>
      <h2>${dir.heading}</h2>
      <ol class="steps">${dir.items.map((i) => `<li><strong>${mdi(i.title)}</strong> ${mdi(i.body)}</li>`).join('')}</ol>
      <p class="note">${mdi(paras(dir.body).at(-1))}</p>
    </section>
    <section>
      <h2>${cautions.heading}</h2>
      ${md(paras(cautions.body)[0])}
    </section>
  </div>
  <div>
    <section>
      <h2>${science.sections[0].heading}</h2>
      ${studies.map((s) => `<div class="study"><h3>${mdi(s.h)}</h3>${s.pub ? `<p class="pub">${mdi(s.pub)}</p>` : ''}${s.body.map((b) => md(b)).join('')}<p class="src">${s.src.length > 1 ? 'Sources' : 'Source'}: ${s.src.map((d) => `DOI ${d}`).join(' · ')}</p></div>`).join('')}
    </section>
  </div>
</div>
<div class="qs">
  <h2>Five questions worth asking</h2>
  <ol>${questions.map((q) => `<li>${q}</li>`).join('')}</ol>
</div>
<footer>
  <p>${site.product_disclaimer}</p>
  <p>${site.general_disclaimer}</p>
  <p class="brand">Memowell® · Kondor Pharma, Canada · NPN 80107357 · LIVE WELL, STAY WELL · memowell.kondorpharma.com</p>
</footer>
</div></body></html>`;

const outDir = path.join(root, 'public/downloads');
const review = path.join(root, 'deliverables');
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(review, { recursive: true });
fs.writeFileSync(path.join(review, 'memowell-doctor-summary.html'), html);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const overflow = await page.evaluate(() => { const f = document.querySelector('footer').getBoundingClientRect().top; const q = document.querySelector('.qs').getBoundingClientRect().bottom; return Math.round(f - q); });
if (overflow < 8) throw new Error(`Content runs into the footer (gap ${overflow}px)`);
await page.pdf({ path: path.join(outDir, 'memowell-doctor-summary.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await page.screenshot({ path: path.join(review, 'memowell-doctor-summary.png'), fullPage: false });
await browser.close();
console.log(`Built public/downloads/memowell-doctor-summary.pdf (gap above footer ${overflow}px)`);
