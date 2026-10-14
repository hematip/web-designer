export interface User {
  username: string;
  displayName: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

/** Network failure (offline, server unreachable) — distinct from a server answer. */
export class NetworkError extends Error {}

export async function api<T>(path: string, body?: unknown, method?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: method ?? (body === undefined ? 'GET' : 'POST'),
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
    });
  } catch {
    throw new NetworkError('network');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.error || 'unknown');
  return json as T;
}

const AUTH_MESSAGES: Record<string, string> = {
  invite: 'کد دعوت درست نیست. کد رو از کسی که دعوتتون کرده بگیرید.',
  'signup-closed': 'فعلاً ثبت‌نام بسته‌ست.',
  username: 'نام کاربری باید ۳ تا ۲۴ حرف انگلیسی، عدد، نقطه یا _ باشه؛ مثلاً sara_88',
  displayName: 'اسمتون رو بنویسید تا بدونیم چی صداتون کنیم.',
  password: 'رمز باید دست‌کم ۶ کاراکتر باشه.',
  taken: 'این نام کاربری قبلاً گرفته شده؛ یکی دیگه امتحان کنید.',
  credentials: 'نام کاربری یا رمز درست نیست.',
  rate: 'تلاش‌ها زیاد شد. چند دقیقه دیگه دوباره امتحان کنید.',
};

export function errorMessage(e: unknown): string {
  if (e instanceof NetworkError) return 'به سرور وصل نشدیم. اینترنت رو چک کنید و دوباره امتحان کنید.';
  if (e instanceof ApiError) return AUTH_MESSAGES[e.code] ?? 'یه مشکلی در سرور پیش اومد. کمی بعد دوباره امتحان کنید.';
  return 'یه مشکل پیش‌بینی‌نشده پیش اومد.';
}
