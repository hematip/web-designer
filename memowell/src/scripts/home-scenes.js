// Homepage cinematic scenes (v2). Every scene animates *from* states set here; the HTML is already the
// resolved composition, so reduced motion, no-JS and failures show complete content.
import { gsap, ScrollTrigger, SplitText, mm, MQ } from './motion.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------------------------------------------------------------- Hero
mm.add(MQ.motion, () => {
  const hero = $('[data-hero]');
  if (!hero) return;
  const bottle = $('.h-bottle', hero);
  const capsule = $('[data-hero-capsule] svg', hero);
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('[data-hero-orbits]', { rotate: -35, scale: 0.85, autoAlpha: 0, duration: 2.2, transformOrigin: '50% 50%' }, 0)
    .from('.h-glow', { scale: 0.5, autoAlpha: 0, duration: 2 }, 0)
    .from(bottle, { yPercent: 18, scale: 0.9, autoAlpha: 0, duration: 1.8 }, 0.15)
    .from('[data-hero-in]', { y: 34, autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 0.45)
    .from('[data-hero-chip]', { y: 24, scale: 0.85, autoAlpha: 0, duration: 1.1, stagger: 0.14 }, 0.9)
    .from(capsule, { y: -80, rotate: -90, autoAlpha: 0, duration: 1.6, ease: 'back.out(1.6)' }, 1.0);

  // Depth on the way out: copy lifts away fastest, bottle slower, capsule drops toward the next chapter.
  const out = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
  out
    .to('.h-hero__copy', { yPercent: -18, autoAlpha: 0.15, ease: 'none' }, 0)
    .to('[data-hero-bottle]', { yPercent: -14, scale: 0.92, ease: 'none' }, 0)
    .to('[data-hero-orbits]', { rotate: 50, scale: 1.12, ease: 'none' }, 0)
    .to('[data-hero-capsule]', { yPercent: 260, rotate: 130, ease: 'none' }, 0);
});

// ---------------------------------------------------------------- Scroll-linked fact band
mm.add(MQ.motion, () => {
  const track = $('[data-marquee]');
  if (!track) return;
  gsap.fromTo(track, { xPercent: 0 }, {
    xPercent: -33.333, ease: 'none',
    scrollTrigger: { trigger: track.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  });
});

// ---------------------------------------------------------------- Resin → K-Vie™ → capsule (3D, v3)
// The pinned scroll range scrubs one number (formState.p). The lazily loaded WebGL scene and the chapter
// captions both read it, so reverse scroll, fast skips and anchor entry resolve to the same frame.
// Without WebGL (or before it loads) the static SVG capsule poster stays in place.
const form = $('[data-form]');
const formState = { p: 0 };
let formMode = null;
let formScene = null;
let formLoad = null;

function setFormMode(mode) {
  formMode = mode;
  formScene?.setMode(mode);
}
function loadFormScene() {
  if (!form || formLoad) return;
  formLoad = import('./formulation-3d.js')
    .then(({ createFormulationScene }) => {
      formScene = createFormulationScene({
        section: form,
        canvas: $('[data-form-canvas]', form),
        frame: $('[data-form-frame]', form),
        state: formState,
        mode: formMode ?? 'static',
        onReady: () => form.classList.add('is-3d'),
        onFail: () => form.classList.remove('is-3d'),
      });
      ScrollTrigger.addEventListener('refresh', () => formScene?.resize());
    })
    .catch(() => form.classList.remove('is-3d'));
}
if (form) {
  // Load the renderer shortly before the chapter is reached; the rest of the page never waits for it.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      loadFormScene();
    }
  }, { rootMargin: '150% 0px' });
  io.observe(form);
}

function buildFormulation(mobile) {
  if (!form) return null;
  const labels = $$('[data-form-label]', form);
  const rail = $('[data-form-rail]', form);
  const bounds = JSON.parse(form.dataset.chapters || '[0]');
  let active = -1;
  const sync = () => {
    const p = formState.p;
    let i = 0;
    bounds.forEach((b, k) => { if (p >= b) i = k; });
    if (i !== active) {
      labels.forEach((l, k) => l.classList.toggle('is-active', k === i));
      active = i;
    }
    rail?.style.setProperty('--p', p.toFixed(4));
  };
  form.classList.add('is-scrubbing');
  setFormMode(mobile ? 'mobile' : 'desktop');
  sync();
  gsap.to(formState, {
    p: 1,
    ease: 'none',
    onUpdate: sync,
    scrollTrigger: {
      trigger: mobile ? $('[data-form-stage]', form) : $('[data-form-pin]', form),
      start: 'top top',
      end: mobile ? '+=240%' : '+=340%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  return () => {
    form.classList.remove('is-scrubbing');
    labels.forEach((l) => l.classList.remove('is-active'));
  };
}
mm.add(MQ.desktop, () => buildFormulation(false));
mm.add(MQ.mobile, () => buildFormulation(true));
mm.add('(prefers-reduced-motion: reduce)', () => {
  formState.p = 1;
  setFormMode('static');
});

// ---------------------------------------------------------------- Who: horizontal track (desktop)
mm.add(MQ.desktop, () => {
  const section = $('[data-who]');
  const track = $('[data-who-track]');
  if (!section || !track) return;
  section.classList.add('is-horizontal');
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: { trigger: $('[data-who-pin]', section), start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 },
  });
  gsap.from($$('.h-who__card', track), {
    y: 60, rotate: (i) => (i % 2 ? 3 : -3), autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  });
  ScrollTrigger.refresh();
  return () => { section.classList.remove('is-horizontal'); tween.kill(); };
});
mm.add(MQ.mobile, () => {
  gsap.from('.h-who__card', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '[data-who-track]', start: 'top 85%', once: true } });
});

// ---------------------------------------------------------------- Evidence: the sentence lights up
mm.add(MQ.motion, () => {
  const block = $('[data-highlight] p');
  if (!block) return;
  const split = SplitText.create(block, { type: 'words', tag: 'span', aria: 'none' });
  const words = split.words;
  gsap.set(words, { color: '#8a93c7' });
  gsap.to(words, {
    color: (i, el) => (el.closest('mark') ? '#19d3e2' : '#ffffff'),
    ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: block, start: 'top 82%', end: 'bottom 52%', scrub: 0.5 },
  });
  return () => split.revert();
});

// ---------------------------------------------------------------- Directions: one capsule → three meals
mm.add(MQ.motion, () => {
  const stage = $('[data-dir-stage]');
  if (!stage) return;
  const plates = $$('[data-dir-plate]', stage);
  const caps = $$('[data-dir-cap]', stage);
  const center = (el) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; };
  const offsetToMiddle = (i) => center(caps[1]) - center(caps[i]);
  const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 85%', end: 'center 45%', scrub: 0.7, invalidateOnRefresh: true } });
  tl.from(plates, { scale: 0.6, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.6)' }, 0)
    .fromTo(caps, { x: (i) => offsetToMiddle(i), y: -170, scale: 1.25, autoAlpha: (i) => (i === 1 ? 1 : 0) }, { autoAlpha: 1, duration: 0.25 }, 0.2)
    .to(caps, { x: 0, duration: 0.6, ease: 'power2.out' }, 0.55)
    .to(caps, { y: 0, scale: 1, duration: 0.55, ease: 'power3.in', stagger: 0.12 }, 1.05)
    .to(plates, { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1, stagger: 0.12 }, 1.5);
});
