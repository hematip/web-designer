// Entry point for a VPS / local run: `npm start`. Configuration via environment variables (see README).
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHandler } from './app.js';
import { openStoreFromEnv } from './stores.js';

const here = dirname(fileURLToPath(import.meta.url));

const cfg = {
  port: Number(process.env.PORT || 8787),
  host: process.env.HOST || '0.0.0.0',
  staticDir: process.env.STATIC_DIR || join(here, '..', 'dist'),
  inviteCode: (process.env.INVITE_CODE || '').trim(),
  // Unset = auto-detect from X-Forwarded-Proto; "1" forces Secure cookies, "0" disables.
  cookieSecure: process.env.COOKIE_SECURE === '1' ? true : process.env.COOKIE_SECURE === '0' ? false : undefined,
};

const store = await openStoreFromEnv();
const server = createServer(createHandler(cfg, store));
server.listen(cfg.port, cfg.host, () => {
  console.log(`listening on http://${cfg.host}:${cfg.port}  (storage: ${store.kind})`);
  if (!cfg.inviteCode) console.log('INVITE_CODE is not set — new sign-ups are closed.');
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    server.close();
    await store.close();
    process.exit(0);
  });
}
