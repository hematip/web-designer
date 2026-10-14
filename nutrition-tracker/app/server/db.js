// SQLite storage (Node's built-in node:sqlite). One file, no external database server.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);

export function openDb(file) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      display_name TEXT NOT NULL,
      pass_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS records (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      col TEXT NOT NULL,
      id TEXT NOT NULL,
      data TEXT,
      updated_at INTEGER NOT NULL,
      deleted INTEGER NOT NULL DEFAULT 0,
      seq INTEGER NOT NULL,
      PRIMARY KEY (user_id, col, id)
    );
    CREATE INDEX IF NOT EXISTS records_seq ON records(user_id, seq);
    CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER NOT NULL);
    INSERT OR IGNORE INTO counters VALUES ('seq', 0);
  `);
  return db;
}

// ---- passwords ----
const N = 16384, R = 8, P = 1, KEYLEN = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password, stored) {
  const [alg, n, r, p, saltB64, hashB64] = String(stored).split('$');
  if (alg !== 'scrypt') return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length, { N: +n, r: +r, p: +p });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ---- sessions ----
const SESSION_DAYS = 365;
const sha = (s) => createHash('sha256').update(s).digest('hex');

export function createSession(db, userId) {
  const token = randomBytes(32).toString('base64url');
  const now = Date.now();
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(sha(token), userId, now, now + SESSION_DAYS * 86400000);
  return token;
}

export function sessionUser(db, token) {
  if (!token) return null;
  const row = db
    .prepare(`SELECT u.id, u.username, u.display_name AS displayName, s.expires_at AS exp
              FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`)
    .get(sha(token));
  if (!row) return null;
  if (row.exp < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha(token));
    return null;
  }
  return { id: row.id, username: row.username, displayName: row.displayName };
}

export function deleteSession(db, token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha(token));
}

// ---- sync ----
export const COLLECTIONS = new Set(['profile', 'plan', 'settings', 'food', 'act', 'weight', 'water', 'steps', 'myfood', 'fav']);

function nextSeq(db) {
  db.prepare("UPDATE counters SET value = value + 1 WHERE name = 'seq'").run();
  return db.prepare("SELECT value FROM counters WHERE name = 'seq'").get().value;
}

/**
 * Apply client changes with last-write-wins on updatedAt, then return every record
 * changed after `since`, plus the current server copy of any change that lost.
 */
export function sync(db, userId, since, changes) {
  const getOne = db.prepare('SELECT updated_at FROM records WHERE user_id = ? AND col = ? AND id = ?');
  const upsert = db.prepare(`INSERT INTO records (user_id, col, id, data, updated_at, deleted, seq)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, col, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at,
      deleted = excluded.deleted, seq = excluded.seq`);
  const lost = [];
  db.exec('BEGIN');
  try {
    for (const ch of changes) {
      const existing = getOne.get(userId, ch.col, ch.id);
      if (existing && existing.updated_at > ch.updatedAt) {
        lost.push([ch.col, ch.id]);
        continue;
      }
      upsert.run(userId, ch.col, ch.id, ch.deleted ? null : JSON.stringify(ch.data), ch.updatedAt, ch.deleted ? 1 : 0, nextSeq(db));
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  const LIMIT = 2000;
  const rows = db
    .prepare('SELECT col, id, data, updated_at, deleted, seq FROM records WHERE user_id = ? AND seq > ? ORDER BY seq LIMIT ?')
    .all(userId, since, LIMIT + 1);
  const more = rows.length > LIMIT;
  if (more) rows.pop();
  const getFull = db.prepare('SELECT col, id, data, updated_at, deleted, seq FROM records WHERE user_id = ? AND col = ? AND id = ?');
  for (const [col, id] of lost) {
    const r = getFull.get(userId, col, id);
    if (r && !rows.some((x) => x.col === col && x.id === id)) rows.push(r);
  }
  const maxSeq = rows.reduce((m, r) => Math.max(m, r.seq), since);
  return {
    seq: more ? maxSeq : Math.max(maxSeq, since),
    more,
    changes: rows.map((r) => ({ col: r.col, id: r.id, data: r.data ? JSON.parse(r.data) : null, updatedAt: r.updated_at, deleted: !!r.deleted })),
  };
}
