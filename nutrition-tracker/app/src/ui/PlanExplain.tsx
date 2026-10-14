import { ACTIVITY_FACTOR, type Activity, type Goal, type Plan } from '../lib/calc.ts';
import { fa } from '../lib/fa.ts';

/** "Where do these numbers come from?" — plain-language formula disclosure. */
export function PlanExplain({
  plan,
  goal,
  activity,
  weight,
  katch,
  open = false,
}: {
  plan: Pick<Plan, 'bmr' | 'tdee' | 'budget' | 'proteinG' | 'weeklyChangeKg'> & { referenceWeightKg?: number };
  goal: Goal;
  activity: Activity;
  weight: number;
  katch?: boolean;
  open?: boolean;
}) {
  const diff = plan.tdee - plan.budget;
  return (
    <details className="explain" open={open}>
      <summary>این عددها از کجا اومد؟</summary>
      <ul>
        <li>
          انرژی پایهٔ بدن (BMR): حدود <b>{fa(plan.bmr)}</b> کالری، با فرمول {katch ? 'کچ‌مک‌آردل (از درصد چربی)' : 'میفلین-سنت‌جئور (از قد، وزن، سن و جنس)'}.
        </li>
        <li>
          با فعالیت روزمره (ضریب {fa(ACTIVITY_FACTOR[activity], 3)}): حدود <b>{fa(plan.tdee)}</b> کالری برای نگه داشتن وزن.
        </li>
        {goal !== 'maintain' && diff !== 0 && (
          <li>
            {diff > 0 ? `منهای ${fa(diff)}` : `به‌اضافهٔ ${fa(-diff)}`} کالری برای {diff > 0 ? 'کم کردن' : 'اضافه کردن'} حدود{' '}
            {fa(Math.abs(plan.weeklyChangeKg) * 1000)} گرم در هفته ← بودجهٔ <b>{fa(plan.budget)}</b> کالری.
          </li>
        )}
        <li>
          پروتئین: حدود {fa(plan.proteinG)} گرم، بر اساس {plan.referenceWeightKg && plan.referenceWeightKg < weight - 0.5 ? `وزن مرجع ${fa(plan.referenceWeightKg, 1)} کیلو (وزن متناظر با BMI ۲۵)` : 'وزن فعلی'}.
        </li>
        <li>ورزش‌هایی که ثبت می‌کنید جداگانه حساب می‌شن و (اگه بخواید) به بودجهٔ همون روز اضافه می‌شن.</li>
        <li>همهٔ این‌ها تخمین‌اند. اگه چند هفته وزنتون عوض نشد، بودجه رو کمی جابه‌جا کنید.</li>
      </ul>
    </details>
  );
}
