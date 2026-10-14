import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useStore } from '../lib/store.ts';
import { dayTotals, planFor, plans, range, steps, today, weightTrend } from '../lib/derive.ts';
import { addDays, fa, faSigned, jDayMonth, weekStart } from '../lib/fa.ts';
import { KcalColumns } from '../ui/charts.tsx';
import { exportCsv } from '../lib/export.ts';
import { Mascot } from '../ui/Mascot.tsx';

export function Reports() {
  useStore();
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const [offset, setOffset] = useState(0);
  const t = today();
  const len = mode === 'week' ? 7 : 30;
  const start = mode === 'week' ? addDays(weekStart(t), -7 * offset) : addDays(t, -29 - 30 * offset);
  const days = range(start, len);
  const startedOn = plans()[0]?.from ?? t;
  // Days before the first plan (account start) or after today are not part of the report.
  const rows = days
    .filter((d) => d >= startedOn)
    .map((d) => {
      const tot = dayTotals(d);
      return { date: d, ...tot, future: d > t, plan: planFor(d), steps: steps(d) };
    });
  const loggedRows = rows.filter((r) => r.logged);
  const avg = (f: (r: (typeof rows)[number]) => number) => (loggedRows.length ? loggedRows.reduce((a, r) => a + f(r), 0) / loggedRows.length : 0);
  const avgKcal = avg((r) => r.kcal);
  const avgBudget = avg((r) => r.budget);
  const avgProtein = avg((r) => r.p);
  const avgProteinTarget = avg((r) => r.plan?.proteinG ?? 0);
  const activityTotal = rows.reduce((a, r) => a + r.activity, 0);
  const pastDays = rows.filter((r) => !r.future).length;
  const tr = weightTrend();
  const end = days[days.length - 1];
  const inRange = tr.filter((p) => p.date >= start && p.date <= end);
  const wDelta = inRange.length >= 2 ? inRange[inRange.length - 1].trend - inRange[0].trend : null;
  const macroTotal = avg((r) => r.p * 4 + r.c * 4 + r.f * 9);
  const split = macroTotal
    ? { p: (avg((r) => r.p) * 4) / macroTotal, c: (avg((r) => r.c) * 4) / macroTotal, f: (avg((r) => r.f) * 9) / macroTotal }
    : null;

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">گزارش</h1>
        <button type="button" className="btn btn-sm" onClick={exportCsv}>
          <Download size={18} strokeWidth={2.6} /> خروجی CSV
        </button>
      </header>

      <div className="seg" role="group" aria-label="بازه">
        <button type="button" aria-pressed={mode === 'week'} onClick={() => { setMode('week'); setOffset(0); }}>
          هفتگی
        </button>
        <button type="button" aria-pressed={mode === 'month'} onClick={() => { setMode('month'); setOffset(0); }}>
          ۳۰ روزه
        </button>
      </div>

      <nav className="date-nav" aria-label="جابه‌جایی بازه">
        <button type="button" className="icon-btn" aria-label="بازهٔ قبل" disabled={start <= startedOn} onClick={() => setOffset(offset + 1)}>
          <ChevronRight size={22} strokeWidth={2.6} />
        </button>
        <p className="label" style={{ flex: 1 }}>
          {jDayMonth(start)} تا {jDayMonth(end)}
        </p>
        <button type="button" className="icon-btn" aria-label="بازهٔ بعد" disabled={offset === 0} onClick={() => setOffset(offset - 1)}>
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>
      </nav>

      {loggedRows.length === 0 ? (
        <div className="card row" style={{ gap: 12 }}>
          <Mascot mood="sleepy" size={64} />
          <p>توی این بازه چیزی ثبت نشده. از امروز شروع کنیم؟</p>
        </div>
      ) : (
        <>
          <section className="stat-grid" aria-label="خلاصهٔ بازه">
            <div className="stat">
              <p className="label">میانگین کالری روزانه</p>
              <p className="value">{fa(avgKcal)}</p>
              <p className="sub">بودجهٔ میانگین {fa(avgBudget)}</p>
            </div>
            <div className="stat">
              <p className="label">روزهای ثبت‌شده</p>
              <p className="value">
                {fa(loggedRows.length)} <span style={{ fontSize: 16 }}>از {fa(pastDays)}</span>
              </p>
              <p className="sub">هر روز ثبت، یه قدم جلوتر</p>
            </div>
            <div className="stat">
              <p className="label">میانگین پروتئین</p>
              <p className="value">{fa(avgProtein)} <span style={{ fontSize: 16 }}>گرم</span></p>
              <p className="sub">هدف {fa(avgProteinTarget)} گرم</p>
            </div>
            <div className="stat">
              <p className="label">تغییر روند وزن</p>
              <p className="value">
                {wDelta == null ? '—' : faSigned(wDelta)}
              </p>
              <p className="sub">{wDelta == null ? 'وزن کافی ثبت نشده' : 'کیلو در این بازه'}</p>
            </div>
            <div className="stat" style={{ gridColumn: '1 / -1' }}>
              <p className="label">کالری فعالیت در کل بازه</p>
              <p className="value">{fa(activityTotal)}</p>
            </div>
          </section>

          <section className="card stack" aria-labelledby="kc-h">
            <h2 id="kc-h" className="card-title">
              کالری هر روز
            </h2>
            <KcalColumns days={rows.filter((r) => !r.future).map((r) => ({ date: r.date, kcal: r.kcal, budget: r.budget, logged: r.logged }))} />
          </section>

          {split && (
            <section className="card stack" aria-labelledby="split-h">
              <h2 id="split-h" className="card-title">
                سهم درشت‌مغذی‌ها از کالری
              </h2>
              <div className="row" style={{ height: 18, gap: 2, borderRadius: 999, overflow: 'hidden' }} aria-hidden="true">
                <span style={{ flex: split.p, background: 'var(--protein)', height: '100%', borderRadius: '0 999px 999px 0' }} />
                <span style={{ flex: split.c, background: 'var(--carb)', height: '100%' }} />
                <span style={{ flex: split.f, background: 'var(--fat)', height: '100%', borderRadius: '999px 0 0 999px' }} />
              </div>
              <div className="row wrap" style={{ gap: 16, fontSize: 14 }}>
                <span className="row" style={{ gap: 6 }}><span className="dot" style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--protein)' }} /> پروتئین {fa(split.p * 100)}٪</span>
                <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--carb)' }} /> کربوهیدرات {fa(split.c * 100)}٪</span>
                <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--fat)' }} /> چربی {fa(split.f * 100)}٪</span>
              </div>
            </section>
          )}

          <section className="card" aria-labelledby="tbl-h">
            <h2 id="tbl-h" className="card-title" style={{ marginBottom: 8 }}>
              روز به روز
            </h2>
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">روز</th>
                  <th scope="col">کالری</th>
                  <th scope="col">بودجه</th>
                  <th scope="col">پروتئین</th>
                  <th scope="col">گام</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter((r) => !r.future)
                  .slice()
                  .reverse()
                  .map((r) => (
                    <tr key={r.date}>
                      <th scope="row" style={{ fontWeight: 700 }}>{jDayMonth(r.date)}</th>
                      <td className="n">{r.logged ? fa(r.kcal) : '—'}</td>
                      <td className="n">{fa(r.budget)}</td>
                      <td className="n">{r.logged ? fa(r.p) : '—'}</td>
                      <td className="n">{r.steps != null ? fa(r.steps) : '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
