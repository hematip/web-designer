// Storage on SQLite (Node's built-in node:sqlite): one file, for a VPS or local use.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SYNC_PAGE } from './auth.js';

export function openSqliteStore(file) {
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

  const nextSeq = () => {
    db.prepare("UPDATE counters SET value = value + 1 WHERE name = 'seq'").run();
    return db.prepare("SELECT value FROM counters WHERE name = 'seq'").get().value;
  };
  const toChange = (r) => ({ col: r.col, id: r.id, data: r.data ? JSON.parse(r.data) : null, updatedAt: Number(r.updated_at), deleted: !!r.deleted, seq: Number(r.seq) });

  return {
    kind: 'sqlite',
    async findUser(username) {
      const r = db.prepare('SELECT id, username, display_name, pass_hash FROM users WHERE username = ?').get(username);
      return r ? { id: Number(r.id), username: r.username, displayName: r.display_name, passHash: r.pass_hash } : null;
    },
    async getUser(id) {
      const r = db.prepare('SELECT id, username, display_name, pass_hash FROM users WHERE id = ?').get(id);
      return r ? { id: Number(r.id), username: r.username, displayName: r.display_name, passHash: r.pass_hash } : null;
    },
    async createUser(username, displayName, passHash) {
      try {
        const { lastInsertRowid } = db.prepare('INSERT INTO users (username, display_name, pass_hash, created_at) VALUES (?, ?, ?, ?)').run(username, displayName, passHash, Date.now());
        return Number(lastInsertRowid);
      } catch (e) {
        if (String(e.message).includes('UNIQUE')) return null;
        throw e;
      }
    },
    async setPassword(userId, passHash) {
      db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(passHash, userId);
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    },
    async deleteUser(userId) {
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    },
    async listUsers() {
      return db.prepare(`SELECT u.username, u.display_name AS "displayName", u.created_at AS "createdAt",
        (SELECT COUNT(*) FROM records r WHERE r.user_id = u.id AND r.deleted = 0) AS records FROM users u ORDER BY u.id`).all();
    },
    async createSession(hash, userId, expiresAt) {
      db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(hash, userId, Date.now(), expiresAt);
    },
    async sessionUser(hash) {
      const r = db.prepare(`SELECT u.id, u.username, u.display_name, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`).get(hash);
      if (!r) return null;
      if (Number(r.expires_at) < Date.now()) {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash);
        return null;
      }
      return { id: Number(r.id), username: r.username, displayName: r.display_name };
    },
    async deleteSession(hash) {
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash);
    },
    async sync(userId, since, changes) {
      const getOne = db.prepare('SELECT updated_at FROM records WHERE user_id = ? AND col = ? AND id = ?');
      const upsert = db.prepare(`INSERT INTO records (user_id, col, id, data, updated_at, deleted, seq) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (user_id, col, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, deleted = excluded.deleted, seq = excluded.seq`);
      const lost = [];
      db.exec('BEGIN');
      try {
        for (const ch of changes) {
          const ex = getOne.get(userId, ch.col, ch.id);
          if (ex && Number(ex.updated_at) > ch.updatedAt) {
            lost.push(ch);
            continue;
          }
          upsert.run(userId, ch.col, ch.id, ch.deleted ? null : JSON.stringify(ch.data), ch.updatedAt, ch.deleted ? 1 : 0, nextSeq());
        }
        db.exec('COMMIT');
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
      const rows = db.prepare('SELECT col, id, data, updated_at, deleted, seq FROM records WHERE user_id = ? AND seq > ? ORDER BY seq LIMIT ?').all(userId, since, SYNC_PAGE + 1).map(toChange);
      const getFull = db.prepare('SELECT col, id, data, updated_at, deleted, seq FROM records WHERE user_id = ? AND col = ? AND id = ?');
      const extra = lost.map((c) => getFull.get(userId, c.col, c.id)).filter(Boolean).map(toChange);
      return { rows, extra };
    },
    async close() {
      db.close();
    },
  };
}
