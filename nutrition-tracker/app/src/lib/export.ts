import { list } from './store.ts';
import { MEAL_LABEL } from './types.ts';
import { dateKey, jFull } from './fa.ts';

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** One CSV with every food, activity, weight, water and steps record (UTF-8 with BOM for Excel). */
export function exportCsv() {
  const lines: string[] = [['نوع', 'تاریخ', 'تاریخ شمسی', 'وعده/جزئیات', 'نام', 'مقدار', 'واحد', 'کالری', 'پروتئین', 'کربوهیدرات', 'چربی'].join(',')];
  const add = (cells: unknown[]) => lines.push(cells.map(csvCell).join(','));

  for (const { data: e } of list('food').sort((a, b) => a.data.date.localeCompare(b.data.date) || a.data.at - b.data.at)) {
    add(['غذا', e.date, jFull(e.date), MEAL_LABEL[e.meal], e.name, e.qty, e.unit, e.kcal, e.p, e.c, e.f]);
  }
  for (const { data: a } of list('act').sort((x, y) => x.data.date.localeCompare(y.data.date))) {
    add(['فعالیت', a.date, jFull(a.date), `${a.minutes} دقیقه`, a.name, a.minutes, 'دقیقه', a.kcal, '', '', '']);
  }
  for (const { data: w } of list('weight').sort((x, y) => x.data.date.localeCompare(y.data.date))) {
    add(['وزن', w.date, jFull(w.date), w.waistCm ? `کمر ${w.waistCm}` : '', '', w.kg, 'کیلو', '', '', '', '']);
  }
  for (const { data: w } of list('water').sort((x, y) => x.data.date.localeCompare(y.data.date))) {
    add(['آب', w.date, jFull(w.date), '', '', w.glasses, 'لیوان', '', '', '', '']);
  }
  for (const { data: s } of list('steps').sort((x, y) => x.data.date.localeCompare(y.data.date))) {
    add(['گام', s.date, jFull(s.date), '', '', s.steps, 'گام', '', '', '', '']);
  }

  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nokhodchi-${dateKey()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
