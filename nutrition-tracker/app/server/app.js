// HTTP API + static file server. No framework; node:http only.
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import {
  COLLECTIONS, createSession, deleteSession, hashPassword, sessionUser, sync, verifyPassword,
} from './db.js';

const COOKIE = 'nk_sid';
const MAX_BODY = 2 * 1024 * 1024;
const MAX_RECORD = 16 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; " +
    "connect-src 'self'; font-src 'self'; manifest-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'",
};

// ---- small helpers ----
function send(res, status, body, headers = {}) {
  const isJson = typeof body !== 'string' && !Buffer.isBuffer(body);
  const payload = isJson ? JSON.stringify(body) : body;
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    ...(isJson ? { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } : {}),
    ...headers,
  });
  res.end(payload);
}

function cookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isHttps(req, cfg) {
  return cfg.cookieSecure ?? (req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted === true);
}

function sessionCookie(req, cfg, token, maxAge) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isHttps(req, cfg) ? '; Secure' : ''}`;
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error('too large'), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw Object.assign(new Error('bad json'), { status: 400 });
  }
}

// Simple fixed-window limiter for auth endpoints.
const attempts = new Map();
function limited(key, max = 10, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.reset < now) {
    attempts.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  a.n++;
  return a.n > max;
}

const USERNAME = /^[a-z0-9_.]{3,24}$/i;

function publicUser(u) {
  return { username: u.username, displayName: u.displayName };
}

// ---- API ----
async function api(req, res, cfg, db, path) {
  const method = req.method;
  // Reject cross-site writes (cookies are SameSite=Lax; this adds an Origin check).
  if (method !== 'GET') {
    const origin = req.headers.origin;
    if (origin) {
      let host;
      try { host = new URL(origin).host; } catch { host = ''; }
      if (host !== req.headers.host) return send(res, 403, { error: 'origin' });
    }
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'content-type' });
  }
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
  const token = cookies(req)[COOKIE];

  if (path === '/api/health' && method === 'GET') return send(res, 200, { ok: true });

  if (path === '/api/signup' && method === 'POST') {
    if (limited(`signup:${ip}`)) return send(res, 429, { error: 'rate' });
    const b = await readJson(req);
    if (!cfg.inviteCode) return send(res, 403, { error: 'signup-closed' });
    if (String(b.invite || '').trim() !== cfg.inviteCode) return send(res, 403, { error: 'invite' });
    const username = String(b.username || '').trim().toLowerCase();
    const displayName = String(b.displayName || '').trim().slice(0, 40);
    const password = String(b.password || '');
    if (!USERNAME.test(username)) return send(res, 400, { error: 'username' });
    if (!displayName) return send(res, 400, { error: 'displayName' });
    if (password.length < 6 || password.length > 200) return send(res, 400, { error: 'password' });
    if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) return send(res, 409, { error: 'taken' });
    const hash = await hashPassword(password);
    const { lastInsertRowid } = db.prepare('INSERT INTO users (username, display_name, pass_hash, created_at) VALUES (?, ?, ?, ?)')
      .run(username, displayName, hash, Date.now());
    const t = createSession(db, Number(lastInsertRowid));
    return send(res, 201, { user: { username, displayName } }, { 'Set-Cookie': sessionCookie(req, cfg, t, 31536000) });
  }

  if (path === '/api/login' && method === 'POST') {
    const b = await readJson(req);
    const username = String(b.username || '').trim().toLowerCase();
    if (limited(`login:${ip}:${username}`) || limited(`login-ip:${ip}`, 40)) return send(res, 429, { error: 'rate' });
    const row = db.prepare('SELECT id, username, display_name AS displayName, pass_hash FROM users WHERE username = ?').get(username);
    const ok = row ? await verifyPassword(String(b.password || ''), row.pass_hash) : (await hashPassword('x'), false);
    if (!ok) return send(res, 401, { error: 'credentials' });
    const t = createSession(db, row.id);
    return send(res, 200, { user: publicUser(row) }, { 'Set-Cookie': sessionCookie(req, cfg, t, 31536000) });
  }

  if (path === '/api/logout' && method === 'POST') {
    deleteSession(db, token);
    return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, cfg, '', 0) });
  }

  const user = sessionUser(db, token);
  if (!user) return send(res, 401, { error: 'auth' });

  if (path === '/api/me' && method === 'GET') return send(res, 200, { user: publicUser(user) });

  if (path === '/api/sync' && method === 'POST') {
    const b = await readJson(req);
    const since = Number.isInteger(b.since) && b.since >= 0 ? b.since : 0;
    const changes = Array.isArray(b.changes) ? b.changes : [];
    if (changes.length > 1000) return send(res, 413, { error: 'too-many' });
    const clean = [];
    for (const c of changes) {
      if (!c || !COLLECTIONS.has(c.col) || typeof c.id !== 'string' || c.id.length > 80) return send(res, 400, { error: 'record' });
      const updatedAt = Number(c.updatedAt);
      if (!Number.isFinite(updatedAt)) return send(res, 400, { error: 'record' });
      if (!c.deleted && JSON.stringify(c.data ?? null).length > MAX_RECORD) return send(res, 413, { error: 'record-size' });
      // Don't let a skewed client clock push records far into the future.
      clean.push({ col: c.col, id: c.id, data: c.data ?? null, deleted: !!c.deleted, updatedAt: Math.min(updatedAt, Date.now() + 5 * 60000) });
    }
    return send(res, 200, sync(db, user.id, since, clean));
  }

  if (path === '/api/password' && method === 'POST') {
    const b = await readJson(req);
    if (limited(`pw:${user.id}`)) return send(res, 429, { error: 'rate' });
    const row = db.prepare('SELECT pass_hash FROM users WHERE id = ?').get(user.id);
    if (!(await verifyPassword(String(b.oldPassword || ''), row.pass_hash))) return send(res, 401, { error: 'credentials' });
    const pw = String(b.newPassword || '');
    if (pw.length < 6 || pw.length > 200) return send(res, 400, { error: 'password' });
    db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(await hashPassword(pw), user.id);
    return send(res, 200, { ok: true });
  }

  if (path === '/api/account' && method === 'DELETE') {
    const b = await readJson(req);
    const row = db.prepare('SELECT pass_hash FROM users WHERE id = ?').get(user.id);
    if (!(await verifyPassword(String(b.password || ''), row.pass_hash))) return send(res, 401, { error: 'credentials' });
    db.prepare('DELETE FROM users WHERE id = ?').run(user.id); // cascades to sessions and records
    return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, cfg, '', 0) });
  }

  return send(res, 404, { error: 'not-found' });
}

// ---- static files ----
async function serveStatic(req, res, cfg, path) {
  const root = resolve(cfg.staticDir);
  let file = normalize(join(root, decodeURIComponent(path)));
  if (!file.startsWith(root)) return send(res, 400, 'bad path', { 'Content-Type': 'text/plain' });
  let st = await stat(file).catch(() => null);
  if (st?.isDirectory()) {
    file = join(file, 'index.html');
    st = await stat(file).catch(() => null);
  }
  if (!st) {
    // Unknown non-asset paths fall back to the app shell.
    if (extname(path)) return send(res, 404, 'not found', { 'Content-Type': 'text/plain' });
    file = join(root, 'index.html');
  }
  const body = await readFile(file).catch(() => null);
  if (!body) return send(res, 404, 'not found', { 'Content-Type': 'text/plain' });
  const ext = extname(file);
  const immutable = path.startsWith('/assets/') || path.startsWith('/fonts/');
  const cache = immutable ? 'public, max-age=31536000, immutable' : 'no-cache';
  return send(res, 200, body, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': cache });
}

export function createHandler(cfg, db) {
  return async (req, res) => {
    const url = new URL(req.url, 'http://x');
    try {
      if (url.pathname.startsWith('/api/')) return await api(req, res, cfg, db, url.pathname);
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'method', { 'Content-Type': 'text/plain' });
      return await serveStatic(req, res, cfg, url.pathname);
    } catch (e) {
      if (e?.status) return send(res, e.status, { error: e.message });
      console.error(e);
      return send(res, 500, { error: 'server' });
    }
  };
}
