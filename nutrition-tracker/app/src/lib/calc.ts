// Calculation engine. Rules and sources: docs/product-ux-brief.md §9.
// Pure functions only, so they can be unit-tested without a browser.

export type Sex = 'female' | 'male';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Activity = 'sitting' | 'mixed' | 'standing';
export type Pace = 'slow' | 'normal' | 'fast';

export interface ProfileInput {
  sex: Sex;
  age: number; // years
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number | null; // 0–60, optional
  activity: Activity;
  goal: Goal;
  pace: Pace;
}

export interface Plan {
  bmr: number;
  tdee: number;
  budget: number; // daily kcal target before activity add-back
  deficit: number; // positive = deficit, negative = surplus
  proteinG: number;
  fatG: number;
  carbG: number;
  referenceWeightKg: number;
  weeklyChangeKg: number; // planned, negative = loss
  notes: PlanNote[];
}

export type PlanNote =
  | 'floor-applied' // budget raised to the minimum floor
  | 'deficit-capped' // deficit limited to 25% of TDEE or 1% bodyweight/week
  | 'below-bmr' // budget is below BMR (informational, neutral)
  | 'loss-blocked-bmi' // BMI < 18.5: weight loss not offered
  | 'loss-blocked-age' // under 18: no deficit targets
  | 'katch-used';

export const ACTIVITY_FACTOR: Record<Activity, number> = {
  sitting: 1.2,
  mixed: 1.375,
  standing: 1.55,
};

/** kg per week for each pace when losing; gaining uses half of these. */
export const PACE_KG_PER_WEEK: Record<Pace, number> = {
  slow: 0.25,
  normal: 0.5,
  fast: 0.75,
};

export const KCAL_PER_KG = 7700;
export const FLOOR_KCAL: Record<Sex, number> = { female: 1200, male: 1500 };
export const ABSOLUTE_MIN_KCAL = 800;

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export type BmiClass = 'under' | 'normal' | 'over' | 'obese1' | 'obese2' | 'obese3';

export function bmiClass(value: number): BmiClass {
  if (value < 18.5) return 'under';
  if (value < 25) return 'normal';
  if (value < 30) return 'over';
  if (value < 35) return 'obese1';
  if (value < 40) return 'obese2';
  return 'obese3';
}

export function mifflin(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function katchMcArdle(weightKg: number, bodyFatPct: number): number {
  const lbm = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * lbm;
}

/** Weight at BMI 25 for this height; used as protein reference for BMI > 25. */
export function referenceWeight(weightKg: number, heightCm: number): number {
  const b = bmi(weightKg, heightCm);
  if (b <= 25) return weightKg;
  const m = heightCm / 100;
  return 25 * m * m;
}

export function lossAllowed(p: Pick<ProfileInput, 'age' | 'weightKg' | 'heightCm'>): {
  ok: boolean;
  reason?: 'age' | 'bmi';
} {
  if (p.age < 18) return { ok: false, reason: 'age' };
  if (bmi(p.weightKg, p.heightCm) < 18.5) return { ok: false, reason: 'bmi' };
  return { ok: true };
}

const round = (v: number, step: number) => Math.round(v / step) * step;

export function makePlan(p: ProfileInput): Plan {
  const notes: PlanNote[] = [];
  const useKatch = p.bodyFatPct != null && p.bodyFatPct > 3 && p.bodyFatPct < 60;
  const bmr = useKatch ? katchMcArdle(p.weightKg, p.bodyFatPct as number) : mifflin(p.sex, p.weightKg, p.heightCm, p.age);
  if (useKatch) notes.push('katch-used');
  const tdee = bmr * ACTIVITY_FACTOR[p.activity];

  let goal = p.goal;
  const allowed = lossAllowed(p);
  if (goal === 'lose' && !allowed.ok) {
    notes.push(allowed.reason === 'age' ? 'loss-blocked-age' : 'loss-blocked-bmi');
    goal = 'maintain';
  }

  let deficit = 0;
  let weeklyChangeKg = 0;
  if (goal === 'lose') {
    const wanted = (PACE_KG_PER_WEEK[p.pace] * KCAL_PER_KG) / 7;
    const capByTdee = tdee * 0.25;
    const capByWeight = (p.weightKg * 0.01 * KCAL_PER_KG) / 7;
    deficit = Math.min(wanted, capByTdee, capByWeight);
    if (deficit < wanted - 1) notes.push('deficit-capped');
  } else if (goal === 'gain') {
    // Surplus of 250 / 350 / 500 kcal depending on pace.
    deficit = -({ slow: 250, normal: 350, fast: 500 } as const)[p.pace];
  }

  let budget = tdee - deficit;
  const floor = FLOOR_KCAL[p.sex];
  if (goal === 'lose' && budget < floor) {
    budget = Math.min(floor, tdee); // never set a floor above maintenance
    notes.push('floor-applied');
  }
  budget = Math.max(budget, ABSOLUTE_MIN_KCAL);
  budget = round(budget, 10);
  deficit = tdee - budget;
  weeklyChangeKg = -((deficit * 7) / KCAL_PER_KG);
  if (budget < bmr) notes.push('below-bmr');

  const refW = referenceWeight(p.weightKg, p.heightCm);
  const perKg = goal === 'lose' ? 1.4 : goal === 'gain' ? 1.6 : p.activity === 'sitting' ? 1.0 : 1.2;
  let proteinG = Math.min(refW * perKg, refW * 2.2);
  proteinG = round(proteinG, 5);

  const fatMin = refW * 0.6;
  let fatG = Math.max((budget * 0.28) / 9, fatMin);
  fatG = round(fatG, 5);
  let carbG = (budget - proteinG * 4 - fatG * 9) / 4;
  carbG = Math.max(round(carbG, 5), 0);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    budget,
    deficit: Math.round(deficit),
    proteinG,
    fatG,
    carbG,
    referenceWeightKg: Math.round(refW * 10) / 10,
    weeklyChangeKg: Math.round(weeklyChangeKg * 100) / 100,
    notes,
  };
}

/** Clamp a manually edited budget to the safety rules. */
export function clampBudget(value: number, sex: Sex): number {
  const v = Math.max(value, FLOOR_KCAL[sex], ABSOLUTE_MIN_KCAL);
  return Math.min(round(v, 10), 6000);
}

/** Net kcal of an activity: (MET − 1) × kg × hours. Resting energy is already in the budget. */
export function activityKcal(met: number, weightKg: number, minutes: number): number {
  return Math.max(0, Math.round((met - 1) * weightKg * (minutes / 60)));
}

export function macroKcal(p: number, c: number, f: number): number {
  return p * 4 + c * 4 + f * 9;
}

/** Exponentially weighted moving average of a dated series (sorted ascending). */
export function trend(points: { date: string; kg: number }[], alpha = 0.1): { date: string; kg: number; trend: number }[] {
  const out: { date: string; kg: number; trend: number }[] = [];
  let t: number | null = null;
  let prevDate: string | null = null;
  for (const pt of points) {
    if (t === null) t = pt.kg;
    else {
      // Gaps of several days pull the trend proportionally further.
      const days = prevDate ? Math.max(1, daysBetween(prevDate, pt.date)) : 1;
      const a = 1 - Math.pow(1 - alpha, days);
      t = t + a * (pt.kg - t);
    }
    prevDate = pt.date;
    out.push({ ...pt, trend: Math.round(t * 100) / 100 });
  }
  return out;
}

export function daysBetween(a: string, b: string): number {
  const da = Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10));
  const db = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10));
  return Math.round((db - da) / 86400000);
}
