// Render PNG app icons from public/icons/icon.svg with the preinstalled Chromium.
// Usage: npm run icons   (set CHROMIUM_PATH if Chromium lives elsewhere)
import { chromium } from 'playwright-core';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = '/opt/pw-browsers';
  for (const d of existsSync(base) ? readdirSync(base) : []) {
    const p = join(base, d, 'chrome-linux', 'chrome');
    if (d.startsWith('chromium-') && existsSync(p)) return p;
  }
  throw new Error('Chromium not found; set CHROMIUM_PATH');
}

const svg = readFileSync('public/icons/icon.svg', 'utf8');
// Maskable: full-bleed background, artwork inside the 80% safe zone.
const maskable = svg.replace('rx="112"', 'rx="0"').replace('translate(70 66) scale(3.05)', 'translate(114 110) scale(2.35)');
// Apple touch icon: opaque square (iOS rounds the corners itself).
const apple = svg.replace('rx="112"', 'rx="0"');

const jobs = [
  ['public/icons/icon-192.png', svg, 192],
  ['public/icons/icon-512.png', svg, 512],
  ['public/icons/icon-maskable-512.png', maskable, 512],
  ['public/icons/apple-touch-icon.png', apple, 180],
];

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage();
for (const [out, markup, size] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${markup.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('wrote', out);
}
await browser.close();
