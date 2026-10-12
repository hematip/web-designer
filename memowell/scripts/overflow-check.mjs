import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 390), height: 844 } });
const page = await ctx.newPage();
for (const p of process.argv.slice(2)) {
  await page.goto((process.env.BASE ?? 'http://localhost:4321') + p, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.right > window.innerWidth + 1 && b.width > 0) out.push(`${el.tagName}.${el.className?.baseVal ?? el.className} right=${Math.round(b.right)}`);
    });
    return { sw: document.documentElement.scrollWidth, out: out.slice(0, 12) };
  });
  console.log(p, r.sw, r.out.join('\n  '));
}
await browser.close();
