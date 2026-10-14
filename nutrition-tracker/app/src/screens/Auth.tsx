import { useState, type FormEvent } from 'react';
import { api, errorMessage, type User } from '../lib/api.ts';
import { signIn } from '../lib/store.ts';
import { Mascot } from '../ui/Mascot.tsx';
import { Field } from '../ui/kit.tsx';
import { BRAND } from '../brand.ts';

export function Auth({ reason }: { reason?: 'expired' }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [invite, setInvite] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(reason === 'expired' ? 'نشستتون تموم شده؛ دوباره وارد بشید. داده‌های این دستگاه سر جاشه.' : null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res =
        mode === 'login'
          ? await api<{ user: User }>('/api/login', { username: username.trim(), password })
          : await api<{ user: User }>('/api/signup', { username: username.trim(), password, displayName: displayName.trim(), invite: invite.trim() });
      await signIn(res.user);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="center-page">
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <Mascot mood={mode === 'login' ? 'happy' : 'yay'} size={128} bob />
        </div>
        <h1 className="brand-title">{BRAND.name}</h1>
        <p className="muted" style={{ fontWeight: 700 }}>
          {BRAND.tagline}
        </p>
      </div>

      <div className="seg" role="group" aria-label="ورود یا ساخت حساب">
        <button type="button" aria-pressed={mode === 'login'} onClick={() => setMode('login')}>
          ورود
        </button>
        <button type="button" aria-pressed={mode === 'signup'} onClick={() => setMode('signup')}>
          ساخت حساب
        </button>
      </div>

      <form className="stack" onSubmit={submit} noValidate>
        {mode === 'signup' && (
          <>
            <Field label="کد دعوت" hint="از کسی که شما رو دعوت کرده بگیرید.">
              {(p) => <input {...p} className="input" value={invite} onChange={(e) => setInvite(e.target.value)} autoComplete="off" required />}
            </Field>
            <Field label="اسمتون" hint="فقط برای خوش‌آمدگویی؛ هر چی دوست دارید.">
              {(p) => <input {...p} className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoComplete="nickname" maxLength={40} required />}
            </Field>
          </>
        )}
        <Field label="نام کاربری" hint={mode === 'signup' ? 'حروف انگلیسی، عدد، نقطه یا _؛ مثلاً sara_88' : undefined}>
          {(p) => (
            <input
              {...p}
              className="input ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              dir="ltr"
              required
            />
          )}
        </Field>
        <Field label="رمز" hint={mode === 'signup' ? 'دست‌کم ۶ کاراکتر' : undefined}>
          {(p) => (
            <input
              {...p}
              className="input ltr"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          )}
        </Field>
        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-block" disabled={busy} type="submit">
          {busy ? 'یه لحظه…' : mode === 'login' ? 'ورود' : 'ساختن حساب'}
        </button>
      </form>
      <p className="muted" style={{ fontSize: 14, textAlign: 'center' }}>
        {BRAND.name} یه ابزار سلامت عمومیه، نه توصیهٔ پزشکی.
      </p>
    </main>
  );
}
