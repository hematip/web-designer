import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FOODS } from '../src/data/foods.ts';
import { ACTIVITIES } from '../src/data/activities.ts';
import { buildIndex, search } from '../src/lib/search.ts';
import { fa, normalizeFa, parseNum, weekStart, jalaliYear } from '../src/lib/fa.ts';

test('food ids are unique and every food has a unit', () => {
  const ids = new Set(FOODS.map((f) => f.id));
  assert.equal(ids.size, FOODS.length);
  for (const f of FOODS) assert.ok(f.u.length > 0 && f.u.every(([, g]: [string, number]) => g > 0), f.id);
});

test('food macros are consistent with kcal (±12% or ±8 kcal)', () => {
  for (const f of FOODS) {
    const m = f.p * 4 + f.c * 4 + f.f * 9;
    const ok = Math.abs(m - f.k) <= Math.max(8, f.k * 0.12);
    assert.ok(ok, `${f.id}: kcal ${f.k} vs macros ${m.toFixed(0)}`);
  }
});

test('activities have plausible METs', () => {
  for (const a of ACTIVITIES) assert.ok(a.met >= 1.5 && a.met <= 12, a.id);
});

test('Persian search tolerates Arabic letters, spaces and ZWNJ', () => {
  const idx = buildIndex(FOODS);
  assert.equal(search(idx, 'قورمه')[0].id, 'ghormeh');
  assert.equal(search(idx, 'قورمه سبزي')[0].id, 'ghormeh');
  assert.equal(search(idx, 'قورمهسبزی')[0].id, 'ghormeh');
  assert.equal(search(idx, 'كوبيده')[0].id, 'koobideh');
  assert.equal(search(idx, 'جوجه کباب')[0].id, 'joojeh');
  assert.ok(search(idx, 'سیب').some((f) => f.id === 'apple'));
  assert.ok(search(idx, 'تخم مرغ').length >= 2);
  assert.ok(search(idx, 'فسنجون').some((f) => f.id === 'fesenjan'));
});

test('number helpers', () => {
  assert.equal(parseNum('۷۲٫۵'), 72.5);
  assert.equal(parseNum('١٦٥'), 165);
  assert.equal(parseNum(''), null);
  assert.equal(fa(1820), '۱٬۸۲۰');
  assert.equal(normalizeFa('ي ك'), 'ی ک');
});

test('week starts on Saturday', () => {
  assert.equal(weekStart('2026-10-14'), '2026-10-10'); // Wed → Sat
  assert.equal(weekStart('2026-10-10'), '2026-10-10');
  assert.ok(jalaliYear(new Date(2026, 9, 14)) === 1405);
});
