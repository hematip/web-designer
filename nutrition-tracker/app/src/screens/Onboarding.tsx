import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { bmi, lossAllowed, makePlan, type Activity, type Goal, type Pace, type Sex, type PlanNote } from '../lib/calc.ts';
import { fa, jalaliYear } from '../lib/fa.ts';
import { get, put } from '../lib/store.ts';
import { today, settings, weights } from '../lib/derive.ts';
import type { PlanRec, Profile } from '../lib/types.ts';
import { Field, NumInput } from '../ui/kit.tsx';
import { Mascot, Bubble, type Mood } from '../ui/Mascot.tsx';
import { PlanExplain } from '../ui/PlanExplain.tsx';

const GOALS: { id: Goal; emoji: string; title: string; sub: string }[] = [
  { id: 'lose', emoji: '🪶', title: 'کم کردن وزن', sub: 'آروم و پیوسته، بدون گرسنگی کشیدن' },
  { id: 'maintain', emoji: '⚖️', title: 'نگه داشتن وزن', sub: 'فقط می‌خوام حواسم به خوردنم باشه' },
  { id: 'gain', emoji: '💪', title: 'اضافه کردن وزن یا عضله', sub: 'با پروتئین کافی' },
];

const ACTS: { id: Activity; emoji: string; title: string; sub: string }[] = [
  { id: 'sitting', emoji: '🪑', title: 'بیشتر نشسته', sub: 'کار پشت میز، رانندگی، درس' },
  { id: 'mixed', emoji: '🚶', title: 'گاهی سرپا', sub: 'خونه‌داری، معلمی، رفت‌وآمد پیاده' },
  { id: 'standing', emoji: '🏃', title: 'بیشتر سرپا یا کار بدنی', sub: 'فروشندگی، پرستاری، کارگاه' },
];

const PACES: { id: Pace; title: string; lose: string; gain: string }[] = [
  { id: 'slow', title: 'آروم', lose: 'حدود ۲۵۰ گرم در هفته', gain: 'حدود ۱۰۰ گرم در هفته' },
  { id: 'normal', title: 'معمولی', lose: 'حدود نیم کیلو در هفته', gain: 'حدود ۲۰۰ گرم در هفته' },
  { id: 'fast', title: 'تندتر', lose: 'حدود ۷۵۰ گرم در هفته', gain: 'حدود ۳۰۰ گرم در هفته' },
];

export const NOTE_TEXT: Record<PlanNote, string> = {
  'floor-applied': 'بودجه به حداقل امن رسید و از این کمتر نمی‌شه.',
  'deficit-capped': 'سرعت کم کردن وزن رو کمی آروم‌تر کردیم تا امن‌تر باشه.',
  'below-bmr': 'این بودجه کمی کمتر از انرژی پایهٔ بدنتونه؛ اگه زیاد گرسنه شدید، سرعت رو آروم‌تر کنید.',
  'loss-blocked-bmi': 'با BMI فعلی‌تون کم کردن وزن پیشنهاد نمی‌شه؛ برنامه روی نگه داشتن وزن تنظیم شد. برای هدف‌گذاری با پزشک یا متخصص تغذیه مشورت کنید.',
  'loss-blocked-age': 'برای زیر ۱۸ سال برنامهٔ کم کردن وزن نمی‌دیم؛ برنامه روی نگه داشتن وزن تنظیم شد. برای هدف‌گذاری با پزشک مشورت کنید.',
  'katch-used': 'چون درصد چربی رو وارد کردید، انرژی پایه با فرمول کچ‌مک‌آردل حساب شد.',
};

