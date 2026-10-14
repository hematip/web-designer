// Entry point: `npm start`. Configuration via environment variables (see README).
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { openDb } from './db.js';
import { createHandler } from './app.js';

const here = dirname(fileURLToPath(import.meta.url));

const cfg = {
  port: Number(process.env.PORT || 8787),
  host: process.env.HOST || '0.0.0.0',
  dbFile: process.env.DB_FILE || join(here, '..', 'data', 'nokhodchi.db'),
  staticDir: process.env.STATIC_DIR || join(here, '..', 'dist'),
  inviteCode: (process.env.INVITE_CODE || '').trim(),
  // Unset = auto-detect from X-Forwarded-Proto; "1" forces Secure cookies, "0" disables.
  cookieSecure: process.env.COOKIE_SECURE === '1' ? true : process.env.COOKIE_SECURE === '0' ? false : undefined,
};

const db = openDb(cfg.dbFile);
const server = createServer(createHandler(cfg, db));
server.listen(cfg.port, cfg.host, () => {
  console.log(`نخودچی: http://${cfg.host}:${cfg.port}  (db: ${cfg.dbFile})`);
  if (!cfg.inviteCode) console.log('INVITE_CODE is not set — new sign-ups are closed.');
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close();
    db.close();
    process.exit(0);
  });
}
