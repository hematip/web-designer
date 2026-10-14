import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { fa, faDigits, parseNum } from '../lib/fa.ts';
import { closeSheet } from '../lib/nav.ts';
export { closeSheet };

// ---------- Sheet (modal dialog) ----------

export function Sheet({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const el = ref.current;
    const target = el?.querySelector<HTMLElement>('[data-autofocus]') || el;
    target?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeSheet();
      }
      if (e.key === 'Tab' && el) {
        const items = el.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select, textarea, a[href], summary');
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    el?.addEventListener('keydown', onKey);
    return () => {
      el?.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeSheet()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} tabIndex={-1}>
        <div className="sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn" onClick={closeSheet} aria-label="بستن">
            <X size={22} strokeWidth={2.6} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Toast ----------

type ToastMsg = { id: number; text: string; action?: { label: string; run: () => void } };
let toastListener: ((t: ToastMsg | null) => void) | null = null;
let toastId = 0;

export function toast(text: string, action?: ToastMsg['action']) {
  toastListener?.({ id: ++toastId, text, action });
}

export function ToastHost() {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  useEffect(() => {
    toastListener = setMsg;
    return () => {
      toastListener = null;
    };
  }, []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), msg.action ? 5000 : 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <div aria-live="polite" role="status">
      {msg && (
        <div className="toast" key={msg.id}>
          <span className="grow">{msg.text}</span>
          {msg.action && (
            <button
              type="button"
              onClick={() => {
                msg.action!.run();
                setMsg(null);
              }}
            >
              {msg.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Fields ----------

export function Field({
  label,
  hint,
  error,
  children,
  id,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode;
  id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={fid}>{label}</label>
      {children({ id: fid, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && (
        <span className="hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="error" id={errId}>
          {error}
        </span>
      )}
    </div>
  );
}

/** Text input that accepts Persian/Arabic/Latin digits; shows Persian digits. */
export function NumInput({
  value,
  onChange,
  suffix,
  placeholder,
  ...rest
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  suffix?: string;
  placeholder?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState(value == null ? '' : faDigits(String(value)).replace('.', '٫'));
  const last = useRef(value);
  useEffect(() => {
    if (value !== last.current) {
      setText(value == null ? '' : faDigits(String(value)).replace('.', '٫'));
      last.current = value;
    }
  }, [value]);
  return (
    <div className="input-wrap">
      <input
        className="input num"
        inputMode="decimal"
        autoComplete="off"
        enterKeyHint="done"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          const v = parseNum(raw);
          last.current = v;
          onChange(v);
        }}
        style={suffix ? { paddingInlineEnd: 64 } : undefined}
        {...rest}
      />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  step = 0.5,
  min = 0.25,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  label: string;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="icon-btn" aria-label="کمتر" onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}>
        <Minus size={20} strokeWidth={2.8} />
      </button>
      <NumInput value={value} onChange={(v) => v != null && v > 0 && onChange(v)} aria-label={label} />
      <button type="button" className="icon-btn" aria-label="بیشتر" onClick={() => onChange(Math.round((value + step) * 100) / 100)}>
        <Plus size={20} strokeWidth={2.8} />
      </button>
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export function Kcal({ v }: { v: number }) {
  return <>{fa(v)} کالری</>;
}