const LINES: { mood: Mood; text: string }[] = [
  { mood: 'yay', text: 'سلام! من نخودچی‌ام. اول بگید هدفتون چیه؟' },
  { mood: 'happy', text: 'یه کم از خودتون بگید. قول می‌دم به کسی نگم!' },
  { mood: 'wow', text: 'قد و وزن رو بدون تعارف بنویسید؛ فقط برای حساب‌کتابه.' },
  { mood: 'calm', text: 'روزهاتون بیشتر چطوری می‌گذره؟ (ورزش رو جدا ثبت می‌کنیم.)' },
  { mood: 'wink', text: 'با چه سرعتی پیش بریم؟ آروم و پیوسته معمولاً بهتر جواب می‌ده.' },
  { mood: 'yay', text: 'اینم برنامهٔ روزانه‌تون! هر وقت خواستید عوضش می‌کنیم.' },
];

export function Onboarding({ onDone, editing = false }: { onDone: () => void; editing?: boolean }) {
  const existing = get('profile', 'me');
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>(existing?.goal ?? 'lose');
  const [sex, setSex] = useState<Sex | null>(existing?.sex ?? null);
  const [birthYear, setBirthYear] = useState<number | null>(existing?.birthYear ?? null);
  const [height, setHeight] = useState<number | null>(existing?.heightCm ?? null);
  const [weight, setWeight] = useState<number | null>(existing ? lastWeight() ?? existing.startWeightKg : null);
  const [goalWeight, setGoalWeight] = useState<number | null>(existing?.goalWeightKg ?? null);
  const [bodyFat, setBodyFat] = useState<number | null>(existing?.bodyFatPct ?? null);
  const [activity, setActivity] = useState<Activity | null>(existing?.activity ?? null);
  const [pace, setPace] = useState<Pace>(existing?.pace ?? 'normal');
  const [touched, setTouched] = useState(false);

  const nowYear = jalaliYear();
  const age = birthYear ? nowYear - birthYear : null;

  const errors = {
    birthYear: birthYear == null ? 'سال تولد رو بنویسید؛ مثلاً ۱۳۷۰' : birthYear < nowYear - 100 || birthYear > nowYear - 10 ? 'سال تولد رو به شمسی بنویسید؛ مثلاً ۱۳۷۰' : null,
    sex: sex ? null : 'یکی رو انتخاب کنید',
    height: height == null ? 'قد رو به سانتی‌متر بنویسید؛ مثلاً ۱۶۵' : height < 120 || height > 230 ? 'قد باید بین ۱۲۰ تا ۲۳۰ سانتی‌متر باشه' : null,
    weight: weight == null ? 'وزن رو به کیلوگرم بنویسید؛ مثلاً ۷۲٫۵' : weight < 30 || weight > 300 ? 'وزن باید بین ۳۰ تا ۳۰۰ کیلو باشه' : null,
    goalWeight: goalWeight != null && (goalWeight < 30 || goalWeight > 300) ? 'وزن هدف باید بین ۳۰ تا ۳۰۰ کیلو باشه' : null,
    bodyFat: bodyFat != null && (bodyFat < 4 || bodyFat > 60) ? 'درصد چربی باید بین ۴ تا ۶۰ باشه (یا خالی بذارید)' : null,
  };

  const skipPace = goal === 'maintain';
  const lastStep = 5;

  const canNext =
    step === 0 ? true :
    step === 1 ? !errors.sex && !errors.birthYear :
    step === 2 ? !errors.height && !errors.weight && !errors.goalWeight && !errors.bodyFat :
    step === 3 ? !!activity :
    true;

  const plan = useMemo(() => {
    if (!sex || !age || !height || !weight || !activity) return null;
    return makePlan({ sex, age, heightCm: height, weightKg: weight, bodyFatPct: bodyFat, activity, goal, pace });
  }, [sex, age, height, weight, activity, goal, pace, bodyFat]);

  const loss = sex && age && height && weight ? lossAllowed({ age, heightCm: height, weightKg: weight }) : { ok: true };

  function next() {
    setTouched(true);
    if (!canNext) return;
    setTouched(false);
    let s = step + 1;
    if (s === 4 && skipPace) s = 5;
    setStep(Math.min(s, lastStep));
    window.scrollTo(0, 0);
  }

  function back() {
    let s = step - 1;
    if (s === 4 && skipPace) s = 3;
    setStep(Math.max(s, 0));
  }

  function save() {
    if (!plan || !sex || !birthYear || !height || !weight || !activity) return;
    const d = today();
    const profile: Profile = {
      sex,
      birthYear,
      heightCm: height,
      startWeightKg: existing?.startWeightKg ?? weight,
      goalWeightKg: goalWeight,
      activity,
      goal,
      pace,
      bodyFatPct: bodyFat,
    };
    put('profile', 'me', profile);
    const rec: PlanRec = {
      from: d,
      budget: plan.budget,
      proteinG: plan.proteinG,
      fatG: plan.fatG,
      carbG: plan.carbG,
      bmr: plan.bmr,
      tdee: plan.tdee,
      weeklyChangeKg: plan.weeklyChangeKg,
      weightKg: weight,
      notes: plan.notes,
      manual: false,
    };
    put('plan', d, rec);
    if (!get('settings', 'me')) put('settings', 'me', settings());
    if (!get('weight', d) && lastWeight() !== weight) put('weight', d, { date: d, kg: weight, waistCm: null });
    onDone();
  }

  const line = LINES[step];
  const totalDots = skipPace ? 5 : 6;
  const dotIndex = skipPace && step === 5 ? 4 : step;

  return (
    <main className="center-page" style={{ justifyContent: 'flex-start' }}>
      <div className="row between">
        {step > 0 ? (
          <button type="button" className="icon-btn" onClick={back} aria-label="مرحلهٔ قبل">
            <ChevronRight size={22} strokeWidth={2.6} />
          </button>
        ) : editing ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>
            انصراف
          </button>
        ) : (
          <span />
        )}
        <div className="progress-dots" aria-label={`مرحلهٔ ${fa(dotIndex + 1)} از ${fa(totalDots)}`}>
          {Array.from({ length: totalDots }, (_, i) => (
            <span key={i} className={i <= dotIndex ? 'on' : ''} />
          ))}
        </div>
        <span style={{ width: 44 }} />
      </div>

      <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}>
        <Mascot mood={line.mood} size={84} bob popKey={step} />
        <div style={{ flex: 1, paddingTop: 8 }}>
          <Bubble>{line.text}</Bubble>
        </div>
      </div>

      {step === 0 && (
        <fieldset className="choices" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr-only">هدف</legend>
          <div role="radiogroup" aria-label="هدف" className="choices">
            {GOALS.map((g) => (
              <button key={g.id} type="button" role="radio" aria-checked={goal === g.id} className="choice" onClick={() => setGoal(g.id)}>
                <span className="emoji" aria-hidden="true">{g.emoji}</span>
                <span>
                  <strong>{g.title}</strong>
                  <small>{g.sub}</small>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="stack">
          <div className="field">
            <span className="label" id="sex-label">جنس (برای فرمول انرژی)</span>
            <div className="seg" role="radiogroup" aria-labelledby="sex-label">
              <button type="button" role="radio" aria-checked={sex === 'female'} aria-pressed={sex === 'female'} onClick={() => setSex('female')}>
                زن
              </button>
              <button type="button" role="radio" aria-checked={sex === 'male'} aria-pressed={sex === 'male'} onClick={() => setSex('male')}>
                مرد
              </button>
            </div>
            {touched && errors.sex && <span className="error">{errors.sex}</span>}
          </div>
          <Field label="سال تولد (شمسی)" error={touched ? errors.birthYear : null} hint={age && !errors.birthYear ? `یعنی حدود ${fa(age)} سال` : undefined}>
            {(p) => <NumInput {...p} value={birthYear} onChange={setBirthYear} placeholder="۱۳۷۰" />}
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="stack">
          <Field label="قد" error={touched ? errors.height : null}>
            {(p) => <NumInput {...p} value={height} onChange={setHeight} suffix="سانتی‌متر" placeholder="۱۶۵" />}
          </Field>
          <Field label="وزن الان" error={touched ? errors.weight : null}>
            {(p) => <NumInput {...p} value={weight} onChange={setWeight} suffix="کیلو" placeholder="۷۲٫۵" />}
          </Field>
          {height && weight && !errors.height && !errors.weight && (
            <p className="muted" style={{ fontSize: 15 }}>
              BMI شما حدود {fa(bmi(weight, height), 1)} است.
            </p>
          )}
          {goal !== 'maintain' && (
            <Field label="وزن هدف (اختیاری)" error={touched ? errors.goalWeight : null} hint="فقط برای دیدن پیشرفت؛ روی بودجه اثری نداره.">
              {(p) => <NumInput {...p} value={goalWeight} onChange={setGoalWeight} suffix="کیلو" />}
            </Field>
          )}
          <details className="explain">
            <summary>درصد چربی بدنتون رو می‌دونید؟ (اختیاری)</summary>
            <div style={{ marginTop: 8 }}>
              <Field label="درصد چربی" error={touched ? errors.bodyFat : null} hint="اگه با دستگاه معتبر اندازه گرفتید. وگرنه خالی بذارید.">
                {(p) => <NumInput {...p} value={bodyFat} onChange={setBodyFat} suffix="٪" />}
              </Field>
            </div>
          </details>
        </div>
      )}

      {step === 3 && (
        <div role="radiogroup" aria-label="فعالیت روزمره" className="choices">
          {ACTS.map((a) => (
            <button key={a.id} type="button" role="radio" aria-checked={activity === a.id} className="choice" onClick={() => setActivity(a.id)}>
              <span className="emoji" aria-hidden="true">{a.emoji}</span>
              <span>
                <strong>{a.title}</strong>
                <small>{a.sub}</small>
              </span>
            </button>
          ))}
          {touched && !activity && <span className="error">یکی رو انتخاب کنید</span>}
        </div>
      )}

      {step === 4 && (
        <div className="stack">
          {goal === 'lose' && !loss.ok && (
            <p className="alert info">{loss.reason === 'age' ? NOTE_TEXT['loss-blocked-age'] : NOTE_TEXT['loss-blocked-bmi']}</p>
          )}
          <div role="radiogroup" aria-label="سرعت" className="choices">
            {PACES.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={pace === p.id} className="choice" onClick={() => setPace(p.id)}>
                <span>
                  <strong>{p.title}</strong>
                  <small>{goal === 'gain' ? p.gain : p.lose}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && plan && (
        <div className="stack">
          <div className="card hero" style={{ gridTemplateColumns: '1fr' }}>
            <p style={{ fontWeight: 800 }}>بودجهٔ روزانه</p>
            <p className="result-big">
              {fa(plan.budget)} <span style={{ fontSize: 20 }}>کالری</span>
            </p>
            <p style={{ fontWeight: 700 }}>
              پروتئین {fa(plan.proteinG)} گرم · کربوهیدرات {fa(plan.carbG)} · چربی {fa(plan.fatG)} گرم
            </p>
          </div>
          {plan.notes.filter((n) => n !== 'katch-used').map((n) => (
            <p key={n} className="alert info">
              {NOTE_TEXT[n]}
            </p>
          ))}
          <PlanExplain plan={plan} goal={goal} activity={activity!} weight={weight!} katch={plan.notes.includes('katch-used')} />
        </div>
      )}

      <div style={{ marginTop: 'auto' }}>
        {step < lastStep ? (
          <button type="button" className="btn btn-primary btn-block" onClick={next}>
            بعدی
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-block" onClick={save} disabled={!plan}>
            {editing ? 'ذخیرهٔ برنامهٔ جدید' : 'بزن بریم!'}
          </button>
        )}
      </div>
    </main>
  );
}

function lastWeight(): number | null {
  const w = weights();
  return w.length ? w[w.length - 1].kg : null;
}
