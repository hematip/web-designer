import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activityKcal, bmi, bmiClass, clampBudget, makePlan, mifflin, referenceWeight, trend } from '../src/lib/calc.ts';

const base = { sex: 'female' as const, age: 35, heightCm: 165, weightKg: 80, activity: 'mixed' as const, goal: 'lose' as const, pace: 'normal' as const };

test('BMI and WHO classes', () => {
  assert.equal(Math.round(bmi(80, 165) * 10) / 10, 29.4);
  assert.equal(bmiClass(18.4), 'under');
  assert.equal(bmiClass(24.99), 'normal');
  assert.equal(bmiClass(25), 'over');
  assert.equal(bmiClass(30), 'obese1');
  assert.equal(bmiClass(40), 'obese3');
});

test('Mifflin-St Jeor', () => {
  assert.equal(mifflin('male', 80, 180, 30), 10 * 80 + 6.25 * 180 - 150 + 5);
  assert.equal(mifflin('female', 60, 160, 40), 600 + 1000 - 200 - 161);
});

test('weight-loss plan: 0.5 kg/week deficit, macros add up', () => {
  const p = makePlan(base);
  assert.ok(p.deficit > 500 && p.deficit < 600, `deficit ${p.deficit}`);
  assert.equal(p.budget % 10, 0);
  const macro = p.proteinG * 4 + p.carbG * 4 + p.fatG * 9;
  assert.ok(Math.abs(macro - p.budget) <= 40, `macros ${macro} vs ${p.budget}`);
  // protein uses reference weight (BMI>25 → weight at BMI 25)
  assert.ok(referenceWeight(80, 165) < 80);
  assert.ok(p.proteinG >= 85 && p.proteinG <= 100, `protein ${p.proteinG}`);
});

test('floor: female never below 1200 kcal when losing', () => {
  const p = makePlan({ ...base, weightKg: 52, heightCm: 150, age: 60, activity: 'sitting', pace: 'fast' });
  assert.ok(p.budget >= 1200 || p.budget >= p.tdee - 1, `budget ${p.budget}`);
  assert.ok(p.notes.includes('floor-applied') || p.notes.includes('deficit-capped'));
});

test('floor: male never below 1500 kcal when losing', () => {
  const p = makePlan({ ...base, sex: 'male', weightKg: 60, heightCm: 160, age: 65, activity: 'sitting', pace: 'fast' });
  assert.ok(p.budget >= 1500 || p.budget >= p.tdee - 1);
});

test('deficit capped at 25% of TDEE and 1%/week of bodyweight', () => {
  const p = makePlan({ ...base, weightKg: 58, heightCm: 165, pace: 'fast' });
  assert.ok(p.deficit <= p.tdee * 0.25 + 10);
  assert.ok(-p.weeklyChangeKg <= 58 * 0.01 + 0.01);
});

test('BMI < 18.5 blocks weight loss', () => {
  const p = makePlan({ ...base, weightKg: 48, heightCm: 165 });
  assert.ok(p.notes.includes('loss-blocked-bmi'));
  assert.ok(p.deficit <= 10);
});

test('under 18 blocks weight loss', () => {
  const p = makePlan({ ...base, age: 16 });
  assert.ok(p.notes.includes('loss-blocked-age'));
  assert.ok(p.deficit <= 10);
});

test('gain adds a surplus', () => {
  const p = makePlan({ ...base, goal: 'gain' });
  assert.ok(p.budget > p.tdee);
});

test('manual budget clamps to floor and absolute minimum', () => {
  assert.equal(clampBudget(700, 'female'), 1200);
  assert.equal(clampBudget(1000, 'male'), 1500);
  assert.equal(clampBudget(1834, 'female'), 1830);
});

test('activity kcal is net of resting energy', () => {
  assert.equal(activityKcal(3.5, 80, 60), 200);
  assert.equal(activityKcal(1, 80, 60), 0);
});

test('weight trend smooths noise and handles gaps', () => {
  const t = trend([
    { date: '2026-10-01', kg: 80 },
    { date: '2026-10-02', kg: 81 },
    { date: '2026-10-10', kg: 79 },
  ]);
  assert.equal(t[0].trend, 80);
  assert.ok(t[1].trend > 80 && t[1].trend < 80.2);
  assert.ok(t[2].trend < t[1].trend);
});
