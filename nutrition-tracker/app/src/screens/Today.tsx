import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Footprints, Flame, Download } from 'lucide-react';
import { useStore, put, getUser } from '../lib/store.ts';
import { actEntries, dayTotals, mealOf, planFor, settings, steps, today, water } from '../lib/derive.ts';
import { addDays, fa, jLong, relativeDayLabel } from '../lib/fa.ts';
import { MEALS } from '../lib/types.ts';
import { openSheet } from '../lib/nav.ts';
import { BudgetRing, MacroMeter } from '../ui/charts.tsx';
import { Mascot, type Mood } from '../ui/Mascot.tsx';
import { SyncPill } from '../ui/SyncPill.tsx';
import { isStandalone } from '../lib/install.ts';

function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return arr[Math.abs(h) % arr.length];
}

function mascotLine(date: string, eaten: number, budget: number, logged: boolean, isToday: boolean): { mood: Mood; text: string } {
  const hour = new Date().getHours();
  if (!logged) {
    if (isToday && hour < 10) return { mood: 'sleepy', text: pick(['صبح بخیر! صبحونه چی داریم؟', 'هنوز خوابم میاد… ولی شما بگید صبحونه چی خوردید!'], date) };
    return { mood: 'wow', text: pick(['بشقابم خالیه! امروز چی خوردید؟', 'هنوز چیزی ثبت نشده. از اولین لقمه شروع کنیم؟'], date) };
  }
  const ratio = budget ? eaten / budget : 0;
  if (ratio > 1.05)
    return { mood: 'calm', text: pick(['یه کم از بودجه زدیم بالا. فدای سرتون، روند هفته مهم‌تره.', 'امروز یه کم پرخوری شد؛ پیش میاد! فردا یه روز تازه‌ست.'], date) };
  if (ratio > 0.85) return { mood: 'wink', text: pick(['تقریباً رسیدیم به بودجه. آفرین به این حساب‌کتاب!', 'بودجه داره پر می‌شه؛ یه میان‌وعدهٔ سبک کافیه.'], date) };
  return { mood: 'happy', text: pick(['نوش جون! همین‌طوری ثبت کنید، عالیه.', 'دارید خوب پیش می‌رید. یادتون نره آب هم بخورید!', 'هر لقمه که ثبت می‌شه، یه نخودچی خوشحال می‌شه!'], date + eaten) };
}

