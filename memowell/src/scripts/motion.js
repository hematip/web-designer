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
  const delayOf = (el) => (el.dataset.split === 'load' ? 0.15 : 0);
  const splits = [];
  const cleanups = [];

  // Each text element gets one trigger, created once. A re-split (font load, width change) only rebuilds the paused
  // animation on the new units and carries its progress over; it never creates a ScrollTrigger mid-refresh, which can
  // break ScrollTrigger while a pinned scene is being measured.
  const staged = (el, { start = 'top 88%', onLoad = false, build }) => {
    let anim = null;
    let entered = onLoad;
    const run = () => { entered = true; anim?.play(); };
    if (!onLoad) cleanups.push(((t) => () => t.kill())(ScrollTrigger.create({ trigger: el, start, once: true, onEnter: run })));
    return (self) => {
      const progress = anim ? anim.progress() : 0;
      anim?.revert();
      anim = build(self).pause();
      if (progress > 0) anim.progress(progress);
      if (entered) anim.play();
    };
  };

  // 1. Headings: masked line rise; any .accent strokes are drawn in after the lines (h1/h2, plus anything data-split).
  const headings = new Set(document.querySelectorAll('[data-split], main h1, main h2'));
  headings.forEach((el) => {
    if (off(el) || interactive(el) || el.closest('.visually-hidden') || el.parentElement?.closest('[data-split]')) return headings.delete(el);
    if (!('split' in el.dataset)) el.dataset.split = '';
    const accents = el.querySelectorAll('.accent');
    splits.push(SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: staged(el, {
        onLoad: el.dataset.split === 'load',
        build: (self) => {
          const tl = gsap.timeline({ delay: delayOf(el) });
          tl.from(self.lines, { yPercent: 110, duration: 1.05, ease: 'expo.out', stagger: 0.09 });
          if (accents.length) {
            tl.fromTo(accents, { backgroundSize: '0% 0.04em, 0% 0.04em' },
              { backgroundSize: '100% 0.04em, 100% 0.04em', duration: 0.8, ease: 'power2.inOut', stagger: 0.1, clearProps: 'backgroundSize' }, '-=0.55');
          }
          return tl;
        },
      }),
    }));
  });

  // 2. Small headings (cards, list items): words rise and settle, quicker and quieter than section headings.
  document.querySelectorAll('main h3').forEach((el) => {
    if (off(el) || interactive(el) || headings.has(el)) return;
    splits.push(SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: staged(el, {
        start: 'top 92%',
        build: (self) => gsap.from(self.words, { yPercent: 60, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.035 }),
      }),
    }));
  });

  // 3. Introductions: the page-head lead (and anything marked data-text-lines) arrives line by line.
  //    aria: 'none' keeps paragraphs read as written; paragraphs with links stay whole and fade in.
  document.querySelectorAll('.page-head__lead > p, [data-text-lines]').forEach((el) => {
    if (off(el)) return;
    const onLoad = !!el.closest('.page-head');
    const delay = onLoad ? 0.45 : 0;
    if (interactive(el)) {
      staged(el, { start: 'top 90%', onLoad, build: () => gsap.from(el, { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', delay }) })();
      return;
    }
    splits.push(SplitText.create(el, {
      type: 'lines',
      aria: 'none',
      autoSplit: true,
      onSplit: staged(el, {
        start: 'top 90%',
        onLoad,
        build: (self) => gsap.from(self.lines, { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay }),
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

  // ---- Intro blocks [data-intro]: a heading and its copy enter as one staged sequence once the block is in view
  // (top at 75%): heading lines rise from a mask (accent strokes draw after), [data-intro-lines] paragraphs follow
  // line by line, a [data-intro-rule] draws in, [data-intro-part] items rise. Replays after leaving the view;
  // focus completes it. One trigger pair per block; a re-split only rebuilds the timeline (progress carried over).
  document.querySelectorAll('[data-intro]').forEach((block) => {
    const heading = block.querySelector('h1, h2');
    const lineEls = [...block.querySelectorAll('[data-intro-lines]')];
    const rule = block.querySelector('[data-intro-rule]');
    const parts = [...block.querySelectorAll('[data-intro-part]')];
    const accents = heading ? [...heading.querySelectorAll('.accent')] : [];
    let headLines = heading ? [heading] : [];
    let copyLines = lineEls;
    let tl = null;
    let state = 'idle'; // idle | playing | done
    const build = () => {
      const progress = tl ? tl.progress() : 0;
      tl?.revert(); // restore the targets' own styles first, so a new from() never starts from a hidden state
      tl = gsap.timeline({ paused: true });
      if (headLines.length) tl.from(headLines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0);
      if (accents.length) {
        tl.fromTo(accents, { backgroundSize: '0% 0.04em, 0% 0.04em' },
          { backgroundSize: '100% 0.04em, 100% 0.04em', duration: 0.8, ease: 'power2.inOut', clearProps: 'backgroundSize' }, 0.55);
      }
      if (copyLines.length) tl.from(copyLines, { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.35);
      if (rule) tl.from(rule, { scaleX: 0, duration: 1, ease: 'power2.inOut' }, 0.65);
      if (parts.length) tl.from(parts, { opacity: 0, y: 26, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.8);
      if (state !== 'idle') tl.progress(progress);
      if (state === 'playing') tl.play();
    };
    if (heading && !interactive(heading)) {
      splits.push(SplitText.create(heading, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) => { headLines = self.lines; build(); } }));
    }
    lineEls.forEach((el) => {
      if (interactive(el)) return;
      splits.push(SplitText.create(el, { type: 'lines', aria: 'none', autoSplit: true, onSplit: (self) => {
        copyLines = lineEls.flatMap((p) => (p === el ? self.lines : (p._introLines ?? [p])));
        el._introLines = self.lines;
        build();
      } }));
    });
    if (!tl) build();
    const play = () => { if (block.contains(document.activeElement)) { state = 'done'; tl.progress(1); return; } state = 'playing'; tl.restart(); };
    const reset = () => { if (!block.contains(document.activeElement)) { state = 'idle'; tl.pause(0); } };
    const settle = () => { state = 'done'; tl.progress(1).pause(); };
    const t1 = ScrollTrigger.create({ trigger: block, start: 'top 75%', end: 'bottom top', onEnter: play, onEnterBack: play });
    const t2 = ScrollTrigger.create({ trigger: block, start: 'top bottom', end: 'bottom top', onLeave: reset, onLeaveBack: reset });
    block.addEventListener('focusin', settle);
    cleanups.push(() => { t1.kill(); t2.kill(); tl?.kill(); block.removeEventListener('focusin', settle); });
  });

  // ---- Kondor glass panels (components/Glass.astro) ----
  // Each panel opens from a small seed into its resting shape as it enters the view (blur and veil come up with it),
  // its [data-glass-part] children rise inside it, and while it scrolls through the viewport the outline drifts towards a
  // second shape of the same family. One writer owns each clip path: `open` and `drift` combine into one shape.
  const numbers = (d) => (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  const toPath = (n) => {
    const f = (v) => +v.toFixed(4);
    let d = `M${f(n[0])} ${f(n[1])}`;
    for (let i = 2; i < n.length; i += 6) d += `C${n.slice(i, i + 6).map(f).join(' ')}`;
    return `${d}Z`;
  };
  document.querySelectorAll('[data-glass]').forEach((glass) => {
    const shape = document.getElementById(glass.dataset.glass)?.querySelector('[data-glass-shape]');
    if (!shape) return;
    const rest = numbers(shape.getAttribute('d'));
    const drift = numbers(shape.dataset.drift || '');
    if (rest.length < 8 || drift.length !== rest.length) return;
    const seed = rest.map((v, i) => (i % 2 ? 0.42 + (v - 0.5) * 0.22 : 0.3 + (v - 0.5) * 0.26));
    const st = { open: 0, drift: 0 };
    const render = () => shape.setAttribute('d', toPath(rest.map((r, i) => {
      const settled = r + (drift[i] - r) * st.drift * 1.6;
      return seed[i] + (settled - seed[i]) * st.open;
    })));
    const parts = glass.querySelectorAll('[data-glass-part]');
    // The panel opens once it is properly in view (top at 80%): the outline unfolds over ~1.8 s with an even
    // ease-out, so the growth is seen on screen rather than spent below the fold; the frost (--m: blur + veil) comes
    // up with it and the text follows after 0.3 s.
    const entrance = gsap.timeline({ paused: true, onUpdate: render });
    entrance.fromTo(st, { open: 0 }, { open: 1, duration: 1.8, ease: 'power1.out' }, 0);
    entrance.fromTo(glass, { '--m': 0 }, { '--m': 1, duration: 1.4, ease: 'sine.out' }, 0);
    if (parts.length) entrance.from(parts, { opacity: 0, y: 24, duration: 1, stagger: 0.1, ease: 'power2.out' }, 0.3);
    entrance.pause(0);
    render();
    const settle = () => entrance.progress(1).pause();
    const play = () => (glass.contains(document.activeElement) ? settle() : entrance.restart());
    const reset = () => { if (!glass.contains(document.activeElement)) entrance.pause(0); };
    // A panel inside a pinned scene ([data-pin-scene]) measures with that pin's spacing and opens once (a reset
    // there could fire while the scene is held on screen). Elsewhere it resets out of view and plays again on return.
    const pinnedContainer = glass.closest('[data-pin-scene]') || undefined;
    const triggers = [ScrollTrigger.create({ trigger: glass, pinnedContainer, start: 'top 80%', end: 'bottom top', once: !!pinnedContainer, onEnter: play, onEnterBack: play })];
    if (!pinnedContainer) triggers.push(ScrollTrigger.create({ trigger: glass, start: 'top bottom', end: 'bottom top', onLeave: reset, onLeaveBack: reset }));
    // While it scrolls through the view the outline keeps morphing and the panel drifts a little against the page,
    // so a settled panel is never frozen.
    const drifting = gsap.to(st, { drift: 1, ease: 'none', onUpdate: render, scrollTrigger: { trigger: glass, pinnedContainer, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    const floating = pinnedContainer ? null : gsap.fromTo(glass, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: glass, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    glass.addEventListener('focusin', settle);
    cleanups.push(() => {
      glass.removeEventListener('focusin', settle);
      triggers.forEach((t) => t.kill()); entrance.kill(); drifting.scrollTrigger?.kill(); drifting.kill();
      if (floating) { floating.scrollTrigger?.kill(); floating.kill(); gsap.set(glass, { clearProps: 'transform' }); }
      glass.style.removeProperty('--m');
      gsap.set(parts, { clearProps: 'opacity,transform' });
      shape.setAttribute('d', toPath(rest));
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
