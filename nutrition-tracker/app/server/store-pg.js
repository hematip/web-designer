// Storage on Postgres (Supabase, Neon, Vercel Postgres, or any server) — used on Vercel,
// where the filesystem is not persistent. Tables live in their own schema `nt`, which is
// not exposed through any REST/PostgREST API.
import { SYNC_PAGE } from './auth.js';

export const SCHEMA_SQL = `
  CREATE SCHEMA IF NOT EXISTS nt;
  CREATE SEQUENCE IF NOT EXISTS nt.seq;
  CREATE TABLE IF NOT EXISTS nt.users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    pass_hash TEXT NOT NULL,
    created_at BIGINT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON nt.users (lower(username));
  CREATE TABLE IF NOT EXISTS nt.sessions (
    token_hash TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES nt.users(id) ON DELETE CASCADE,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_user ON nt.sessions (user_id);
  CREATE TABLE IF NOT EXISTS nt.records (
    user_id BIGINT NOT NULL REFERENCES nt.users(id) ON DELETE CASCADE,
    col TEXT NOT NULL,
    id TEXT NOT NULL,
    data JSONB,
    updated_at BIGINT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    seq BIGINT NOT NULL,
    PRIMARY KEY (user_id, col, id)
  );
  CREATE INDEX IF NOT EXISTS records_seq ON nt.records (user_id, seq);
`;

/**
 * `db` is a minimal adapter: { query(text, params) => rows, tx(fn(q)) => result, end() }.
 * Production uses the `postgres` driver (connectPg); tests use PGlite.
 */
export async function openPgStore(db, { migrate = true } = {}) {
  if (migrate) await db.exec(SCHEMA_SQL);
  const q = db.query;
  const user = (r) => (r ? { id: Number(r.id), username: r.username, displayName: r.display_name, passHash: r.pass_hash } : null);
  const toChange = (r) => ({
    col: r.col,
    id: r.id,
    data: r.data == null ? null : typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    updatedAt: Number(r.updated_at),
    deleted: !!r.deleted,
    seq: Number(r.seq),
  });

  return {
    kind: 'postgres',
    async findUser(username) {
      return user((await q('SELECT id, username, display_name, pass_hash FROM nt.users WHERE lower(username) = lower($1)', [username]))[0]);
    },
    async getUser(id) {
      return user((await q('SELECT id, username, display_name, pass_hash FROM nt.users WHERE id = $1', [id]))[0]);
    },
    async createUser(username, displayName, passHash) {
      const rows = await q(
        `INSERT INTO nt.users (username, display_name, pass_hash, created_at) VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING RETURNING id`,
        [username, displayName, passHash, Date.now()],
      );
      return rows[0] ? Number(rows[0].id) : null;
    },
    async setPassword(userId, passHash) {
      await db.tx(async (t) => {
        await t('UPDATE nt.users SET pass_hash = $1 WHERE id = $2', [passHash, userId]);
        await t('DELETE FROM nt.sessions WHERE user_id = $1', [userId]);
      });
    },
    async deleteUser(userId) {
      await q('DELETE FROM nt.users WHERE id = $1', [userId]);
    },
    async listUsers() {
      return q(`SELECT u.username, u.display_name AS "displayName", u.created_at AS "createdAt",
        (SELECT COUNT(*) FROM nt.records r WHERE r.user_id = u.id AND NOT r.deleted)::int AS records
        FROM nt.users u ORDER BY u.id`);
    },
    async createSession(hash, userId, expiresAt) {
      await q('INSERT INTO nt.sessions VALUES ($1, $2, $3, $4)', [hash, userId, Date.now(), expiresAt]);
    },
    async sessionUser(hash) {
      const r = (await q(
        `SELECT u.id, u.username, u.display_name, s.expires_at FROM nt.sessions s JOIN nt.users u ON u.id = s.user_id WHERE s.token_hash = $1`,
        [hash],
      ))[0];
      if (!r) return null;
      if (Number(r.expires_at) < Date.now()) {
        await q('DELETE FROM nt.sessions WHERE token_hash = $1', [hash]);
        return null;
      }
      return { id: Number(r.id), username: r.username, displayName: r.display_name };
    },
    async deleteSession(hash) {
      await q('DELETE FROM nt.sessions WHERE token_hash = $1', [hash]);
    },
    async sync(userId, since, changes) {
      // One sync per user at a time: every write commits before the next reader for that
      // user starts, so a client that advanced past a sequence number never misses a change.
      return db.tx(async (t) => {
        await t('SELECT pg_advisory_xact_lock($1::bigint)', [userId]);
        const lost = [];
        for (const ch of changes) {
          const ex = (await t('SELECT updated_at FROM nt.records WHERE user_id = $1 AND col = $2 AND id = $3', [userId, ch.col, ch.id]))[0];
          if (ex && Number(ex.updated_at) > ch.updatedAt) {
            lost.push(ch);
            continue;
          }
          await t(
            `INSERT INTO nt.records (user_id, col, id, data, updated_at, deleted, seq)
             VALUES ($1, $2, $3, $4::jsonb, $5, $6, nextval('nt.seq'))
             ON CONFLICT (user_id, col, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at,
               deleted = excluded.deleted, seq = excluded.seq`,
            [userId, ch.col, ch.id, ch.deleted ? null : JSON.stringify(ch.data), ch.updatedAt, ch.deleted],
          );
        }
        const rows = (await t(
          'SELECT col, id, data, updated_at, deleted, seq FROM nt.records WHERE user_id = $1 AND seq > $2 ORDER BY seq LIMIT $3',
          [userId, since, SYNC_PAGE + 1],
        )).map(toChange);
        const extra = [];
        for (const c of lost) {
          const r = (await t('SELECT col, id, data, updated_at, deleted, seq FROM nt.records WHERE user_id = $1 AND col = $2 AND id = $3', [userId, c.col, c.id]))[0];
          if (r) extra.push(toChange(r));
        }
        return { rows, extra };
      });
    },
    async close() {
      await db.end?.();
    },
  };
}

/** Connect with the `postgres` driver. prepare:false keeps it compatible with transaction poolers. */
export async function connectPg(url) {
  const { default: postgres } = await import('postgres');
  const sql = postgres(url, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 10, ssl: /sslmode=disable/.test(url) ? false : 'require' });
  return {
    query: (text, params = []) => sql.unsafe(text, params),
    exec: (text) => sql.unsafe(text).simple(),
    tx: (fn) => sql.begin((t) => fn((text, params = []) => t.unsafe(text, params))),
    end: () => sql.end({ timeout: 5 }),
  };
}
