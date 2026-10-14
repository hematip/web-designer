import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
// @ts-ignore plain JS module
import { openDb } from '../server/db.js';
// @ts-ignore plain JS module
import { createHandler } from '../server/app.js';

let server: Server;
let base = '';
before(async () => {
  const db = openDb(':memory:');
  server = createServer(createHandler({ inviteCode: 'family', staticDir: '/nonexistent', cookieSecure: false }, db));
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  const addr = server.address() as { port: number };
  base = `http://127.0.0.1:${addr.port}`;
});
after(() => server.close());

async function call(path: string, body?: unknown, cookie = '', method = body ? 'POST' : 'GET') {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get('set-cookie') || '';
  return { status: res.status, json: await res.json().catch(() => null), cookie: setCookie.split(';')[0] };
}

test('signup requires the invite code and valid fields', async () => {
  assert.equal((await call('/api/signup', { invite: 'nope', username: 'sara', displayName: 'سارا', password: 'secret1' })).status, 403);
  assert.equal((await call('/api/signup', { invite: 'family', username: 'a', displayName: 'x', password: 'secret1' })).status, 400);
  assert.equal((await call('/api/signup', { invite: 'family', username: 'sara', displayName: 'سارا', password: '123' })).status, 400);
  const ok = await call('/api/signup', { invite: 'family', username: 'Sara', displayName: 'سارا', password: 'secret1' });
  assert.equal(ok.status, 201);
  assert.equal(ok.json.user.username, 'sara');
  assert.match(ok.cookie, /^nk_sid=/);
  assert.equal((await call('/api/signup', { invite: 'family', username: 'sara', displayName: 'x', password: 'secret1' })).status, 409);
});

test('login, me, logout', async () => {
  assert.equal((await call('/api/login', { username: 'sara', password: 'wrong!!' })).status, 401);
  const r = await call('/api/login', { username: 'SARA', password: 'secret1' });
  assert.equal(r.status, 200);
  assert.equal((await call('/api/me', undefined, r.cookie)).json.user.displayName, 'سارا');
  await call('/api/logout', {}, r.cookie);
  assert.equal((await call('/api/me', undefined, r.cookie)).status, 401);
});

test('sync: upload, pull, last-write-wins, isolation between users', async () => {
  const a = (await call('/api/login', { username: 'sara', password: 'secret1' })).cookie;
  const b = (await call('/api/signup', { invite: 'family', username: 'reza', displayName: 'رضا', password: 'secret2' })).cookie;

  const r1 = await call('/api/sync', { since: 0, changes: [{ col: 'food', id: 'e1', data: { kcal: 100 }, updatedAt: 1000 }] }, a);
  assert.equal(r1.status, 200);
  assert.equal(r1.json.changes.length, 1);
  const seq = r1.json.seq;

  // older write loses and the server copy is returned
  const r2 = await call('/api/sync', { since: seq, changes: [{ col: 'food', id: 'e1', data: { kcal: 5 }, updatedAt: 500 }] }, a);
  assert.equal(r2.json.changes[0].data.kcal, 100);

  // newer write wins; delete propagates
  const r3 = await call('/api/sync', { since: seq, changes: [{ col: 'food', id: 'e1', deleted: true, updatedAt: 2000 }] }, a);
  assert.equal(r3.json.changes[0].deleted, true);

  // other user sees nothing of Sara's
  const rb = await call('/api/sync', { since: 0, changes: [] }, b);
  assert.equal(rb.json.changes.length, 0);

  // invalid collection rejected
  assert.equal((await call('/api/sync', { since: 0, changes: [{ col: 'users', id: 'x', data: {}, updatedAt: 1 }] }, a)).status, 400);
});

test('cross-origin writes are rejected', async () => {
  const res = await fetch(base + '/api/login', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, body: '{}' });
  assert.equal(res.status, 403);
});

test('account deletion needs the password and removes data', async () => {
  const b = (await call('/api/login', { username: 'reza', password: 'secret2' })).cookie;
  assert.equal((await call('/api/account', { password: 'nope' }, b, 'DELETE')).status, 401);
  assert.equal((await call('/api/account', { password: 'secret2' }, b, 'DELETE')).status, 200);
  assert.equal((await call('/api/login', { username: 'reza', password: 'secret2' })).status, 401);
});
