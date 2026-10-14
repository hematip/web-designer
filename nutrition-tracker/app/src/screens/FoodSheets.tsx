import { useMemo, useState } from 'react';
import { Search, Zap, ChefHat, Trash2, ChevronRight } from 'lucide-react';
import { FOODS, FOOD_BY_ID, CATEGORY_LABEL, type Food } from '../data/foods.ts';
import { buildIndex, search } from '../lib/search.ts';
import { fa } from '../lib/fa.ts';
import { get, list, put, remove, restore, uid, useStore } from '../lib/store.ts';
import { defaultMeal, recentFoods } from '../lib/derive.ts';
import { MEALS, MEAL_LABEL, type FoodEntry, type Meal, type MyFood } from '../lib/types.ts';
import { Sheet, closeSheet, toast, Field, NumInput, Stepper } from '../ui/kit.tsx';
import { Mascot } from '../ui/Mascot.tsx';

const INDEX = buildIndex(FOODS);
const SUGGEST = ['chelo', 'sangak', 'barbari', 'ghormeh', 'joojeh', 'chicken-breast', 'egg-boiled', 'cheese-uf', 'yogurt-low', 'apple', 'tea', 'date'];
const QUICK_QTY = [0.5, 1, 1.5, 2, 3];

type Target =
  | { type: 'db'; food: Food; unitIdx?: number; qty?: number }
  | { type: 'my'; id: string; food: MyFood; qty?: number }
  | { type: 'quick'; prefill?: Partial<FoodEntry> }
  | { type: 'new-my' };

const round1 = (v: number) => Math.round(v * 10) / 10;

function dbUnits(food: Food): [string, number][] {
  return [...food.u, ['گرم', 1]];
}

function computeDb(food: Food, grams: number) {
  const k = grams / 100;
  return { kcal: Math.round(food.k * k), p: round1(food.p * k), c: round1(food.c * k), f: round1(food.f * k) };
}

function computeMy(food: MyFood, qty: number) {
  return { kcal: Math.round(food.k * qty), p: round1(food.p * qty), c: round1(food.c * qty), f: round1(food.f * qty) };
}

function MealChips({ meal, setMeal }: { meal: Meal; setMeal: (m: Meal) => void }) {
  return (
    <div className="chips" role="radiogroup" aria-label="وعده">
      {MEALS.map((m) => (
        <button key={m.id} type="button" role="radio" className="chip" aria-checked={meal === m.id} onClick={() => setMeal(m.id)}>
          {m.label}
        </button>
      ))}
    </div>
  );
}

function logged(entry: FoodEntry) {
  const id = uid();
  put('food', id, entry);
  toast(`نوش جون! «${entry.name}» به ${MEAL_LABEL[entry.meal]} اضافه شد.`, { label: 'برگردون', run: () => remove('food', id) });
}

// ================= Add food =================

