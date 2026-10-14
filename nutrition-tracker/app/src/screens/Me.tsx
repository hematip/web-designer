import { useEffect, useState } from 'react';
import { LogOut, Download, RefreshCw, Smartphone, KeyRound, Trash2, Pencil, Calculator } from 'lucide-react';
import { useStore, get, put, signOut, syncNow, getSyncState, pendingCount, getLastSyncAt, getUser, wipeLocal } from '../lib/store.ts';
import { planFor, settings, today, currentWeight } from '../lib/derive.ts';
import { clampBudget } from '../lib/calc.ts';
import { fa, faDigits } from '../lib/fa.ts';
import { openSheet } from '../lib/nav.ts';
import { exportCsv } from '../lib/export.ts';
import { api, errorMessage } from '../lib/api.ts';
import { canPrompt, isIosNonSafari, isStandalone, onInstallChange, platform, promptInstall } from '../lib/install.ts';
import { Sheet, closeSheet, toast, Field, NumInput, Switch } from '../ui/kit.tsx';
import { PlanExplain } from '../ui/PlanExplain.tsx';
import { Mascot } from '../ui/Mascot.tsx';
import { NOTE_TEXT } from './Onboarding.tsx';
import { BRAND } from '../brand.ts';
import type { Settings } from '../lib/types.ts';

export function Me() {
  useStore();
  const user = getUser();
  const profile = get('profile', 'me');
  const plan = planFor(today());
  const s = settings();
  const set = (patch: Partial<Settings>) => put('settings', 'me', { ...s, ...patch });
  const state = getSyncState();
  const last = getLastSyncAt();

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">من</h1>
      </header>

      <section className="card row" style={{ gap: 14 }}>
        <Mascot mood="wink" size={64} bob />
        <div>
          <p style={{ fontWeight: 800, fontSize: 18 }}>{user?.displayName}</p>
          <p className="muted" dir="ltr" style={{ textAlign: 'right' }}>
            @{user?.username}
          </p>
        </div>
      </section>

      {plan && profile && (
        <section className="card stack" aria-labelledby="plan-h">
          <h2 id="plan-h" className="card-title">
            برنامهٔ روزانه
          </h2>
          <p>
            <span className="result-big" style={{ fontSize: 34 }}>
              {fa(plan.budget)}
            </span>{' '}
            کالری {plan.manual && <span className="badge">دستی</span>}
          </p>
          <p className="muted">
            پروتئین {fa(plan.proteinG)} · کربوهیدرات {fa(plan.carbG)} · چربی {fa(plan.fatG)} گرم
          </p>
          {plan.notes.filter((n) => n !== 'katch-used').map((n) => (
            <p key={n} className="alert info">
              {NOTE_TEXT[n]}
            </p>
          ))}
          <PlanExplain plan={plan} goal={profile.goal} activity={profile.activity} weight={plan.weightKg} katch={plan.notes.includes('katch-used')} />
          <div className="row wrap" style={{ gap: 8 }}>
            <button type="button" className="btn btn-sm btn-chick" onClick={() => openSheet({ kind: 'plan' })}>
              <Pencil size={18} strokeWidth={2.6} /> به‌روزرسانی برنامه
            </button>
            <button type="button" className="btn btn-sm" onClick={() => openSheet({ kind: 'budget' })}>
              <Calculator size={18} strokeWidth={2.6} /> تغییر دستی بودجه
            </button>
          </div>
          <p className="muted" style={{ fontSize: 14 }}>
            وزنتون چند کیلو عوض شد؟ «به‌روزرسانی برنامه» رو بزنید تا بودجه با وزن جدید حساب بشه. روزهای قبل با برنامهٔ خودشون می‌مونن.
          </p>
        </section>
      )}

      <section className="card stack" aria-labelledby="set-h">
        <h2 id="set-h" className="card-title">
          تنظیمات
        </h2>
        <div className="row between" style={{ gap: 12 }}>
          <span>
            <b style={{ display: 'block' }}>کالری فعالیت به بودجه اضافه بشه</b>
            <small className="muted">خاموش: فعالیت فقط نمایش داده می‌شه.</small>
          </span>
          <Switch checked={s.addActivity} onChange={(v) => set({ addActivity: v })} label="کالری فعالیت به بودجه اضافه بشه" />
        </div>
        <Field label="هدف آب روزانه">
          {(p) => <NumInput {...p} value={s.waterGoal} onChange={(v) => v && v > 0 && v <= 20 && set({ waterGoal: Math.round(v) })} suffix="لیوان" />}
        </Field>
        <Field label="هدف گام روزانه">
          {(p) => <NumInput {...p} value={s.stepsGoal} onChange={(v) => v && v > 0 && v <= 50000 && set({ stepsGoal: Math.round(v) })} suffix="گام" />}
        </Field>
      </section>

      <section className="card stack" aria-labelledby="data-h">
        <h2 id="data-h" className="card-title">
          داده‌ها و همگام‌سازی
        </h2>
        <p className="muted">
          همه‌چیز اول روی همین دستگاه ذخیره می‌شه و بعد با حسابتون همگام می‌شه تا روی گوشی و کامپیوتر یکی باشه.
        </p>
        <p style={{ fontWeight: 700 }}>
          {state === 'offline'
            ? `آفلاین${pendingCount() ? `؛ ${fa(pendingCount())} ثبت منتظر اینترنت` : ''}`
            : state === 'auth'
              ? 'برای همگام‌سازی باید دوباره وارد بشید.'
              : pendingCount()
                ? `${fa(pendingCount())} ثبت هنوز همگام نشده`
                : last
                  ? `آخرین همگام‌سازی: ${faDigits(new Date(last).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }))}`
                  : 'همگام'}
        </p>
        <div className="row wrap" style={{ gap: 8 }}>
          <button type="button" className="btn btn-sm" onClick={() => void syncNow().then(() => toast(pendingCount() ? 'همگام‌سازی کامل نشد؛ بعداً دوباره امتحان می‌کنیم.' : 'همگام شد.'))}>
            <RefreshCw size={18} strokeWidth={2.6} /> همگام‌سازی الان
          </button>
          <button type="button" className="btn btn-sm" onClick={exportCsv}>
            <Download size={18} strokeWidth={2.6} /> خروجی CSV
          </button>
        </div>
      </section>

      <section className="card stack" aria-labelledby="acc-h">
        <h2 id="acc-h" className="card-title">
          اپ و حساب
        </h2>
        {!isStandalone() && (
          <button type="button" className="btn btn-block" onClick={() => openSheet({ kind: 'install' })}>
            <Smartphone size={18} strokeWidth={2.6} /> نصب روی صفحهٔ گوشی
          </button>
        )}
        <button type="button" className="btn btn-block" onClick={() => openSheet({ kind: 'password' })}>
          <KeyRound size={18} strokeWidth={2.6} /> تغییر رمز
        </button>
        <button
          type="button"
          className="btn btn-block"
          onClick={async () => {
            if (pendingCount() && !confirm('بعضی ثبت‌ها هنوز همگام نشدن و با خروج از این دستگاه پاک می‌شن. خارج بشید؟')) return;
            await signOut();
          }}
        >
          <LogOut size={18} strokeWidth={2.6} /> خروج از حساب
        </button>
        <button type="button" className="btn btn-block btn-ghost btn-danger" onClick={() => openSheet({ kind: 'delete-account' })}>
          <Trash2 size={18} strokeWidth={2.6} /> حذف حساب و همهٔ داده‌ها
        </button>
      </section>

      <p className="muted" style={{ fontSize: 13, textAlign: 'center', paddingBottom: 8 }}>
        {BRAND.name} · نسخهٔ آزمایشی برای جمع خانواده و دوستان. ابزار سلامت عمومی است، نه توصیهٔ پزشکی. اعداد غذاها و فعالیت‌ها تقریبی‌اند. اگر باردار هستید، شیر می‌دهید، دیابت یا بیماری کلیه دارید یا سابقهٔ اختلال خوردن دارید، پیش از هدف‌گذاری با پزشک مشورت کنید.
      </p>
    </div>
  );
}

