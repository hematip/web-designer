// axe-core scan (WCAG 2.0/2.1/2.2 A + AA rules) of built pages: node scripts/a11y-check.mjs <baseUrl> <path...>
import { chromium } from 'playwright';
import fs from 'node:fs';
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let total = 0;
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axe });
    const res = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' '), msg: v.nodes[0]?.failureSummary?.split('\n')[1] })));
    total += res.length;
    if (res.length) console.log(`${width} ${p}\n` + res.map((r) => `  [${r.impact}] ${r.id} ×${r.n} — ${r.sample} — ${r.msg}`).join('\n'));
  }
  await page.close();
}
console.log(total ? `${total} violation group(s)` : 'No axe violations');
await browser.close();
