import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore, get } from '../lib/store.ts';
import { weightTrend, weights, today } from '../lib/derive.ts';
import { bmi, bmiClass, type BmiClass } from '../lib/calc.ts';
import { addDays, fa, faSigned, jFull, jalaliYear } from '../lib/fa.ts';
import { openSheet } from '../lib/nav.ts';
import { WeightChart } from '../ui/charts.tsx';
import { Mascot } from '../ui/Mascot.tsx';

const BMI_LABEL: Record<BmiClass, string> = {
  under: 'کمتر از وزن طبیعی',
  normal: 'محدودهٔ طبیعی',
  over: 'اضافه‌وزن',
  obese1: 'چاقی درجهٔ ۱',
  obese2: 'چاقی درجهٔ ۲',
  obese3: 'چاقی درجهٔ ۳',
};

export function Body() {
  useStore();
  const [range, setRange] = useState<30 | 90 | 0>(90);
  const profile = get('profile', 'me');
  const all = weightTrend();
  const from = range ? addDays(today(), -range) : '0000';
  const shown = all.filter((p) => p.date >= from);
  const list = weights().slice().reverse();
  const last = all[all.length - 1];
  const current = last?.trend ?? profile?.startWeightKg ?? null;
  const start = profile?.startWeightKg ?? null;
  const height = profile?.heightCm ?? null;
  const b = current && height ? bmi(current, height) : null;
  const age = profile ? jalaliYear() - profile.birthYear : null;
  const pin = b ? Math.min(Math.max((b - 10) / (40 - 10), 0), 1) * 100 : 0;
  const waist = list.find((w) => w.waistCm)?.waistCm ?? null;
  const whtr = waist && height ? waist / height : null;
  const goal = profile?.goalWeightKg ?? null;

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">بدن</h1>
        <button type="button" className="btn btn-sm btn-chick" onClick={() => openSheet({ kind: 'weight', date: today() })}>
          <Plus size={18} strokeWidth={3} /> ثبت وزن
        </button>
      </header>

      <section className="stat-grid" aria-label="خلاصهٔ وزن">
        <div className="stat">
          <p className="label">وزن (روند)</p>
          <p className="value">{current ? `${fa(current, 1)}` : '—'}</p>
          <p className="sub">کیلو</p>
        </div>
        <div className="stat">
          <p className="label">تغییر از شروع</p>
          <p className="value">{current && start ? faSigned(current - start) : '—'}</p>
          <p className="sub">{start ? `شروع: ${fa(start, 1)} کیلو` : ''}</p>
        </div>
        {goal && current && (
          <div className="stat" style={{ gridColumn: '1 / -1' }}>
            <p className="label">تا هدف</p>
            <p className="value">{fa(Math.abs(current - goal), 1)} کیلو</p>
            <p className="sub">هدف: {fa(goal, 1)} کیلو. با روند پیوسته، قدم‌به‌قدم.</p>
          </div>
        )}
      </section>

      <section className="card stack" aria-labelledby="w-chart">
        <div className="row between wrap">
          <h2 id="w-chart" className="card-title">
            روند وزن
          </h2>
          <div className="seg" role="group" aria-label="بازهٔ زمانی" style={{ minWidth: 200 }}>
            {([30, 90, 0] as const).map((r) => (
              <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>
                {r === 0 ? 'همه' : `${fa(r)} روز`}
              </button>
            ))}
          </div>
        </div>
        {shown.length >= 2 ? (
          <WeightChart points={shown} />
        ) : (
          <div className="row" style={{ gap: 12 }}>
            <Mascot mood="calm" size={56} />
            <p className="muted">با دو تا وزن یا بیشتر، نمودار روند اینجا ظاهر می‌شه. هفته‌ای ۲ تا ۳ بار، صبح‌ها وزن کنید.</p>
          </div>
        )}
        <p className="muted" style={{ fontSize: 14 }}>
          وزن روزانه با آب و نمک و غذا بالا پایین می‌ره. خط «روند» این نوسان‌ها رو صاف می‌کنه تا جهت واقعی رو ببینید.
        </p>
      </section>

      {b && (
        <section className="card stack" aria-labelledby="bmi-h">
          <h2 id="bmi-h" className="card-title">
            BMI
          </h2>
          {age != null && age < 18 ? (
            <p>برای زیر ۱۸ سال، BMI باید با صدک سنی سنجیده بشه و معیار بزرگسالان کاربرد نداره.</p>
          ) : (
            <>
              <p>
                <span className="result-big" style={{ fontSize: 36 }}>
                  {fa(b, 1)}
                </span>{' '}
                <b>{BMI_LABEL[bmiClass(b)]}</b>
              </p>
              <div style={{ position: 'relative' }} aria-hidden="true">
                <div className="bmi-scale">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span className="bmi-pin" style={{ left: `${pin}%` }} />
              </div>
              <div className="row between muted" style={{ fontSize: 12, direction: 'ltr' }}>
                <span>{fa(10)}</span>
                <span>{fa(18.5, 1)}</span>
                <span>{fa(25)}</span>
                <span>{fa(30)}</span>
                <span>{fa(40)}</span>
              </div>
            </>
          )}
          {whtr && (
            <p>
              نسبت دور کمر به قد: <b>{fa(whtr, 2)}</b> {whtr < 0.5 ? '(کمتر از ۰٫۵؛ خوبه)' : '(بیشتر از ۰٫۵)'}
            </p>
          )}
          <p className="muted" style={{ fontSize: 14 }}>
            BMI فقط یه غربالگری سادهٔ قد و وزنه و چربی رو از عضله جدا نمی‌کنه. دور کمر هم کمک می‌کنه. برای تصمیم پزشکی با پزشک مشورت کنید.
          </p>
        </section>
      )}

      {list.length > 0 && (
        <section aria-labelledby="w-list">
          <p className="section-label" id="w-list">
            وزن‌های ثبت‌شده
          </p>
          <div className="list" style={{ marginTop: 8 }}>
            {list.slice(0, 30).map((w) => (
              <button key={w.date} type="button" className="list-item" onClick={() => openSheet({ kind: 'weight', date: w.date })}>
                <span className="grow">
                  <b>{fa(w.kg, 1)} کیلو</b>
                  <small>
                    {jFull(w.date)}
                    {w.waistCm ? ` · کمر ${fa(w.waistCm)} سانت` : ''}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
