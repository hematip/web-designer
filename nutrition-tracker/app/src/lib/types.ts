import type { Activity, Goal, Pace, PlanNote, Sex } from './calc.ts';

export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEALS: { id: Meal; label: string }[] = [
  { id: 'breakfast', label: 'صبحانه' },
  { id: 'lunch', label: 'ناهار' },
  { id: 'snack', label: 'میان‌وعده' },
  { id: 'dinner', label: 'شام' },
];

export const MEAL_LABEL: Record<Meal, string> = Object.fromEntries(MEALS.map((m) => [m.id, m.label])) as Record<Meal, string>;

export interface Profile {
  sex: Sex;
  birthYear: number; // Jalali
  heightCm: number;
  startWeightKg: number;
  goalWeightKg: number | null;
  activity: Activity;
  goal: Goal;
  pace: Pace;
  bodyFatPct: number | null;
}

/** A plan applies from its `from` date until the next plan. Record id = from. */
export interface PlanRec {
  from: string;
  budget: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  bmr: number;
  tdee: number;
  weeklyChangeKg: number;
  weightKg: number;
  notes: PlanNote[];
  manual: boolean;
}

export interface Settings {
  addActivity: boolean;
  waterGoal: number;
  stepsGoal: number;
  installHidden: boolean;
}

export const DEFAULT_SETTINGS: Settings = { addActivity: true, waterGoal: 8, stepsGoal: 7000, installHidden: false };

export interface FoodEntry {
  date: string;
  meal: Meal;
  name: string;
  foodId: string | null;
  myFoodId: string | null;
  unit: string; // unit label, or 'گرم'
  unitGrams: number | null; // grams per unit; null for my-foods / quick add
  qty: number;
  kcal: number;
  p: number;
  c: number;
  f: number;
  kind: 'food' | 'my' | 'quick';
  at: number;
}

export interface ActEntry {
  date: string;
  actId: string | null;
  name: string;
  met: number;
  minutes: number;
  kcal: number;
  at: number;
}

export interface WeightRec {
  date: string;
  kg: number;
  waistCm: number | null;
}

export interface WaterRec {
  date: string;
  glasses: number;
}

export interface StepsRec {
  date: string;
  steps: number;
}

/** User-defined food; nutrition is per one `unit`. */
export interface MyFood {
  n: string;
  unit: string;
  k: number;
  p: number;
  c: number;
  f: number;
}

export interface CollectionMap {
  profile: Profile;
  plan: PlanRec;
  settings: Settings;
  food: FoodEntry;
  act: ActEntry;
  weight: WeightRec;
  water: WaterRec;
  steps: StepsRec;
  myfood: MyFood;
}

export type Col = keyof CollectionMap;
