// Persian text, numbers and Jalali dates.

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Convert Persian/Arabic digits and separators to a parseable Latin number string. */
export function toLatinDigits(s: string): string {
  let out = '';
  for (const ch of s) {
    const fa = FA_DIGITS.indexOf(ch);
    const ar = AR_DIGITS.indexOf(ch);
    if (fa >= 0) out += String(fa);
    else if (ar >= 0) out += String(ar);
    else if (ch === '٫' || ch === '/' || ch === ',') out += '.';
    else if (ch === '٬') continue;
    else out += ch;
  }
  return out;
}

export function parseNum(s: string): number | null {
  const t = toLatinDigits(s).replace(/\s/g, '');
  if (t === '' || t === '.') return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

const nfCache = new Map<number, Intl.NumberFormat>();
/** Persian-digit number with Persian thousands separator. */
export function fa(n: number, maxFrac = 0): string {
  let f = nfCache.get(maxFrac);
  if (!f) {
    f = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: maxFrac });
    nfCache.set(maxFrac, f);
  }
  return f.format(maxFrac === 0 ? Math.round(n) : n);
}

const signed = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
/** Signed change, e.g. ‎−۰٫۴ / ‎+۱٫۲ (bidi-safe). */
export function faSigned(n: number): string {
  return signed.format(Math.round(n * 10) / 10);
}

/** Persian-digit string for a short label (no grouping). */
export function faDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => FA_DIGITS[+d]);
}

// ---- Persian search normalisation ----

export function normalizeFa(s: string): string {
  return toLatinDigits(s)
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/[ً-ٰٟ]/g, '') // harakat
    .replace(/ـ/g, '') // tatweel
    .replace(/[‌‏‎]/g, ' ')
    .replace(/[()،,.:؛\-–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export const compact = (s: string) => normalizeFa(s).replace(/ /g, '');

// ---- dates: keys are local YYYY-MM-DD (Gregorian) ----

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function keyToDate(key: string): Date {
  return new Date(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10), 12);
}

export function addDays(key: string, n: number): string {
  const d = keyToDate(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', opts);
const F_LONG = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
const F_DAY_MONTH = fmt({ day: 'numeric', month: 'long' });
const F_WEEKDAY_SHORT = fmt({ weekday: 'narrow' });
const F_FULL = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
const F_YEAR = new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' });
const F_DAY_NUM = fmt({ day: 'numeric' });

export const jLong = (key: string) => F_LONG.format(keyToDate(key));
export const jDayMonth = (key: string) => F_DAY_MONTH.format(keyToDate(key));
export const jWeekdayShort = (key: string) => F_WEEKDAY_SHORT.format(keyToDate(key));
export const jFull = (key: string) => F_FULL.format(keyToDate(key));
export const jDayNum = (key: string) => F_DAY_NUM.format(keyToDate(key));

/** Current Jalali year as a number (e.g. 1405). */
export function jalaliYear(d: Date = new Date()): number {
  return parseInt(toLatinDigits(F_YEAR.format(d)), 10);
}

/** Saturday-start week: returns the key of the Saturday on or before `key`. */
export function weekStart(key: string): string {
  const d = keyToDate(key);
  const dow = d.getDay(); // 0 Sun … 6 Sat
  const back = (dow + 1) % 7;
  return addDays(key, -back);
}

export function relativeDayLabel(key: string, today: string): string {
  if (key === today) return 'امروز';
  if (key === addDays(today, -1)) return 'دیروز';
  if (key === addDays(today, 1)) return 'فردا';
  return jLong(key);
}