export function AddFoodSheet({ date, meal: initialMeal }: { date: string; meal?: Meal }) {
  useStore();
  const [meal, setMeal] = useState<Meal>(initialMeal ?? defaultMeal());
  const [q, setQ] = useState('');
  const [target, setTarget] = useState<Target | null>(null);

  const myFoods = list('myfood');
  const recents = recentFoods(12);
  const results = useMemo(() => (q.trim() ? search(INDEX, q, 40) : []), [q]);
  const myMatches = useMemo(() => {
    if (!q.trim()) return myFoods;
    const idx = buildIndex(myFoods.map((m) => ({ id: m.id, n: m.data.n })));
    const ids = new Set(search(idx, q).map((x) => x.id));
    return myFoods.filter((m) => ids.has(m.id));
  }, [q, myFoods]);

  function openRecent(e: FoodEntry) {
    if (e.foodId && FOOD_BY_ID.has(e.foodId)) {
      const food = FOOD_BY_ID.get(e.foodId)!;
      const idx = dbUnits(food).findIndex(([n]) => n === e.unit);
      setTarget({ type: 'db', food, unitIdx: idx >= 0 ? idx : 0, qty: e.qty });
    } else if (e.myFoodId && get('myfood', e.myFoodId)) {
      setTarget({ type: 'my', id: e.myFoodId, food: get('myfood', e.myFoodId)!, qty: e.qty });
    } else {
      setTarget({ type: 'quick', prefill: e });
    }
  }

  const back = () => setTarget(null);
  const afterSave = () => {
    setTarget(null);
    setQ('');
  };

  if (target?.type === 'db' || target?.type === 'my') {
    return <FoodDetail key="detail" target={target} meal={meal} setMeal={setMeal} date={date} onBack={back} onSaved={afterSave} />;
  }
  if (target?.type === 'quick') {
    return <QuickAdd prefill={target.prefill} meal={meal} setMeal={setMeal} date={date} onBack={back} onSaved={afterSave} />;
  }
  if (target?.type === 'new-my') {
    return (
      <MyFoodForm
        initialName={q}
        onBack={back}
        onCreated={(id, food) => setTarget({ type: 'my', id, food })}
      />
    );
  }

  const nothing = q.trim() && results.length === 0 && myMatches.length === 0;

  return (
    <Sheet
      title="چی خوردید؟"
      footer={
        <button type="button" className="btn btn-block" onClick={closeSheet}>
          تمام
        </button>
      }
    >
      <div className="stack">
        <MealChips meal={meal} setMeal={setMeal} />
        <div className="search">
          <Search size={20} strokeWidth={2.6} aria-hidden="true" />
          <input
            data-autofocus
            className="input"
            type="search"
            placeholder="مثلاً قورمه، سنگک، سیب…"
            aria-label="جست‌وجوی غذا"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            enterKeyHint="search"
            autoComplete="off"
          />
        </div>

        {nothing && (
          <div className="card tint stack" style={{ gap: 10 }}>
            <div className="row" style={{ gap: 12 }}>
              <Mascot mood="wow" size={56} />
              <p style={{ fontWeight: 700 }}>«{q}» رو پیدا نکردم. می‌تونید کالری‌اش رو سریع وارد کنید یا خودتون بسازیدش.</p>
            </div>
          </div>
        )}

        <div className="row wrap" style={{ gap: 8 }}>
          <button type="button" className="btn btn-sm" onClick={() => setTarget({ type: 'quick', prefill: q ? { name: q } : undefined })}>
            <Zap size={18} strokeWidth={2.6} /> ثبت سریع کالری
          </button>
          <button type="button" className="btn btn-sm" onClick={() => setTarget({ type: 'new-my' })}>
            <ChefHat size={18} strokeWidth={2.6} /> ساختن غذای من
          </button>
        </div>

        {!q.trim() && recents.length > 0 && (
          <>
            <p className="section-label">اخیراً خوردید</p>
            <div className="list">
              {recents.map((e, i) => (
                <button key={i} type="button" className="list-item" onClick={() => openRecent(e)}>
                  <span className="grow">
                    <b>{e.name}</b>
                    <small>
                      {fa(e.qty, 2)} {e.unit} · {fa(e.kcal)} کالری
                    </small>
                  </span>
                  <ChevronRight size={18} style={{ transform: 'scaleX(-1)' }} aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        )}

        {myMatches.length > 0 && (
          <>
            <p className="section-label">غذاهای من</p>
            <div className="list">
              {myMatches.map((m) => (
                <button key={m.id} type="button" className="list-item" onClick={() => setTarget({ type: 'my', id: m.id, food: m.data })}>
                  <span className="grow">
                    <b>{m.data.n}</b>
                    <small>
                      هر {m.data.unit} · {fa(m.data.k)} کالری
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {(q.trim() ? results : SUGGEST.map((id) => FOOD_BY_ID.get(id)!).filter(Boolean)).length > 0 && (
          <>
            <p className="section-label">{q.trim() ? 'نتیجه‌ها' : 'پرطرفدارها'}</p>
            <div className="list">
              {(q.trim() ? results : SUGGEST.map((id) => FOOD_BY_ID.get(id)!)).map((f) => (
                <button key={f.id} type="button" className="list-item" onClick={() => setTarget({ type: 'db', food: f })}>
                  <span className="grow">
                    <b>{f.n}</b>
                    <small>
                      {fa(1)} {f.u[0][0]} ≈ {fa(Math.round((f.k * f.u[0][1]) / 100))} کالری · {CATEGORY_LABEL[f.cat]}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

// ================= Detail: pick unit + amount =================

function FoodDetail({
  target,
  meal,
  setMeal,
  date,
  onBack,
  onSaved,
  editId,
}: {
  target: Extract<Target, { type: 'db' } | { type: 'my' }>;
  meal: Meal;
  setMeal: (m: Meal) => void;
  date: string;
  onBack?: () => void;
  onSaved: () => void;
  editId?: string;
}) {
  const units = target.type === 'db' ? dbUnits(target.food) : [[target.food.unit, 0] as [string, number]];
  const [unitIdx, setUnitIdx] = useState(target.type === 'db' ? target.unitIdx ?? 0 : 0);
  const [qty, setQty] = useState(target.qty ?? (target.type === 'db' && units[target.unitIdx ?? 0][0] === 'گرم' ? 100 : 1));
  const name = target.type === 'db' ? target.food.n : target.food.n;
  const grams = target.type === 'db' ? units[unitIdx][1] * qty : null;
  const n = target.type === 'db' ? computeDb(target.food, grams!) : computeMy(target.food, qty);
  const isGrams = units[unitIdx][0] === 'گرم';

  function changeUnit(i: number) {
    if (units[i][0] === 'گرم' && !isGrams) setQty(Math.round(units[unitIdx][1] * qty));
    else if (isGrams && units[i][0] !== 'گرم') setQty(Math.max(0.5, Math.round((qty / units[i][1]) * 2) / 2));
    setUnitIdx(i);
  }

  function save() {
    const entry: FoodEntry = {
      date,
      meal,
      name,
      foodId: target.type === 'db' ? target.food.id : null,
      myFoodId: target.type === 'my' ? target.id : null,
      unit: units[unitIdx][0],
      unitGrams: target.type === 'db' ? units[unitIdx][1] : null,
      qty,
      ...n,
      kind: target.type === 'db' ? 'food' : 'my',
      at: editId ? get('food', editId)?.at ?? Date.now() : Date.now(),
    };
    if (editId) {
      put('food', editId, entry);
      toast('تغییرات ذخیره شد.');
      closeSheet();
    } else {
      logged(entry);
    }
    onSaved();
  }

  return (
    <Sheet
      title={name}
      footer={
        <div className="row" style={{ gap: 10 }}>
          {editId && <DeleteEntry id={editId} />}
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={!(qty > 0)}>
            {editId ? 'ذخیرهٔ تغییرات' : `افزودن به ${MEAL_LABEL[meal]}`}
          </button>
        </div>
      }
    >
      <div className="stack">
        {onBack && (
          <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={onBack}>
            <ChevronRight size={18} strokeWidth={2.6} /> برگشت به جست‌وجو
          </button>
        )}
        <div className="card hero" style={{ gridTemplateColumns: '1fr', gap: 4 }}>
          <p className="result-big" style={{ fontSize: 44 }}>
            {fa(n.kcal)} <span style={{ fontSize: 18 }}>کالری</span>
          </p>
          <p style={{ fontWeight: 700 }}>
            پروتئین {fa(n.p, 1)} · کربوهیدرات {fa(n.c, 1)} · چربی {fa(n.f, 1)} گرم
          </p>
          {grams != null && !isGrams && <p style={{ fontSize: 14, fontWeight: 700 }}>≈ {fa(grams)} گرم</p>}
        </div>

        <MealChips meal={meal} setMeal={setMeal} />

        {units.length > 1 && (
          <div className="field">
            <span className="label" id="unit-l">واحد</span>
            <div className="chips" role="radiogroup" aria-labelledby="unit-l">
              {units.map(([u, g], i) => (
                <button key={u} type="button" role="radio" className="chip" aria-checked={i === unitIdx} onClick={() => changeUnit(i)}>
                  {u}
                  {u !== 'گرم' && <span className="muted" style={{ fontSize: 13 }}> ({fa(g)} گ)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <span className="label">مقدار</span>
          <Stepper value={qty} onChange={setQty} step={isGrams ? 10 : 0.5} min={isGrams ? 1 : 0.25} label="مقدار" />
          {!isGrams && (
            <div className="chips" role="group" aria-label="مقدارهای آماده">
              {QUICK_QTY.map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={qty === v} onClick={() => setQty(v)}>
                  {v === 0.5 ? 'نصف' : v === 1.5 ? 'یک و نیم' : fa(v)}
                </button>
              ))}
            </div>
          )}
        </div>

        {target.type === 'db' && (
          <p className="muted" style={{ fontSize: 13 }}>
            <span className="badge">تقریبی</span> مقدارها برآورد اولیه‌اند و بسته به دستور پخت و اندازهٔ ظرف فرق می‌کنن. اگه وزن دقیق رو می‌دونید، واحد «گرم» رو بزنید.
          </p>
        )}
      </div>
    </Sheet>
  );
}

function DeleteEntry({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="btn btn-danger"
      aria-label="حذف"
      onClick={() => {
        const old = get('food', id);
        remove('food', id);
        closeSheet();
        if (old) toast(`«${old.name}» حذف شد.`, { label: 'برگردون', run: () => restore('food', id, old) });
      }}
    >
      <Trash2 size={20} strokeWidth={2.6} />
    </button>
  );
}

// ================= Quick add =================

function QuickAdd({
  prefill,
  meal,
  setMeal,
  date,
  onBack,
  onSaved,
  editId,
}: {
  prefill?: Partial<FoodEntry>;
  meal: Meal;
  setMeal: (m: Meal) => void;
  date: string;
  onBack?: () => void;
  onSaved: () => void;
  editId?: string;
}) {
  const [name, setName] = useState(prefill?.name ?? '');
  const [kcal, setKcal] = useState<number | null>(prefill?.kcal ?? null);
  const [p, setP] = useState<number | null>(prefill?.p ?? null);
  const [c, setC] = useState<number | null>(prefill?.c ?? null);
  const [f, setF] = useState<number | null>(prefill?.f ?? null);
  const [touched, setTouched] = useState(false);
  const kcalErr = kcal == null || kcal <= 0 ? 'کالری رو بنویسید؛ مثلاً ۲۵۰' : kcal > 5000 ? 'این عدد خیلی بزرگه؛ کمتر از ۵۰۰۰ بنویسید' : null;

  function save() {
    setTouched(true);
    if (kcalErr) return;
    const entry: FoodEntry = {
      date,
      meal,
      name: name.trim() || 'ثبت سریع',
      foodId: null,
      myFoodId: null,
      unit: 'پرس',
      unitGrams: null,
      qty: 1,
      kcal: Math.round(kcal!),
      p: p ?? 0,
      c: c ?? 0,
      f: f ?? 0,
      kind: 'quick',
      at: editId ? get('food', editId)?.at ?? Date.now() : Date.now(),
    };
    if (editId) {
      put('food', editId, entry);
      toast('تغییرات ذخیره شد.');
      closeSheet();
    } else logged(entry);
    onSaved();
  }

  return (
    <Sheet
      title="ثبت سریع"
      footer={
        <div className="row" style={{ gap: 10 }}>
          {editId && <DeleteEntry id={editId} />}
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={save}>
            {editId ? 'ذخیرهٔ تغییرات' : `افزودن به ${MEAL_LABEL[meal]}`}
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
        <p className="muted">وقتی کالری رو از روی برچسب یا منو می‌دونید، یا فقط یه تخمین کلی دارید.</p>
        <MealChips meal={meal} setMeal={setMeal} />
        <Field label="اسم (اختیاری)">{(pr) => <input {...pr} className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً کیک تولد" />}</Field>
        <Field label="کالری" error={touched ? kcalErr : null}>
          {(pr) => <NumInput {...pr} value={kcal} onChange={setKcal} suffix="کالری" />}
        </Field>
        <details className="explain">
          <summary>پروتئین، کربوهیدرات و چربی (اختیاری)</summary>
          <div className="stack" style={{ marginTop: 10 }}>
            <Field label="پروتئین">{(pr) => <NumInput {...pr} value={p} onChange={setP} suffix="گرم" />}</Field>
            <Field label="کربوهیدرات">{(pr) => <NumInput {...pr} value={c} onChange={setC} suffix="گرم" />}</Field>
            <Field label="چربی">{(pr) => <NumInput {...pr} value={f} onChange={setF} suffix="گرم" />}</Field>
          </div>
        </details>
      </div>
    </Sheet>
  );
}

// ================= My food =================

function MyFoodForm({ initialName, onBack, onCreated }: { initialName: string; onBack: () => void; onCreated: (id: string, f: MyFood) => void }) {
  const [n, setN] = useState(initialName);
  const [unit, setUnit] = useState('پرس');
  const [k, setK] = useState<number | null>(null);
  const [p, setP] = useState<number | null>(null);
  const [c, setC] = useState<number | null>(null);
  const [f, setF] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const errs = {
    n: n.trim() ? null : 'اسم غذا رو بنویسید',
    unit: unit.trim() ? null : 'واحد رو بنویسید؛ مثلاً پرس یا عدد',
    k: k == null || k <= 0 ? 'کالری هر واحد رو بنویسید' : null,
  };
  function save() {
    setTouched(true);
    if (errs.n || errs.unit || errs.k) return;
    const food: MyFood = { n: n.trim(), unit: unit.trim(), k: k!, p: p ?? 0, c: c ?? 0, f: f ?? 0 };
    const id = uid();
    put('myfood', id, food);
    toast(`«${food.n}» به غذاهای شما اضافه شد.`);
    onCreated(id, food);
  }
  return (
    <Sheet
      title="غذای من"
      footer={
        <button type="button" className="btn btn-primary btn-block" onClick={save}>
          ذخیره و ادامه
        </button>
      }
    >
      <div className="stack">
        <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={onBack}>
          <ChevronRight size={18} strokeWidth={2.6} /> برگشت
        </button>
        <p className="muted">برای غذای خونگی یا خوراکی بسته‌بندی که مرتب می‌خورید. عددها رو از برچسب یا تخمین خودتون بنویسید.</p>
        <Field label="اسم غذا" error={touched ? errs.n : null}>{(pr) => <input {...pr} className="input" value={n} onChange={(e) => setN(e.target.value)} />}</Field>
        <Field label="واحد" error={touched ? errs.unit : null} hint="مثلاً پرس، عدد، بسته، لیوان">
          {(pr) => <input {...pr} className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />}
        </Field>
        <Field label="کالری هر واحد" error={touched ? errs.k : null}>{(pr) => <NumInput {...pr} value={k} onChange={setK} suffix="کالری" />}</Field>
        <Field label="پروتئین هر واحد (اختیاری)">{(pr) => <NumInput {...pr} value={p} onChange={setP} suffix="گرم" />}</Field>
        <Field label="کربوهیدرات هر واحد (اختیاری)">{(pr) => <NumInput {...pr} value={c} onChange={setC} suffix="گرم" />}</Field>
        <Field label="چربی هر واحد (اختیاری)">{(pr) => <NumInput {...pr} value={f} onChange={setF} suffix="گرم" />}</Field>
      </div>
    </Sheet>
  );
}

// ================= Edit an existing entry =================

export function EditFoodSheet({ id }: { id: string }) {
  useStore();
  const e = get('food', id);
  const [meal, setMeal] = useState<Meal>(e?.meal ?? 'lunch');
  if (!e) {
    return (
      <Sheet title="پیدا نشد">
        <p>این مورد دیگه وجود نداره.</p>
      </Sheet>
    );
  }
  const noop = () => {};
  if (e.foodId && FOOD_BY_ID.has(e.foodId)) {
    const food = FOOD_BY_ID.get(e.foodId)!;
    const idx = dbUnits(food).findIndex(([u]) => u === e.unit);
    return <FoodDetail target={{ type: 'db', food, unitIdx: idx >= 0 ? idx : 0, qty: e.qty }} meal={meal} setMeal={setMeal} date={e.date} onSaved={noop} editId={id} />;
  }
  if (e.myFoodId && get('myfood', e.myFoodId)) {
    return <FoodDetail target={{ type: 'my', id: e.myFoodId, food: get('myfood', e.myFoodId)!, qty: e.qty }} meal={meal} setMeal={setMeal} date={e.date} onSaved={noop} editId={id} />;
  }
  return <QuickAdd prefill={e} meal={meal} setMeal={setMeal} date={e.date} onSaved={noop} editId={id} />;
}