// ================= Manual budget =================

export function BudgetSheet() {
  const d = today();
  const plan = planFor(d);
  const profile = get('profile', 'me');
  const [v, setV] = useState<number | null>(plan?.budget ?? null);
  if (!plan || !profile) return null;
  const clamped = v ? clampBudget(v, profile.sex) : null;
  return (
    <Sheet
      title="بودجهٔ دستی"
      footer={
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={!clamped}
          onClick={() => {
            const budget = clamped!;
            // Keep protein; rescale fat/carbs to the new budget.
            const fatG = Math.round(Math.max((budget * 0.28) / 9, 0) / 5) * 5;
            const carbG = Math.max(Math.round((budget - plan.proteinG * 4 - fatG * 9) / 4 / 5) * 5, 0);
            put('plan', d, { ...plan, from: d, budget, fatG, carbG, manual: true, weightKg: currentWeight() ?? plan.weightKg });
            closeSheet();
            toast('بودجهٔ جدید از امروز اعمال شد.');
          }}
        >
          ذخیره از امروز
        </button>
      }
    >
      <div className="stack">
        <p className="muted">اگه با متخصص برنامه دارید یا چند هفته روند وزن با بودجه نخونده، می‌تونید عدد رو دستی بذارید.</p>
        <Field label="بودجهٔ روزانه" hint={`حداقل امن برای شما ${fa(profile.sex === 'female' ? 1200 : 1500)} کالریه و کمتر از این ذخیره نمی‌شه.`}>
          {(p) => <NumInput {...p} value={v} onChange={setV} suffix="کالری" />}
        </Field>
        {clamped && v && clamped !== Math.round(v / 10) * 10 && <p className="alert info">ذخیره می‌شه: {fa(clamped)} کالری</p>}
      </div>
    </Sheet>
  );
}

