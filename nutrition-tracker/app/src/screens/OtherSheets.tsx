import { useMemo, useState } from 'react';
import { Search, Trash2, ChevronRight, Utensils, Dumbbell, Scale, GlassWater } from 'lucide-react';
import { ACTIVITIES, ACTIVITY_BY_ID, type ActivityDef } from '../data/activities.ts';
import { activityKcal } from '../lib/calc.ts';
import { buildIndex, search } from '../lib/search.ts';
import { fa, jLong } from '../lib/fa.ts';
import { get, put, remove, restore, uid, useStore } from '../lib/store.ts';
import { currentWeight, settings, today, water } from '../lib/derive.ts';
import type { ActEntry } from '../lib/types.ts';
import { openSheet } from '../lib/nav.ts';
import { Sheet, closeSheet, toast, Field, NumInput, Stepper } from '../ui/kit.tsx';

const ACT_INDEX = buildIndex(ACTIVITIES);
const MINUTES = [10, 15, 20, 30, 45, 60, 90];

// ================= Add menu (center + button) =================

export function AddMenuSheet() {
  const d = today();
  const items = [
    { icon: <Utensils size={26} strokeWidth={2.4} />, title: 'غذا', sub: 'وعده یا میان‌وعده', run: () => openSheet({ kind: 'add-food', date: d }) },
    { icon: <Dumbbell size={26} strokeWidth={2.4} />, title: 'فعالیت', sub: 'پیاده‌روی، ورزش، کار خونه', run: () => openSheet({ kind: 'add-activity', date: d }) },
    { icon: <Scale size={26} strokeWidth={2.4} />, title: 'وزن', sub: 'وزن امروز', run: () => openSheet({ kind: 'weight', date: d }) },
    {
      icon: <GlassWater size={26} strokeWidth={2.4} />,
      title: 'یه لیوان آب',
      sub: 'قلپ قلپ!',
      run: () => {
        const g = water(d) + 1;
        put('water', d, { date: d, glasses: g });
        closeSheet();
        toast(`قلپ قلپ! ${fa(g)} لیوان امروز.`);
      },
    },
  ];
  return (
    <Sheet title="ثبت چی؟">
      <div className="choices">
        {items.map((it, i) => (
          <button key={it.title} type="button" className="choice" onClick={it.run} data-autofocus={i === 0 ? true : undefined}>
            <span aria-hidden="true">{it.icon}</span>
            <span>
              <strong>{it.title}</strong>
              <small>{it.sub}</small>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

// ================= Activity =================

export function ActivitySheet({ date, editId }: { date?: string; editId?: string }) {
  useStore();
  const existing = editId ? get('act', editId) : null;
  const [q, setQ] = useState('');
  const [def, setDef] = useState<ActivityDef | 'custom' | null>(
    existing ? (existing.actId ? ACTIVITY_BY_ID.get(existing.actId) ?? 'custom' : 'custom') : null,
  );
  const results = useMemo(() => (q.trim() ? search(ACT_INDEX, q) : ACTIVITIES), [q]);

  if (def) return <ActivityDetail def={def} date={existing?.date ?? date ?? today()} existing={existing} editId={editId} onBack={editId ? undefined : () => setDef(null)} />;

  return (
    <Sheet title="چه فعالیتی؟">
      <div className="stack">
        <div className="search">
          <Search size={20} strokeWidth={2.6} aria-hidden="true" />
          <input data-autofocus className="input" type="search" placeholder="مثلاً پیاده‌روی، کوه، باشگاه…" aria-label="جست‌وجوی فعالیت" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="list">
          {results.map((a) => (
            <button key={a.id} type="button" className="list-item" onClick={() => setDef(a)}>
              <span className="grow">
                <b>{a.n}</b>
              </span>
            </button>
          ))}
          <button type="button" className="list-item" onClick={() => setDef('custom')}>
            <span className="grow">
              <b>فعالیت دیگه (کالری رو خودم می‌دونم)</b>
              <small>مثلاً عدد ساعت یا دستگاه باشگاه</small>
            </span>
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function ActivityDetail({
  def,
  date,
  existing,
  editId,
  onBack,
}: {
  def: ActivityDef | 'custom';
  date: string;
  existing: ActEntry | null;
  editId?: string;
  onBack?: () => void;
}) {
  const [minutes, setMinutes] = useState<number>(existing?.minutes ?? 30);
  const [name, setName] = useState(existing && def === 'custom' ? existing.name : '');
  const [manualKcal, setManualKcal] = useState<number | null>(existing && def === 'custom' ? existing.kcal : null);
  const [touched, setTouched] = useState(false);
  const w = currentWeight() ?? 70;
  const kcal = def === 'custom' ? manualKcal ?? 0 : activityKcal(def.met, w, minutes);
  const err = def === 'custom' && (manualKcal == null || manualKcal <= 0 || manualKcal > 4000) ? 'کالری رو بنویسید (بین ۱ تا ۴۰۰۰)' : null;

  function save() {
    setTouched(true);
    if (err || !(minutes > 0)) return;
    const entry: ActEntry = {
      date,
      actId: def === 'custom' ? null : def.id,
      name: def === 'custom' ? name.trim() || 'فعالیت' : def.n,
      met: def === 'custom' ? 0 : def.met,
      minutes,
      kcal: Math.round(kcal),
      at: existing?.at ?? Date.now(),
    };
    const id = editId ?? uid();
    put('act', id, entry);
    closeSheet();
    toast(editId ? 'تغییرات ذخیره شد.' : `آفرین! ${entry.name} ثبت شد.`, editId ? undefined : { label: 'برگردون', run: () => remove('act', id) });
  }

  return (
    <Sheet
      title={def === 'custom' ? 'فعالیت دیگه' : def.n}
      footer={
        <div className="row" style={{ gap: 10 }}>
          {editId && (
            <button
              type="button"
              className="btn btn-danger"
              aria-label="حذف"
              onClick={() => {
                const old = get('act', editId);
                remove('act', editId);
                closeSheet();
                if (old) toast('فعالیت حذف شد.', { label: 'برگردون', run: () => restore('act', editId, old) });
              }}
            >
              <Trash2 size={20} strokeWidth={2.6} />
            </button>
          )}
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={save}>
            {editId ? 'ذخیرهٔ تغییرات' : 'ثبت فعالیت'}
          </button>
        </div>
      }
    >
      <div className="stack">
        {onBack && (
          <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={onBack}>
            <ChevronRight size={18} strokeWidth={2.6} /> برگشت
          </button>
        )}
        {def === 'custom' && (
          <Field label="اسم فعالیت (اختیاری)">{(p) => <input {...p} className="input" value={name} onChange={(e) => setName(e.target.value)} />}</Field>
        )}
        <div className="field">
          <span className="label">مدت (دقیقه)</span>
          <Stepper value={minutes} onChange={(v) => setMinutes(Math.round(v))} step={5} min={1} label="مدت به دقیقه" />
          <div className="chips" role="group" aria-label="مدت‌های آماده">
            {MINUTES.map((m) => (
              <button key={m} type="button" className="chip" aria-pressed={minutes === m} onClick={() => setMinutes(m)}>
                {fa(m)}
              </button>
            ))}
          </div>
        </div>
        {def === 'custom' ? (
          <Field label="کالری سوزانده‌شده" error={touched ? err : null} hint="فقط کالری فعالیت، نه کل روز">
            {(p) => <NumInput {...p} value={manualKcal} onChange={setManualKcal} suffix="کالری" />}
          </Field>
        ) : (
          <div className="card tint">
            <p className="result-big" style={{ fontSize: 40 }}>
              ≈ {fa(kcal)} <span style={{ fontSize: 18 }}>کالری</span>
            </p>
            <p className="muted" style={{ fontSize: 14 }}>
              <span className="badge">تقریبی</span> با وزن {fa(w, 1)} کیلو و شدت متوسط این فعالیت (MET {fa(def.met, 1)})، فقط انرژی اضافه بر حالت استراحت.
            </p>
          </div>
        )}
        <p className="muted" style={{ fontSize: 14 }}>
          {settings().addActivity ? 'این کالری به بودجهٔ همون روز اضافه می‌شه. (در «من» می‌تونید خاموشش کنید.)' : 'این کالری جدا نمایش داده می‌شه و به بودجه اضافه نمی‌شه.'}
        </p>
      </div>
    </Sheet>
  );
}

// ================= Weight =================

export function WeightSheet({ date }: { date: string }) {
  const existing = get('weight', date);
  const [kg, setKg] = useState<number | null>(existing?.kg ?? currentWeight());
  const [waist, setWaist] = useState<number | null>(existing?.waistCm ?? null);
  const [touched, setTouched] = useState(false);
  const err = kg == null ? 'وزن رو بنویسید' : kg < 30 || kg > 300 ? 'وزن باید بین ۳۰ تا ۳۰۰ کیلو باشه' : null;
  const waistErr = waist != null && (waist < 40 || waist > 200) ? 'دور کمر باید بین ۴۰ تا ۲۰۰ سانتی‌متر باشه' : null;
  function save() {
    setTouched(true);
    if (err || waistErr) return;
    put('weight', date, { date, kg: kg!, waistCm: waist });
    closeSheet();
    toast('ثبت شد. یادتون باشه روند مهمه، نه یه روز.');
  }
  return (
    <Sheet
      title="وزن"
      footer={
        <div className="row" style={{ gap: 10 }}>
          {existing && (
            <button
              type="button"
              className="btn btn-danger"
              aria-label="حذف"
              onClick={() => {
                remove('weight', date);
                closeSheet();
                toast('وزن این روز حذف شد.', { label: 'برگردون', run: () => restore('weight', date, existing) });
              }}
            >
              <Trash2 size={20} strokeWidth={2.6} />
            </button>
          )}
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={save}>
            ذخیره
          </button>
        </div>
      }
    >
      <div className="stack">
        <p className="muted">{jLong(date)}. بهترین زمان: صبح، بعد از دستشویی و قبل از صبحونه.</p>
        <Field label="وزن" error={touched ? err : null}>
          {(p) => <NumInput {...p} value={kg} onChange={setKg} suffix="کیلو" autoFocus />}
        </Field>
        <Field label="دور کمر (اختیاری)" error={touched ? waistErr : null} hint="بالای ناف، بعد از یه بازدم معمولی">
          {(p) => <NumInput {...p} value={waist} onChange={setWaist} suffix="سانتی‌متر" />}
        </Field>
      </div>
    </Sheet>
  );
}

// ================= Steps =================

export function StepsSheet({ date }: { date: string }) {
  const existing = get('steps', date);
  const [n, setN] = useState<number | null>(existing?.steps ?? null);
  const [touched, setTouched] = useState(false);
  const err = n == null || n < 0 || n > 100000 ? 'تعداد گام رو بنویسید (۰ تا ۱۰۰٬۰۰۰)' : null;
  return (
    <Sheet
      title="گام‌ها"
      footer={
        <div className="row" style={{ gap: 10 }}>
          {existing && (
            <button
              type="button"
              className="btn btn-danger"
              aria-label="حذف"
              onClick={() => {
                remove('steps', date);
                closeSheet();
              }}
            >
              <Trash2 size={20} strokeWidth={2.6} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => {
              setTouched(true);
              if (err) return;
              put('steps', date, { date, steps: Math.round(n!) });
              closeSheet();
              toast(n! >= settings().stepsGoal ? 'به هدف گام رسیدید! هورا!' : 'گام‌ها ثبت شد.');
            }}
          >
            ذخیره
          </button>
        </div>
      }
    >
      <div className="stack">
        <p className="muted">{jLong(date)}. عدد رو از گوشی (Health یا Google Fit) یا ساعتتون ببینید و اینجا بنویسید.</p>
        <Field label="تعداد گام" error={touched ? err : null}>
          {(p) => <NumInput {...p} value={n} onChange={setN} suffix="گام" autoFocus />}
        </Field>
        <p className="muted" style={{ fontSize: 14 }}>
          گام‌ها فقط برای پیگیری‌اند و به کالری اضافه نمی‌شن، تا با ورزش‌های ثبت‌شده دوبار حساب نشن.
        </p>
      </div>
    </Sheet>
  );
}
