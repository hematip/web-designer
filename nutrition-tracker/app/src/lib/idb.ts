// Minimal IndexedDB wrapper: one object store for records, one for meta values.

const DB_NAME = 'nokhodchi';
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('records')) db.createObjectStore('records');
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        const r = fn(s);
        t.oncomplete = () => resolve(r ? (r.result as T) : undefined);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export const idb = {
  async getAll<T>(store: string): Promise<{ key: string; value: T }[]> {
    const db = await open();
    return new Promise((resolve, reject) => {
      const out: { key: string; value: T }[] = [];
      const req = db.transaction(store).objectStore(store).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (!c) return resolve(out);
        out.push({ key: String(c.key), value: c.value as T });
        c.continue();
      };
      req.onerror = () => reject(req.error);
    });
  },
  get<T>(store: string, key: string) {
    return tx<T>(store, 'readonly', (s) => s.get(key) as IDBRequest<T>);
  },
  async putMany(store: string, entries: [string, unknown][]) {
    if (!entries.length) return;
    await tx(store, 'readwrite', (s) => {
      for (const [k, v] of entries) s.put(v, k);
    });
  },
  put(store: string, key: string, value: unknown) {
    return tx(store, 'readwrite', (s) => s.put(value, key));
  },
  clear(store: string) {
    return tx(store, 'readwrite', (s) => s.clear());
  },
};
