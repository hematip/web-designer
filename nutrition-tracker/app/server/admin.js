// Admin commands for a small private deployment:
//   npm run invite -- users
//   npm run invite -- reset-password <username> <new-password>
//   npm run invite -- delete-user <username>
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { hashPassword, openDb } from './db.js';

const here = dirname(fileURLToPath(import.meta.url));
const db = openDb(process.env.DB_FILE || join(here, '..', 'data', 'nokhodchi.db'));
const [cmd, a, b] = process.argv.slice(2);

if (cmd === 'users') {
  const rows = db.prepare(`SELECT u.username, u.display_name, datetime(u.created_at/1000,'unixepoch') AS created,
    (SELECT COUNT(*) FROM records r WHERE r.user_id = u.id AND r.deleted = 0) AS records FROM users u ORDER BY u.id`).all();
  console.table(rows);
} else if (cmd === 'reset-password' && a && b) {
  if (b.length < 6) throw new Error('password must be at least 6 characters');
  const r = db.prepare('UPDATE users SET pass_hash = ? WHERE username = ?').run(await hashPassword(b), a.toLowerCase());
  db.prepare('DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE username = ?)').run(a.toLowerCase());
  console.log(r.changes ? 'password reset; existing sessions signed out' : 'no such user');
} else if (cmd === 'delete-user' && a) {
  const r = db.prepare('DELETE FROM users WHERE username = ?').run(a.toLowerCase());
  console.log(r.changes ? 'deleted' : 'no such user');
} else {
  console.log('usage: users | reset-password <username> <new-password> | delete-user <username>');
}
db.close();
