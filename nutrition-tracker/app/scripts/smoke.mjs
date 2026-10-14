// End-to-end smoke run against a running server (default http://localhost:8787, invite "family").
// Drives sign-up → onboarding → logging → reports in a phone-sized Chromium and saves screenshots.
// Usage: BASE=http://localhost:8787 INVITE=family OUT=./shots node scripts/smoke.mjs
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:8787';
const INVITE = process.env.INVITE || 'family';
const OUT = process.env.OUT || 'shots';
mkdirSync(OUT, { recursive: true });

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  for (const d of readdirSync('/opt/pw-browsers')) {
    const p = join('/opt/pw-browsers', d, 'chrome-linux', 'chrome');
    if (d.startsWith('chromium-') && existsSync(p)) return p;
  }
  throw new Error('Chromium not found');
}

const browser = await chromium.launch({ executablePath: findChromium() });
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fa-IR', hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const dlg = () => page.getByRole('dialog');
const shot = async (name, full = false) => { await page.waitForTimeout(450); return page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full }); };
const user = 'smoke' + Date.now().toString(36).slice(-5);

await page.goto(BASE);
await page.getByRole('button', { name: 'ساخت حساب' }).first().click();
await shot('01-signup');
await page.getByLabel('کد دعوت').fill(INVITE);
await page.getByLabel('اسمتون').fill('سارا');
await page.getByLabel('نام کاربری').fill(user);
await page.getByLabel('رمز').fill('secret123');
await page.getByRole('button', { name: 'ساختن حساب' }).click();

// onboarding
await page.getByRole('radio', { name: /کم کردن وزن/ }).waitFor();
await shot('02-onb-goal');
await page.getByRole('button', { name: 'بعدی' }).click();
await page.getByRole('radio', { name: 'زن' }).click();
await page.getByLabel('سال تولد (شمسی)').fill('۱۳۶۹');
await page.getByRole('button', { name: 'بعدی' }).click();
await page.getByLabel('قد').fill('163');
await page.getByLabel('وزن الان').fill('78.5');
await page.getByLabel('وزن هدف (اختیاری)').fill('68');
await shot('03-onb-body');
await page.getByRole('button', { name: 'بعدی' }).click();
await page.getByRole('radio', { name: /گاهی سرپا/ }).click();
await page.getByRole('button', { name: 'بعدی' }).click();
await page.getByRole('radio', { name: /معمولی/ }).click();
await page.getByRole('button', { name: 'بعدی' }).click();
await page.getByText('این عددها از کجا اومد؟').click();
await shot('04-onb-result', true);
await page.getByRole('button', { name: 'بزن بریم!' }).click();

// today (empty)
await page.getByRole('heading', { name: 'امروز' }).waitFor();
await shot('05-today-empty', true);

// log lunch: ghormeh 1 ladle + chelo 2 kafgir
await page.getByRole('button', { name: 'افزودن به ناهار' }).click();
await dlg().getByLabel('جست‌وجوی غذا').fill('قورمه');
await shot('06-search');
await dlg().getByRole('button', { name: /^قورمه‌سبزی/ }).click();
await shot('07-detail');
await dlg().getByRole('button', { name: 'افزودن به ناهار' }).click();
await dlg().getByLabel('جست‌وجوی غذا').fill('چلو');
await dlg().getByRole('button', { name: /^چلو/ }).click();
await dlg().getByRole('button', { name: '۲', exact: true }).click();
await dlg().getByRole('button', { name: 'افزودن به ناهار' }).click();
await dlg().getByLabel('جست‌وجوی غذا').fill('كوبيده'); // Arabic letters on purpose
await dlg().getByRole('button', { name: /^کباب کوبیده/ }).waitFor();
await dlg().getByRole('button', { name: 'تمام' }).click();

// breakfast via quick add
await page.getByRole('button', { name: 'افزودن به صبحانه' }).click();
await dlg().getByRole('button', { name: 'ثبت سریع کالری' }).click();
await dlg().getByLabel('اسم (اختیاری)').fill('نون و پنیر و گردو');
await dlg().getByLabel('کالری').fill('۳۸۰');
await dlg().getByRole('button', { name: 'افزودن به صبحانه' }).click();
await dlg().getByRole('button', { name: 'تمام' }).click();

// activity
await page.locator('#act-h').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'افزودن' }).last().click();
await dlg().getByRole('button', { name: 'پیاده‌روی تند', exact: true }).click();
await dlg().getByRole('button', { name: '۴۵', exact: true }).click();
await shot('08-activity');
await dlg().getByRole('button', { name: 'ثبت فعالیت' }).click();

// water x3
for (let i = 1; i <= 3; i++) await page.getByRole('button', { name: `لیوان ${new Intl.NumberFormat('fa-IR').format(i)}`, exact: true }).click();
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo(0, 0));
await shot('09-today-filled', true);

// center + → weight
await page.getByRole('button', { name: 'ثبت جدید' }).click();
await shot('10-add-menu');
await dlg().getByRole('button', { name: /وزن/ }).first().click();
await dlg().getByLabel('وزن', { exact: true }).fill('78.1');
await dlg().getByRole('button', { name: 'ذخیره' }).click();

await page.getByRole('link', { name: 'گزارش' }).click();
await page.getByRole('heading', { name: 'گزارش' }).waitFor();
await shot('11-reports', true);
await page.getByRole('link', { name: 'بدن' }).click();
await shot('12-body', true);
await page.getByRole('link', { name: 'من' }).click();
await shot('13-me', true);
await page.getByRole('button', { name: 'نصب روی صفحهٔ گوشی' }).click();
await shot('14-install');
await page.keyboard.press('Escape');

// offline: log while offline, then come back online and check the queue drains
await ctx.setOffline(true);
await page.getByRole('link', { name: 'امروز' }).click();
await page.getByRole('button', { name: 'افزودن به شام' }).click();
await dlg().getByLabel('جست‌وجوی غذا').fill('ماست');
await dlg().getByRole('button', { name: /^ماست کم‌چرب/ }).click();
await dlg().getByRole('button', { name: 'افزودن به شام' }).click();
await dlg().getByRole('button', { name: 'تمام' }).click();
await page.waitForTimeout(300);
await shot('15-offline');
const offlinePill = await page.locator('.sync-pill').innerText();
await ctx.setOffline(false);
await page.evaluate(() => window.dispatchEvent(new Event('online')));
await page.waitForTimeout(1500);
const onlinePill = await page.locator('.sync-pill').innerText();

// second device: same account sees the same data
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'fa-IR' });
const p2 = await ctx2.newPage();
p2.on('pageerror', (e) => errors.push('desktop: ' + e));
await p2.goto(BASE);
await p2.getByLabel('نام کاربری').fill(user);
await p2.getByLabel('رمز').fill('secret123');
await p2.getByRole('button', { name: 'ورود' }).last().click();
await p2.getByRole('heading', { name: 'امروز' }).waitFor();
await p2.waitForTimeout(500);
await p2.screenshot({ path: `${OUT}/16-desktop-today.png`, fullPage: true });
const desktopHasYogurt = await p2.getByText('ماست کم‌چرب').count();

console.log(JSON.stringify({ user, offlinePill, onlinePill, desktopHasYogurt, errors }, null, 2));
await browser.close();
