// Admin commands (uses DATABASE_URL if set, else the SQLite file):
//   npm run admin -- users
//   npm run admin -- reset-password <username> <new-password>
//   npm run admin -- delete-user <username>
import { hashPassword } from './auth.js';
import { openStoreFromEnv } from './stores.js';

const store = await openStoreFromEnv();
const [cmd, a, b] = process.argv.slice(2);
try {
  if (cmd === 'users') {
    console.table(await store.listUsers());
  } else if (cmd === 'reset-password' && a && b) {
    if (b.length < 6) throw new Error('password must be at least 6 characters');
    const u = await store.findUser(a.toLowerCase());
    if (!u) console.log('no such user');
    else {
      await store.setPassword(u.id, await hashPassword(b));
      console.log('password reset; existing sessions signed out');
    }
  } else if (cmd === 'delete-user' && a) {
    const u = await store.findUser(a.toLowerCase());
    if (!u) console.log('no such user');
    else {
      await store.deleteUser(u.id);
      console.log('deleted');
    }
  } else {
    console.log('usage: users | reset-password <username> <new-password> | delete-user <username>');
  }
} finally {
  await store.close();
}
