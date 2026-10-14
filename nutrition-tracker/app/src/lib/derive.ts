// Read-side helpers built on the store.
import { get, list } from './store.ts';
import { DEFAULT_SETTINGS, type FoodEntry, type Meal, type PlanRec, type Settings } from './types.ts';
import { trend } from './calc.ts';
import { addDays, dateKey } from './fa.ts';

export function settings(): Settings {
  return { ...DEFAULT_SETTINGS, ...(get('settings', 'me') ?? {}) };
}

export function plans(): PlanRec[] {
  return list('plan').map((p) => p.data).sort((a, b) => a.from.localeCompare(b.from));
}

/** Plan in force on a date (the latest plan starting on or before it). */
export function planFor(date: string): PlanRec | null {
  const all = plans();
  if (!all.length) return null;
  let found = all[0];
  for (const p of all) if (p.from <= date) found = p;
  return found;
}

export interface DayTotals {
  kcal: number;
  p: number;
  c: number;
  f: number;
  activity: number;
  budget: number; // plan budget + activity (if enabled)
  base: number; // plan budget
  remaining: number;
  entries: { id: string; e: FoodEntry }[];
  logged: boolean;
}

export function foodEntries(date?: string) {
  return list('food')
    .filter((r) => !date || r.data.date === date)
    .map((r) => ({ id: r.id, e: r.data }))
    .sort((a, b) => a.e.at - b.e.at);
}

export function actEntries(date: string) {
  return list('act').filter((r) => r.data.date === date).map((r) => ({ id: r.id, a: r.data })).sort((x, y) => x.a.at - y.a.at);
}

export function dayTotals(date: string): DayTotals {
  const entries = foodEntries(date);
  const s = settings();
  let kcal = 0, p = 0, c = 0, f = 0;
  for (const { e } of entries) {
    kcal += e.kcal;
    p += e.p;
    c += e.c;
    f += e.f;
  }
  const activity = actEntries(date).reduce((sum, x) => sum + x.a.kcal, 0);
  const base = planFor(date)?.budget ?? 0;
  const budget = base + (s.addActivity ? activity : 0);
  return { kcal, p, c, f, activity, budget, base, remaining: budget - kcal, entries, logged: entries.length > 0 };
}

export function mealOf(date: string, meal: Meal) {
  return foodEntries(date).filter((x) => x.e.meal === meal);
}

export function defaultMeal(d = new Date()): Meal {
  const h = d.getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 16) return 'lunch';
  if (h >= 19 || h < 2) return 'dinner';
  return 'snack';
}

/** Most recent distinct foods, newest first. */
export function recentFoods(limit = 15): FoodEntry[] {
  const seen = new Set<string>();
  const out: FoodEntry[] = [];
  const all = list('food').map((r) => r.data).sort((a, b) => b.at - a.at);
  for (const e of all) {
    const key = e.foodId ? `f:${e.foodId}:${e.unit}` : e.myFoodId ? `m:${e.myFoodId}` : `q:${e.name}:${e.kcal}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}

export function weights() {
  return list('weight').map((r) => r.data).sort((a, b) => a.date.localeCompare(b.date));
}

export function weightTrend() {
  return trend(weights().map((w) => ({ date: w.date, kg: w.kg })));
}

/** Latest known weight: last weigh-in, else the profile's starting weight. */
export function currentWeight(): number | null {
  const w = weights();
  if (w.length) return w[w.length - 1].kg;
  return get('profile', 'me')?.startWeightKg ?? null;
}

export function water(date: string) {
  return get('water', date)?.glasses ?? 0;
}

export function steps(date: string) {
  return get('steps', date)?.steps ?? null;
}

export function range(from: string, days: number): string[] {
  return Array.from({ length: days }, (_, i) => addDays(from, i));
}

export const today = () => dateKey();
