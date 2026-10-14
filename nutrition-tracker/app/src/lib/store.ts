// Local-first record store. Every change is written to IndexedDB immediately and
// queued for sync; the server merges with last-write-wins per record.
import { useSyncExternalStore } from 'react';
import { idb } from './idb.ts';
import { api, ApiError, NetworkError, type User } from './api.ts';
import type { Col, CollectionMap } from './types.ts';

interface Rec<T = unknown> {
  col: Col;
  id: string;
  data: T | null;
  updatedAt: number;
  deleted: boolean;
  dirty: boolean;
}

interface ServerChange {
  col: Col;
  id: string;
  data: unknown;
  updatedAt: number;
  deleted: boolean;
}

export type SyncState = 'idle' | 'syncing' | 'offline' | 'error' | 'auth';

const records = new Map<string, Rec>();
let user: User | null = null;
let lastSeq = 0;
let syncState: SyncState = 'idle';
let lastSyncAt = 0;
let version = 0;
const listeners = new Set<() => void>();

const keyOf = (col: string, id: string) => `${col}:${id}`;

function emit() {
  version++;
  for (const l of listeners) l();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Re-render on any store change. */
export function useStore(): number {
  return useSyncExternalStore(subscribe, () => version);
}

let lastStamp = 0;
function stamp() {
  // Monotonic per device, so two quick edits never share a timestamp.
  lastStamp = Math.max(Date.now(), lastStamp + 1);
  return lastStamp;
}

export function uid(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

// ---------- reading ----------

export function get<C extends Col>(col: C, id: string): CollectionMap[C] | null {
  const r = records.get(keyOf(col, id));
  return r && !r.deleted ? (r.data as CollectionMap[C]) : null;
}

export function list<C extends Col>(col: C): { id: string; data: CollectionMap[C]; updatedAt: number }[] {
  const out: { id: string; data: CollectionMap[C]; updatedAt: number }[] = [];
  for (const r of records.values()) {
    if (r.col === col && !r.deleted && r.data) out.push({ id: r.id, data: r.data as CollectionMap[C], updatedAt: r.updatedAt });
  }
  return out;
}

export const getUser = () => user;
export const getSyncState = () => syncState;
export const getLastSyncAt = () => lastSyncAt;
export function pendingCount() {
  let n = 0;
  for (const r of records.values()) if (r.dirty) n++;
  return n;
}

// ---------- writing ----------

function write(rec: Rec) {
  records.set(keyOf(rec.col, rec.id), rec);
  void idb.put('records', keyOf(rec.col, rec.id), rec);
  emit();
  scheduleSync();
}

export function put<C extends Col>(col: C, id: string, data: CollectionMap[C]) {
  write({ col, id, data, updatedAt: stamp(), deleted: false, dirty: true });
}

export function remove(col: Col, id: string) {
  const existing = records.get(keyOf(col, id));
  if (!existing || existing.deleted) return;
  write({ col, id, data: null, updatedAt: stamp(), deleted: true, dirty: true });
}

/** Restore a record exactly as it was (used by undo). */
export function restore<C extends Col>(col: C, id: string, data: CollectionMap[C]) {
  put(col, id, data);
}

// ---------- lifecycle ----------

export async function init(): Promise<void> {
  const [rows, u, seq] = await Promise.all([
    idb.getAll<Rec>('records'),
    idb.get<User>('meta', 'user'),
    idb.get<number>('meta', 'lastSeq'),
  ]);
  for (const { key, value } of rows) records.set(key, value);
  user = u ?? null;
  lastSeq = seq ?? 0;
  emit();
  if (user) {
    startBackground();
    scheduleSync(0);
  }
}

let background = false;
function startBackground() {
  if (background) return;
  background = true;
  window.addEventListener('online', () => scheduleSync(0));
  window.addEventListener('offline', () => setState('offline'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleSync(0);
  });
  setInterval(() => scheduleSync(0), 60_000);
}

export async function signIn(u: User) {
  if (user?.username !== u.username) {
    records.clear();
    await idb.clear('records');
    lastSeq = 0;
    await idb.put('meta', 'lastSeq', 0);
  }
  user = u;
  await idb.put('meta', 'user', u);
  syncState = 'idle';
  emit();
  startBackground();
  await syncNow();
}

export async function signOut() {
  try {
    await api('/api/logout', {});
  } catch {
    /* offline: still clear this device */
  }
  await wipeLocal();
}

export async function wipeLocal() {
  records.clear();
  user = null;
  lastSeq = 0;
  await idb.clear('records');
  await idb.clear('meta');
  syncState = 'idle';
  emit();
}

// ---------- sync ----------

let timer: ReturnType<typeof setTimeout> | null = null;
let running: Promise<void> | null = null;

export function scheduleSync(delay = 1200) {
  if (!user) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void syncNow();
  }, delay);
}

function setState(s: SyncState) {
  if (syncState !== s) {
    syncState = s;
    emit();
  }
}

export function syncNow(): Promise<void> {
  if (running) return running;
  running = (async () => {
    try {
      let more = true;
      while (more && user) {
        setState('syncing');
        const sent = [...records.values()].filter((r) => r.dirty);
        const res = await api<{ seq: number; more: boolean; changes: ServerChange[] }>('/api/sync', {
          since: lastSeq,
          changes: sent.map((r) => ({ col: r.col, id: r.id, data: r.data, updatedAt: r.updatedAt, deleted: r.deleted })),
        });
        const toSave: [string, unknown][] = [];
        for (const r of sent) {
          const cur = records.get(keyOf(r.col, r.id));
          if (cur && cur.updatedAt === r.updatedAt) {
            cur.dirty = false;
            toSave.push([keyOf(cur.col, cur.id), cur]);
          }
        }
        for (const ch of res.changes) {
          const k = keyOf(ch.col, ch.id);
          const cur = records.get(k);
          if (cur && cur.dirty && cur.updatedAt > ch.updatedAt) continue; // our newer edit is still pending
          if (cur && !cur.dirty && cur.updatedAt === ch.updatedAt && cur.deleted === ch.deleted) continue;
          const rec: Rec = { col: ch.col, id: ch.id, data: ch.data, updatedAt: ch.updatedAt, deleted: ch.deleted, dirty: false };
          records.set(k, rec);
          toSave.push([k, rec]);
        }
        await idb.putMany('records', toSave);
        lastSeq = res.seq;
        await idb.put('meta', 'lastSeq', lastSeq);
        more = res.more;
        lastSyncAt = Date.now();
        emit();
      }
      setState(pendingCount() ? 'error' : 'idle');
      if (pendingCount()) scheduleSync(5000);
    } catch (e) {
      if (e instanceof NetworkError) setState(navigator.onLine ? 'error' : 'offline');
      else if (e instanceof ApiError && e.status === 401) setState('auth');
      else setState('error');
    } finally {
      running = null;
    }
  })();
  return running;
}
