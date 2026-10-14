// Vercel Function: every /api/* request is rewritten here (see vercel.json).
// Storage is Postgres from DATABASE_URL / POSTGRES_URL; the connection is opened once per instance.
import { createHandler } from '../server/app.js';
import { databaseUrl, openStoreFromEnv } from '../server/stores.js';

let storePromise = null;
function store() {
  if (!databaseUrl()) throw Object.assign(new Error('database-not-configured'), { status: 503 });
  storePromise ??= openStoreFromEnv().catch((e) => {
    storePromise = null; // retry on the next request
    throw e;
  });
  return storePromise;
}

const cfg = {
  staticDir: '/nonexistent', // static files are served by Vercel's CDN
  inviteCode: (process.env.INVITE_CODE || '').trim(),
  cookieSecure: true,
};

// One handler per instance, so the auth rate limiter keeps its state between requests.
let app = null;

export default async function handler(req, res) {
  try {
    app ??= createHandler(cfg, await store());
  } catch (e) {
    console.error(e);
    res.statusCode = e.status || 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: e.status ? e.message : 'database-unavailable' }));
    return;
  }
  return app(req, res);
}
