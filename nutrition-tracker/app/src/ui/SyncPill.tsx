import { Cloud, CloudOff, RefreshCw, CircleAlert } from 'lucide-react';
import { getSyncState, pendingCount, syncNow, useStore } from '../lib/store.ts';
import { fa } from '../lib/fa.ts';

/** Honest sync status: data is always saved on this device first. */
export function SyncPill() {
  useStore();
  const state = getSyncState();
  const pending = pendingCount();
  let icon = <Cloud size={16} strokeWidth={2.6} />;
  let text = 'ذخیره شد';
  if (state === 'offline' || !navigator.onLine) {
    icon = <CloudOff size={16} strokeWidth={2.6} />;
    text = pending ? `آفلاین · ${fa(pending)} در صف` : 'آفلاین';
  } else if (state === 'error' || state === 'auth') {
    icon = <CircleAlert size={16} strokeWidth={2.6} />;
    text = pending ? `${fa(pending)} ثبت همگام نشد` : 'همگام نشد';
  } else if (state === 'syncing' || pending) {
    icon = <RefreshCw size={16} strokeWidth={2.6} />;
    text = 'همگام‌سازی…';
  }
  const label =
    state === 'offline'
      ? 'اینترنت در دسترس نیست. ثبت‌ها روی همین دستگاه ذخیره شده و بعداً همگام می‌شن.'
      : state === 'auth'
        ? 'برای همگام‌سازی باید دوباره وارد بشید.'
        : `وضعیت همگام‌سازی: ${text}. برای همگام‌سازی دوباره بزنید.`;
  return (
    <button type="button" className="sync-pill" onClick={() => void syncNow()} aria-label={label} title={label}>
      {icon}
      <span>{text}</span>
    </button>
  );
}
