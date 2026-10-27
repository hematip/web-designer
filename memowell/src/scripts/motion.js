// Motion core: one Lenis instance driven by the GSAP ticker, ScrollTrigger and SplitText.
// Content is complete in HTML; everything here only animates *from* hidden states while motion is allowed.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis = null;
const tick = (time) => lenis?.raf(time * 1000);

function startLenis() {
  if (lenis || reduce.matches) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 0.95, syncTouch: false, anchors: { offset: -110 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}
function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}
startLenis();
reduce.addEventListener('change', () => (reduce.matches ? stopLenis() : startLenis()));

export const mm = gsap.matchMedia();
export const MQ = {
  desktop: '(min-width: 56.25rem) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 56.24rem) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
};
export { gsap, ScrollTrigger, SplitText };
export const getLenis = () => lenis;

// ---- Shared, site-wide effects ----------------------------------------------------------
mm.add(MQ.motion, () => {
  // ---- Text motion (site-wide) ----
  // One splitter per text subtree, whole lines and words only (never letters, so Arabic shaping and joins are kept).
  // Scenes with their own text performance opt out with data-text-motion="off". Text containing links or controls is
  // never split. Everything starts from the readable HTML and only animates *from* hidden states.
  const off = (el) => el.closest('[data-text-motion="off"]');
  const interactive = (el) => el.querySelector('a, button, input, select, textarea, [tabindex]');
  const scrollAt = (el, start = 'top 88%') => (el.dataset.split === 'load' ? undefined : { trigger: el, start, once: true });
  const delayOf = (el) => (el.dataset.split === 'load' ? 0.15 : 0);
  const splits = [];

  // 1. Headings: masked line rise; any .accent strokes are drawn in after the lines (h1/h2, plus anything data-split).
  const headings = new Set(document.querySelectorAll('[data-split], main h1, main h2'));
  headings.forEach((el) => {
    if (off(el) || interactive(el) || el.closest('.visually-hidden') || el.parentElement?.closest('[data-split]')) return headings.delete(el);
    if (!('split' in el.dataset)) el.dataset.split = '';
    splits.push(SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        const tl = gsap.timeline({ scrollTrigger: scrollAt(el), delay: delayOf(el) });
        tl.from(self.lines, { yPercent: 110, duration: 1.05, ease: 'expo.out', stagger: 0.09 });
        const accents = el.querySelectorAll('.accent');
        if (accents.length) {
          tl.fromTo(accents, { backgroundSize: '0% 0.04em, 0% 0.04em' },
            { backgroundSize: '100% 0.04em, 100% 0.04em', duration: 0.8, ease: 'power2.inOut', stagger: 0.1, clearProps: 'backgroundSize' }, '-=0.55');
        }
        return tl;
      },
    }));
  });

  // 2. Small headings (cards, list items): words rise and settle, quicker and quieter than section headings.
  document.querySelectorAll('main h3').forEach((el) => {
    if (off(el) || interactive(el) || headings.has(el)) return;
    splits.push(SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.words, {
        yPercent: 60, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.035, scrollTrigger: scrollAt(el, 'top 92%'),
      }),
    }));
  });

  // 3. Introductions: the page-head lead (and anything marked data-text-lines) arrives line by line.
  //    aria: 'none' keeps paragraphs read as written; paragraphs with links stay whole and fade in.
  document.querySelectorAll('.page-head__lead > p, [data-text-lines]').forEach((el) => {
    if (off(el)) return;
    const onLoad = !!el.closest('.page-head');
    if (interactive(el)) {
      gsap.from(el, { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', delay: onLoad ? 0.45 : 0, scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 90%', once: true } });
      return;
    }
    splits.push(SplitText.create(el, {
      type: 'lines',
      aria: 'none',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        delay: onLoad ? 0.45 : 0, scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 90%', once: true },
      }),
    }));
  });

  // 4. Display statements: words brighten as they are read (scrubbed); unread words stay legible at 30%.
  document.querySelectorAll('[data-text-emphasis], main article blockquote p').forEach((el) => {
    if (off(el) || interactive(el)) return;
    const split = SplitText.create(el, { type: 'words', aria: 'none' });
    splits.push(split);
    gsap.from(split.words, {
      opacity: 0.3, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.5 },
    });
  });

  // Batched rise-in for blocks marked data-reveal.
  const items = gsap.utils.toArray('[data-reveal]').filter((el) => !headings.has(el));
  gsap.set(items, { autoAlpha: 0, y: 46 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, overwrite: true }),
  });

  // Aurora glow follows the pointer (fine pointers only); no autonomous looping motion.
  const cleanups = [];
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.aurora[data-pointer]').forEach((el) => {
      const state = { x: 72, y: 38 };
      const setX = gsap.quickTo(state, 'x', { duration: 1.6, ease: 'power3.out', onUpdate: () => el.style.setProperty('--ax', `${state.x}%`) });
      const setY = gsap.quickTo(state, 'y', { duration: 1.6, ease: 'power3.out', onUpdate: () => el.style.setProperty('--ay', `${state.y}%`) });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        setX(55 + ((e.clientX - r.left) / r.width) * 30);
        setY(25 + ((e.clientY - r.top) / r.height) * 30);
      };
      el.addEventListener('pointermove', move);
      cleanups.push(() => el.removeEventListener('pointermove', move));
    });
  }
  return () => { cleanups.forEach((fn) => fn()); splits.forEach((split) => split.revert()); };
});

// Refresh geometry once fonts and images have settled.
const refresh = () => ScrollTrigger.refresh();
document.fonts?.ready.then(refresh);
window.addEventListener('load', refresh);
