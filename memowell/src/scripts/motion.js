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
  // Masked line reveal for headings marked data-split (whole words/lines; never Arabic letters).
  document.querySelectorAll('[data-split]').forEach((el) => {
    if (el.closest('[lang="ar"]') && !el.closest('[lang="en"]')) return;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.05, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: el.dataset.split === 'load' ? undefined : { trigger: el, start: 'top 88%', once: true },
        delay: el.dataset.split === 'load' ? 0.15 : 0,
      }),
    });
  });

  // Batched rise-in for blocks marked data-reveal.
  const items = gsap.utils.toArray('[data-reveal]');
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
  return () => cleanups.forEach((fn) => fn());
});

// Refresh geometry once fonts and images have settled.
const refresh = () => ScrollTrigger.refresh();
document.fonts?.ready.then(refresh);
window.addEventListener('load', refresh);
