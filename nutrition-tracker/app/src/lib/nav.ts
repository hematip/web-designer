// One modal sheet at a time. Opening the first sheet pushes a history entry so the
// Android/browser back button closes it; switching sheets reuses that entry.
import { useSyncExternalStore } from 'react';

export type SheetState =
  | { kind: 'add-menu' }
  | { kind: 'add-food'; meal?: import('./types.ts').Meal; date: string }
  | { kind: 'edit-food'; id: string }
  | { kind: 'add-activity'; date: string }
  | { kind: 'edit-activity'; id: string }
  | { kind: 'weight'; date: string }
  | { kind: 'steps'; date: string }
  | { kind: 'plan' }
  | { kind: 'budget' }
  | { kind: 'install' }
  | { kind: 'password' }
  | { kind: 'delete-account' };

let current: SheetState | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function openSheet(s: SheetState) {
  if (!current) history.pushState({ sheet: true }, '');
  current = s;
  emit();
}

export function closeSheet() {
  if (current) history.back();
}

window.addEventListener('popstate', () => {
  if (current) {
    current = null;
    emit();
  }
});

export function useSheet(): SheetState | null {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => current,
  );
}

export type Tab = 'today' | 'reports' | 'body' | 'me';
const TABS: Tab[] = ['today', 'reports', 'body', 'me'];
let tab: Tab = (TABS.find((t) => location.hash === `#/${t}`) ?? 'today') as Tab;
const tabSubs = new Set<() => void>();

export function goTab(t: Tab) {
  tab = t;
  history.replaceState(history.state, '', `#/${t}`);
  window.scrollTo(0, 0);
  tabSubs.forEach((f) => f());
}

export function useTab(): Tab {
  return useSyncExternalStore(
    (f) => {
      tabSubs.add(f);
      return () => tabSubs.delete(f);
    },
    () => tab,
  );
}
