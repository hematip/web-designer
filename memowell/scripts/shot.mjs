// Screenshot helper for build verification: node scripts/shot.mjs <baseUrl> <outDir> <json-spec>
// spec: [{ path, width, height, name, full, scrollTo (px | selector), reduced, waitMs }]
import { chromium } from 'playwright';
const [base, out, specJson] = process.argv.slice(2);
const spec = JSON.parse(specJson);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const s of spec) {
  const ctx = await browser.newContext({ viewport: { width: s.width ?? 1440, height: s.height ?? 900 }, reducedMotion: s.reduced ? 'reduce' : 'no-preference', deviceScaleFactor: s.dpr ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + s.path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (s.scrollTo !== undefined) {
    await page.evaluate(async (t) => {
      const y = typeof t === 'number' ? t : (document.querySelector(t).getBoundingClientRect().top + scrollY - 90);
      window.scrollTo({ top: y, behavior: 'instant' });
    }, s.scrollTo);
  }
  await page.waitForTimeout(s.waitMs ?? 700);
  await page.screenshot({ path: `${out}/${s.name}.png`, fullPage: !!s.full });
  if (errors.length) console.log(s.name, 'ERRORS:', errors.join(' | '));
  await ctx.close();
}
await browser.close();