// ================= Install guide =================

export function InstallSheet() {
  const [, force] = useState(0);
  useEffect(() => {
    const off = onInstallChange(() => force((x) => x + 1));
    return () => {
      off();
    };
  }, []);
  const p = platform();
  const s = settings();
  return (
    <Sheet
      title="نصب روی گوشی"
      footer={
        !s.installHidden && (
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => {
              put('settings', 'me', { ...s, installHidden: true });
              closeSheet();
            }}
          >
            دیگه یادآوری نکن
          </button>
        )
      }
    >
      <div className="stack">
        <div className="row" style={{ gap: 12 }}>
          <Mascot mood="yay" size={64} bob />
          <p style={{ fontWeight: 700 }}>با نصب، نخودچی مثل یه اپ واقعی تمام‌صفحه باز می‌شه و بدون اینترنت هم کار می‌کنه.</p>
        </div>
        {canPrompt() && (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={async () => {
              if (await promptInstall()) {
                closeSheet();
                toast('نصب شد! از صفحهٔ اصلی گوشی بازش کنید.');
              }
            }}
          >
            نصب نخودچی
          </button>
        )}
        {(p === 'ios' || p === 'other') && (
          <section className="card">
            <h3 className="card-title">آیفون و آیپد</h3>
            {isIosNonSafari() && <p className="alert info" style={{ margin: '8px 0' }}>این صفحه رو در Safari باز کنید؛ نصب از مرورگرهای دیگه روی آیفون ممکنه کار نکنه.</p>}
            <ol className="install-steps">
              <li>در Safari، دکمهٔ «اشتراک‌گذاری» (مربع با فلش رو به بالا) رو بزنید.</li>
              <li>پایین‌تر برید و «Add to Home Screen» یا «افزودن به صفحهٔ اصلی» رو بزنید.</li>
              <li>«Add» رو بزنید. نخودچی کنار بقیهٔ اپ‌ها ظاهر می‌شه.</li>
              <li>از همون آیکن باز کنید و یک بار دیگه وارد حسابتون بشید.</li>
            </ol>
          </section>
        )}
        {(p === 'android' || p === 'other') && (
          <section className="card">
            <h3 className="card-title">اندروید</h3>
            <ol className="install-steps">
              <li>در Chrome، منوی سه‌نقطه (⋮) بالای صفحه رو بزنید.</li>
              <li>«Add to Home screen» یا «Install app» رو بزنید.</li>
              <li>«Install» یا «Add» رو تأیید کنید.</li>
            </ol>
          </section>
        )}
      </div>
    </Sheet>
  );
}

// ================= Password =================

export function PasswordSheet() {
  const [oldPw, setOld] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Sheet title="تغییر رمز">
      <form
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          if (pw.length < 6) return setError('رمز جدید باید دست‌کم ۶ کاراکتر باشه.');
          setBusy(true);
          try {
            await api('/api/password', { oldPassword: oldPw, newPassword: pw });
            closeSheet();
            toast('رمز عوض شد.');
          } catch (err) {
            setError(errorMessage(err));
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="رمز فعلی">{(p) => <input {...p} className="input ltr" dir="ltr" type="password" autoComplete="current-password" value={oldPw} onChange={(e) => setOld(e.target.value)} />}</Field>
        <Field label="رمز جدید" hint="دست‌کم ۶ کاراکتر">
          {(p) => <input {...p} className="input ltr" dir="ltr" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />}
        </Field>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'یه لحظه…' : 'ذخیرهٔ رمز جدید'}
        </button>
      </form>
    </Sheet>
  );
}

// ================= Delete account =================

export function DeleteAccountSheet() {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Sheet title="حذف حساب">
      <form
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setBusy(true);
          try {
            await api('/api/account', { password: pw }, 'DELETE');
            await wipeLocal();
          } catch (err) {
            setError(errorMessage(err));
            setBusy(false);
          }
        }}
      >
        <div className="row" style={{ gap: 12 }}>
          <Mascot mood="wow" size={64} />
          <p style={{ fontWeight: 700 }}>حساب و همهٔ ثبت‌هاتون برای همیشه از سرور و این دستگاه پاک می‌شه و برنمی‌گرده.</p>
        </div>
        <p className="muted">اگه نسخه‌ای از داده‌ها می‌خواید، اول از «خروجی CSV» استفاده کنید.</p>
        <Field label="برای تأیید، رمزتون رو بنویسید">
          {(p) => <input {...p} className="input ltr" dir="ltr" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />}
        </Field>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button className="btn btn-block btn-danger" disabled={busy || !pw}>
          {busy ? 'در حال حذف…' : 'حذف همیشگی حساب'}
        </button>
      </form>
    </Sheet>
  );
}