export function Today() {
  useStore();
  const [date, setDate] = useState(today());
  const t = today();
  const isToday = date === t;
  const plan = planFor(date);
  const tot = dayTotals(date);
  const s = settings();
  const acts = actEntries(date);
  const glasses = water(date);
  const stepCount = steps(date);
  const line = mascotLine(date, tot.kcal, tot.budget, tot.logged, isToday);
  const user = getUser();
  const showInstall = !isStandalone() && !s.installHidden;

  return (
    <div className="stack">
      <header className="page-head">
        <div>
          <p className="muted" style={{ fontWeight: 700, fontSize: 14 }}>
            سلام {user?.displayName}!
          </p>
          <h1 className="page-title">{relativeDayLabel(date, t)}</h1>
        </div>
        <SyncPill />
      </header>

      <nav className="date-nav" aria-label="روز">
        <button type="button" className="icon-btn" aria-label="روز قبل" onClick={() => setDate(addDays(date, -1))}>
          <ChevronRight size={22} strokeWidth={2.6} />
        </button>
        <p className="label grow" style={{ flex: 1 }}>
          {jLong(date)}
        </p>
        <button type="button" className="icon-btn" aria-label="روز بعد" onClick={() => setDate(addDays(date, 1))} disabled={date >= t}>
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>
        {!isToday && (
          <button type="button" className="btn btn-sm" onClick={() => setDate(t)}>
            امروز
          </button>
        )}
      </nav>

      {showInstall && (
        <button type="button" className="card tint row" style={{ textAlign: 'start', gap: 12 }} onClick={() => openSheet({ kind: 'install' })}>
          <Download size={24} strokeWidth={2.6} aria-hidden="true" />
          <span style={{ flex: 1 }}>
            <b style={{ display: 'block' }}>نخودچی رو روی صفحهٔ گوشی بذارید</b>
            <small className="muted">مثل یه اپ واقعی باز می‌شه، حتی بدون اینترنت.</small>
          </span>
        </button>
      )}

      <section className="card hero" aria-label="خلاصهٔ امروز">
        <div className="ring-wrap">
          <BudgetRing eaten={tot.kcal} budget={tot.budget} />
          <div className="ring-center">
            {tot.remaining >= 0 ? (
              <>
                <span className="big">{fa(tot.remaining)}</span>
                <small>کالری مونده</small>
              </>
            ) : (
              <>
                <span className="big">{fa(-tot.remaining)}</span>
                <small>بیشتر از بودجه</small>
              </>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="row">
            <span>بودجه</span>
            <b>{fa(tot.base)}</b>
          </div>
          {tot.activity > 0 && (
            <div className="row">
              <span>{s.addActivity ? '+ فعالیت' : 'فعالیت (جدا)'}</span>
              <b>{fa(tot.activity)}</b>
            </div>
          )}
          <div className="row">
            <span>خورده‌شده</span>
            <b>{fa(tot.kcal)}</b>
          </div>
          <div className="row" style={{ alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
            <Mascot mood={line.mood} size={46} popKey={tot.entries.length} />
            <small style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.5, flex: 1 }}>{line.text}</small>
          </div>
        </div>
      </section>

      {plan && (
        <section className="card" aria-label="درشت‌مغذی‌ها">
          <div className="macros">
            <MacroMeter name="پروتئین" value={tot.p} target={plan.proteinG} color="var(--protein)" track="var(--protein-t)" main />
            <MacroMeter name="کربوهیدرات" value={tot.c} target={plan.carbG} color="var(--carb)" track="var(--carb-t)" />
            <MacroMeter name="چربی" value={tot.f} target={plan.fatG} color="var(--fat)" track="var(--fat-t)" />
          </div>
        </section>
      )}

      <div className="today-grid stack">
        {MEALS.map((m) => {
          const items = mealOf(date, m.id);
          const kcal = items.reduce((a, x) => a + x.e.kcal, 0);
          return (
            <section key={m.id} className="card" aria-labelledby={`meal-${m.id}`}>
              <div className="meal-head">
                <h3 id={`meal-${m.id}`}>
                  {m.label} {kcal > 0 && <span className="muted" style={{ fontWeight: 700, fontSize: 14 }}>· {fa(kcal)} کالری</span>}
                </h3>
                <button type="button" className="btn btn-sm btn-chick" onClick={() => openSheet({ kind: 'add-food', meal: m.id, date })} aria-label={`افزودن به ${m.label}`}>
                  <Plus size={18} strokeWidth={3} /> افزودن
                </button>
              </div>
              {items.length === 0 ? (
                <p className="empty-line">هنوز چیزی نیست.</p>
              ) : (
                <div>
                  {items.map(({ id, e }) => (
                    <button key={id} type="button" className="entry" onClick={() => openSheet({ kind: 'edit-food', id })}>
                      <span className="what">
                        <b>{e.name}</b>
                        <small>
                          {fa(e.qty, 2)} {e.unit}
                          {e.kind === 'quick' ? ' · ثبت سریع' : ''}
                        </small>
                      </span>
                      <span className="kcal">{fa(e.kcal)}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <section className="card" aria-labelledby="act-h">
          <div className="meal-head">
            <h3 id="act-h">
              فعالیت {tot.activity > 0 && <span className="muted" style={{ fontWeight: 700, fontSize: 14 }}>· {fa(tot.activity)} کالری</span>}
            </h3>
            <button type="button" className="btn btn-sm btn-chick" onClick={() => openSheet({ kind: 'add-activity', date })}>
              <Plus size={18} strokeWidth={3} /> افزودن
            </button>
          </div>
          {acts.length === 0 ? (
            <p className="empty-line">پیاده‌روی، کوه، باشگاه… هرچی بود ثبت کنید.</p>
          ) : (
            acts.map(({ id, a }) => (
              <button key={id} type="button" className="entry" onClick={() => openSheet({ kind: 'edit-activity', id })}>
                <Flame size={20} strokeWidth={2.4} aria-hidden="true" />
                <span className="what">
                  <b>{a.name}</b>
                  <small>{fa(a.minutes)} دقیقه</small>
                </span>
                <span className="kcal">{fa(a.kcal)}</span>
              </button>
            ))
          )}
          <button type="button" className="entry" onClick={() => openSheet({ kind: 'steps', date })}>
            <Footprints size={20} strokeWidth={2.4} aria-hidden="true" />
            <span className="what">
              <b>گام‌ها</b>
              <small>{stepCount == null ? 'از ساعت یا گوشی‌تون وارد کنید' : `هدف ${fa(s.stepsGoal)} گام`}</small>
            </span>
            <span className="kcal">{stepCount == null ? 'ثبت' : fa(stepCount)}</span>
          </button>
        </section>

        <section className="card" aria-labelledby="water-h">
          <div className="meal-head">
            <h3 id="water-h">آب</h3>
            <span className="muted" style={{ fontWeight: 700, fontSize: 14 }}>
              {fa(glasses)} از {fa(s.waterGoal)} لیوان
            </span>
          </div>
          <div className="glasses" role="group" aria-label="لیوان‌های آب">
            {Array.from({ length: Math.max(s.waterGoal, glasses + 1) }, (_, i) => {
              const full = i < glasses;
              return (
                <button
                  key={i}
                  type="button"
                  className="glass"
                  aria-label={full ? `برداشتن لیوان ${fa(i + 1)}` : `لیوان ${fa(i + 1)}`}
                  aria-pressed={full}
                  onClick={() => put('water', date, { date, glasses: full && i === glasses - 1 ? i : full ? i + 1 : i + 1 })}
                >
                  <Glass full={full} />
                </button>
              );
            })}
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            هر لیوان حدود ۲۵۰ میلی‌لیتر. برای برداشتن، آخرین لیوان پر رو بزنید.
          </p>
        </section>
      </div>
    </div>
  );
}

function Glass({ full }: { full: boolean }) {
  return (
    <svg width="34" height="44" viewBox="0 0 36 44" aria-hidden="true">
      <path d="M5 4 H31 L28 40 Q27.6 42 25.6 42 H10.4 Q8.4 42 8 40 Z" fill={full ? '#4aa8f0' : '#fff'} stroke="#2a1f33" strokeWidth="2.5" strokeLinejoin="round" />
      {full && <path d="M9 14 Q18 10 27 14" stroke="#e1f1ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
