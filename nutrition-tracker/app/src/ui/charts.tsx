import { useState } from 'react';
import { fa, jDayMonth, jWeekdayShort, jDayNum } from '../lib/fa.ts';

// ---------- Budget ring (stat figure, not a chart) ----------

export function BudgetRing({ eaten, budget, size = 148 }: { eaten: number; budget: number; size?: number }) {
  const sw = 16;
  const r = (size - sw) / 2 - 3;
  const c = 2 * Math.PI * r;
  const frac = budget > 0 ? Math.min(eaten / budget, 1) : 0;
  const over = budget > 0 ? Math.min(Math.max(eaten - budget, 0) / budget, 1) : 0;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={mid} cy={mid} r={r + sw / 2 + 1} fill="#fff" stroke="#2a1f33" strokeWidth="2.5" />
      <circle cx={mid} cy={mid} r={r - sw / 2 - 1} fill="#f4c064" stroke="#2a1f33" strokeWidth="2.5" />
      {frac > 0 && (
        <circle
          cx={mid}
          cy={mid}
          r={r}
          fill="none"
          stroke="#ff7a5c"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${Math.max(frac * c - 0.01, 0.01)} ${c}`}
          style={{ transition: 'stroke-dasharray 500ms ease' }}
        />
      )}
      {over > 0 && (
        <circle cx={mid} cy={mid} r={r} fill="none" stroke="#8b6cef" strokeWidth={sw - 6} strokeLinecap="round" strokeDasharray={`${over * c} ${c}`} />
      )}
    </svg>
  );
}

// ---------- Macro meter ----------

export function MacroMeter({
  name,
  value,
  target,
  color,
  track,
  main,
}: {
  name: string;
  value: number;
  target: number;
  color: string;
  track: string;
  main?: boolean;
}) {
  const pct = target > 0 ? Math.min(value / target, 1) * 100 : 0;
  return (
    <div className={`macro ${main ? 'protein-main' : ''}`}>
      <div className="head">
        <span className="name">
          <span className="dot" style={{ background: color }} />
          {name}
        </span>
        <span className="val">
          {fa(value)} از {fa(target)} گرم
        </span>
      </div>
      <div
        className="bar"
        style={{ background: track }}
        role="meter"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${fa(value)} از ${fa(target)} گرم`}
      >
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ---------- Daily kcal columns with per-day budget ticks ----------

export interface DayPoint {
  date: string;
  kcal: number;
  budget: number;
  logged: boolean;
}

export function KcalColumns({ days }: { days: DayPoint[] }) {
  const [sel, setSel] = useState<number | null>(null);
  const W = 340;
  const H = 170;
  const padT = 10;
  const padB = 24;
  const padL = 34; // y labels sit on the left (numbers read LTR)
  const plotW = W - padL - 4;
  const plotH = H - padT - padB;
  const maxV = Math.max(500, ...days.map((d) => Math.max(d.kcal, d.budget))) * 1.08;
  const step = maxV > 3000 ? 1000 : 500;
  const ticks: number[] = [];
  for (let v = 0; v <= maxV; v += step) ticks.push(v);
  const y = (v: number) => padT + plotH - (v / maxV) * plotH;
  const slot = plotW / days.length;
  const bw = Math.min(24, slot * 0.6);
  // Days run right-to-left (Persian reading order): first day at the right edge.
  const xCenter = (i: number) => padL + plotW - slot * (i + 0.5);
  const showLabel = (i: number) => days.length <= 7 || i % 5 === 0 || i === days.length - 1;
  const d = sel != null ? days[sel] : null;

  return (
    <div>
      <p className="chart-tip" aria-live="polite">
        {d
          ? d.logged
            ? `${jDayMonth(d.date)}: ${fa(d.kcal)} از ${fa(d.budget)} کالری`
            : `${jDayMonth(d.date)}: چیزی ثبت نشده`
          : 'روی هر ستون بزنید تا عددش رو ببینید.'}
      </p>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="کالری هر روز در برابر بودجه">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 4} y1={y(t)} y2={y(t)} stroke="#efe3d1" strokeWidth="1" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end">
              {t >= 1000 ? `${fa(t / 1000, 1)}K` : fa(t)}
            </text>
          </g>
        ))}
        {days.map((p, i) => {
          const cx = xCenter(i);
          const h = p.kcal > 0 ? Math.max(3, y(0) - y(p.kcal)) : 0;
          const top = y(0) - h;
          const r = Math.min(4, h);
          const x0 = cx - bw / 2;
          const path =
            h > 0
              ? `M${x0},${y(0)} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + bw - r} Q${x0 + bw},${top} ${x0 + bw},${top + r} V${y(0)} Z`
              : '';
          return (
            <g key={p.date}>
              {path && <path d={path} fill={sel === i ? '#e85f41' : '#ff7a5c'} />}
              {p.budget > 0 && <line x1={cx - slot * 0.42} x2={cx + slot * 0.42} y1={y(p.budget)} y2={y(p.budget)} stroke="#2a1f33" strokeWidth="2" strokeLinecap="round" />}
              {showLabel(i) && (
                <text x={cx} y={H - 6} textAnchor="middle">
                  {days.length <= 7 ? jWeekdayShort(p.date) : jDayNum(p.date)}
                </text>
              )}
              <rect
                x={cx - slot / 2}
                y={padT}
                width={slot}
                height={plotH}
                fill="transparent"
                onClick={() => setSel(i === sel ? null : i)}
                onMouseEnter={() => setSel(i)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}
        <line x1={padL} x2={W - 4} y1={y(0)} y2={y(0)} stroke="#2a1f33" strokeWidth="1.5" />
      </svg>
      <div className="row muted" style={{ fontSize: 13, gap: 16, marginTop: 4 }}>
        <span className="row" style={{ gap: 6 }}>
          <span style={{ width: 12, height: 12, background: '#ff7a5c', borderRadius: 3, display: 'inline-block' }} /> خورده‌شده
        </span>
        <span className="row" style={{ gap: 6 }}>
          <span style={{ width: 16, height: 2, background: '#2a1f33', display: 'inline-block' }} /> بودجهٔ همان روز
        </span>
      </div>
    </div>
  );
}

// ---------- Weight: raw weigh-ins (dots) + smoothed trend (line) ----------

export function WeightChart({ points }: { points: { date: string; kg: number; trend: number }[] }) {
  const [sel, setSel] = useState<number | null>(null);
  if (points.length < 2) return null;
  const W = 340;
  const H = 180;
  const padT = 12;
  const padB = 24;
  const padL = 34;
  const plotW = W - padL - 10;
  const plotH = H - padT - padB;
  const all = points.flatMap((p) => [p.kg, p.trend]);
  let lo = Math.floor(Math.min(...all) - 0.5);
  let hi = Math.ceil(Math.max(...all) + 0.5);
  if (hi - lo < 3) {
    lo -= 1;
    hi += 1;
  }
  const t0 = Date.parse(points[0].date);
  const t1 = Date.parse(points[points.length - 1].date);
  const span = Math.max(t1 - t0, 86400000);
  // Time runs right-to-left to match Persian reading order.
  const x = (date: string) => padL + plotW - ((Date.parse(date) - t0) / span) * plotW;
  const y = (v: number) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;
  const tickStep = hi - lo > 12 ? 5 : hi - lo > 6 ? 2 : 1;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / tickStep) * tickStep; v <= hi; v += tickStep) ticks.push(v);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)},${y(p.trend).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const s = sel != null ? points[sel] : null;

  return (
    <div>
      <p className="chart-tip" aria-live="polite">
        {s ? `${jDayMonth(s.date)}: ${fa(s.kg, 1)} کیلو (روند ${fa(s.trend, 1)})` : 'روی هر نقطه بزنید تا وزنش رو ببینید.'}
      </p>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="وزن‌های ثبت‌شده و خط روند">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 4} y1={y(t)} y2={y(t)} stroke="#efe3d1" strokeWidth="1" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end">
              {fa(t)}
            </text>
          </g>
        ))}
        <path d={line} fill="none" stroke="#5b5bea" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={p.date} cx={x(p.date)} cy={y(p.kg)} r={sel === i ? 6 : 4.5} fill="#ff7a5c" stroke="#fff" strokeWidth="2" />
        ))}
        {points.map((p, i) => (
          <rect
            key={`h${p.date}`}
            x={x(p.date) - 12}
            y={padT}
            width={24}
            height={plotH}
            fill="transparent"
            onClick={() => setSel(i === sel ? null : i)}
            onMouseEnter={() => setSel(i)}
          />
        ))}
        <text x={x(last.date)} y={y(last.trend) - 10} textAnchor="middle" style={{ fill: '#2a1f33', fontWeight: 800, fontSize: 12 }}>
          {fa(last.trend, 1)}
        </text>
        <text x={x(points[0].date)} y={H - 6} textAnchor="end">
          {jDayMonth(points[0].date)}
        </text>
        <text x={x(last.date)} y={H - 6} textAnchor="start">
          {jDayMonth(last.date)}
        </text>
      </svg>
      <div className="row muted wrap" style={{ fontSize: 13, gap: 16, marginTop: 4 }}>
        <span className="row" style={{ gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: '#ff7a5c', display: 'inline-block' }} /> وزن ثبت‌شده
        </span>
        <span className="row" style={{ gap: 6 }}>
          <span style={{ width: 16, height: 3, background: '#5b5bea', display: 'inline-block', borderRadius: 2 }} /> روند (میانگین هموار)
        </span>
      </div>
    </div>
  );
}
