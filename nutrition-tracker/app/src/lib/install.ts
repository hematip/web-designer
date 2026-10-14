// Add-to-Home-Screen helpers. iOS Safari has no install prompt, so we show steps;
// Chromium-based Android browsers fire `beforeinstallprompt`, which we keep for a button.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const subs = new Set<() => void>();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e as BeforeInstallPromptEvent;
  subs.forEach((f) => f());
});
window.addEventListener('appinstalled', () => {
  deferred = null;
  subs.forEach((f) => f());
});

export function onInstallChange(f: () => void) {
  subs.add(f);
  return () => subs.delete(f);
}

export const canPrompt = () => deferred !== null;

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  return outcome === 'accepted';
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
}

export function platform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export function isIosNonSafari(): boolean {
  return platform() === 'ios' && /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
}
