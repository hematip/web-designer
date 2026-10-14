import { compact, normalizeFa } from './fa.ts';

export interface Searchable {
  id: string;
  n: string;
  a?: string;
}

interface Indexed<T> {
  item: T;
  name: string; // normalised name
  nameC: string; // compact
  all: string; // normalised name + aliases
  allC: string;
}

export function buildIndex<T extends Searchable>(items: T[]): Indexed<T>[] {
  return items.map((item) => {
    const name = normalizeFa(item.n);
    const all = normalizeFa(`${item.n} ${item.a ?? ''}`);
    return { item, name, nameC: name.replace(/ /g, ''), all, allC: all.replace(/ /g, '') };
  });
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/**
 * Rank items for a Persian query. Tolerates ي/ك, missing or extra spaces / نیم‌فاصله,
 * and a single typo in longer words.
 */
export function search<T extends Searchable>(index: Indexed<T>[], query: string, limit = 40): T[] {
  const q = normalizeFa(query);
  if (!q) return [];
  const qC = compact(query);
  const tokens = q.split(' ').filter(Boolean);
  const scored: { item: T; score: number }[] = [];
  for (const it of index) {
    let score = 0;
    if (it.nameC === qC) score = 100;
    else if (it.nameC.startsWith(qC)) score = 80;
    else if (it.name.split(' ').some((w) => w.startsWith(q))) score = 70;
    else if (it.allC.includes(qC)) score = 60;
    else if (tokens.every((t) => it.allC.includes(t))) score = 50;
    else {
      const words = it.all.split(' ');
      const fuzzy = tokens.every((t) => t.length >= 4 ? words.some((w) => editDistanceAtMostOne(w.slice(0, t.length + 1), t) || editDistanceAtMostOne(w, t)) : it.allC.includes(t));
      if (fuzzy) score = 30;
    }
    if (score > 0) {
      score -= it.name.length / 100; // shorter names first among equals
      scored.push({ item: it.item, score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
