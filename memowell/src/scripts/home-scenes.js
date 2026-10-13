// Homepage cinematic scenes (v2; hero v4). Every scene animates *from* states set here; the HTML is already the
// resolved composition, so reduced motion, no-JS and failures show complete content.
import { gsap, ScrollTrigger, SplitText, mm, MQ, getLenis } from './motion.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------------------------------------------------------------- Scroll-linked fact band
mm.add(MQ.motion, () => {
  const track = $('[data-marquee]');
  if (!track) return;
  gsap.fromTo(track, { xPercent: 0 }, {
    xPercent: -33.333, ease: 'none',
    scrollTrigger: { trigger: track.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  });
});

// ---------------------------------------------------------------- Hero (v4): resin → K-Vie™ → capsule
// The pinned hero scrubs one number. It decides which chapter is read (the approved hero first, then the
// five formulation chapters) and where the 3D scene stands, so text and scene always change together and
// reverse scroll, fast skips and anchors resolve to the same frame. Each chapter plays its stage of the scene
// in the first part of its range and holds the resolved frame while it is read.
// Without WebGL (or before it loads) the static SVG capsule poster stays in place; with reduced motion the
// hero is the resolved composition (intro, capsule, the five chapters listed) and the scene shows its last frame.
const hero = $('[data-hero]');
const sceneState = { p: 0 };
// Scene range [from, to] played by each chapter: 0 intro (resin), 1 resin, 2 micronized, 3 microcrystalline,
// 4 K-Vie™ (crystals condense), 5 vegetarian capsule (the halves close, the capsule turns in the light).
const HERO_SCENE = [[0, 0.05], [0.05, 0.13], [0.13, 0.42], [0.42, 0.62], [0.62, 0.74], [0.74, 1]];
const PLAY = 0.7; // share of a chapter's range that plays its stage; the rest holds for reading
const ease = (x) => x * x * (3 - 2 * x);
let sceneMode = null;
let scene = null;
let sceneLoad = null;

function setSceneMode(mode) {
  sceneMode = mode;
  scene?.setMode(mode);
}
function loadScene() {
  if (!hero || sceneLoad) return;
  sceneLoad = import('./formulation-3d.js')
    .then(({ createFormulationScene }) => {
      scene = createFormulationScene({
        section: hero,
        canvas: $('[data-form-canvas]', hero),
        frame: $('[data-form-frame]', hero),
        state: sceneState,
        mode: sceneMode ?? 'static',
        onReady: () => hero.classList.add('is-3d'),
        onFail: () => hero.classList.remove('is-3d'),
      });
      ScrollTrigger.addEventListener('refresh', () => scene?.resize());
    })
    .catch(() => hero.classList.remove('is-3d'));
}
if (hero) {
  // The scene is the first thing on the page, but it never blocks it: load once the browser is idle.
  const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 400));
  idle(loadScene, { timeout: 1500 });
}

function buildHero(mobile) {
  if (!hero) return null;
  const intro = $('.h-hero__intro', hero);
  const chapters = $$('.h-chapter', hero);
  const rail = $$('[data-hero-rail] span', hero);
  // Chapter starts as fractions of the pinned range. Desktop: the intro is chapter 0 in the same cell.
  // Phone: the intro reads in flow above, so the pinned scene tells chapters 1–5 only.
  const n = chapters.length;
  const starts = mobile
    ? [0, ...chapters.map((_, k) => k / n)]
    : JSON.parse(hero.dataset.chapters || '[0]');
  const from = (i) => (mobile && i === 0 ? -Infinity : starts[i]);
  const to = (i) => (i + 1 < starts.length ? starts[i + 1] : 1);
  const st = { t: 0 };
  let active = -1;

  const sync = () => {
    const t = st.t;
    let i = mobile ? 1 : 0;
    for (let k = i; k < starts.length; k++) if (t >= from(k)) i = k;
    // Scene: play this chapter's stage, then hold it.
    const [a, b] = HERO_SCENE[Math.min(i, HERO_SCENE.length - 1)];
    const span = to(i) - Math.max(0, from(i));
    const local = span > 0 ? ease(Math.min(1, (t - Math.max(0, from(i))) / (span * PLAY))) : 1;
    sceneState.p = a + (b - a) * Math.max(0, local);
    // Text
    if (i !== active) {
      active = i;
      if (!mobile) hero.classList.toggle('is-story', i > 0);
      chapters.forEach((c, k) => { c.dataset.state = k + 1 < i ? 'past' : k + 1 === i ? 'active' : 'future'; });
    }
    rail.forEach((r, k) => {
      const f = Math.min(1, Math.max(0, (t - from(k + 1)) / (to(k + 1) - from(k + 1))));
      r.style.setProperty('--fill', f.toFixed(3));
    });
  };

  hero.classList.add('is-scrubbing');
  setSceneMode(mobile ? 'mobile' : 'desktop');
  sync();
  const tween = gsap.to(st, {
    t: 1,
    ease: 'none',
    onUpdate: sync,
    scrollTrigger: {
      trigger: mobile ? $('[data-hero-scene]', hero) : $('[data-hero-pin]', hero),
      start: 'top top',
      end: mobile ? '+=400%' : '+=460%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Keyboard: focusing a link in a chapter that is not on screen scrolls to where that chapter is read.
  const onFocus = (e) => {
    const owner = e.target.closest('[data-chapter]');
    if (!owner) return;
    const i = Number(owner.dataset.chapter);
    if (i === active || (mobile && i === 0)) return;
    const trig = tween.scrollTrigger;
    const at = Math.max(0, from(i)) + (to(i) - Math.max(0, from(i))) * 0.85;
    const y = trig.start + (trig.end - trig.start) * at;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };
  hero.addEventListener('focusin', onFocus);

  // Intro: the approved hero rises in on load.
  const introIn = gsap.from($$('[data-hero-in]', intro), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', delay: 0.35 });

  return () => {
    hero.removeEventListener('focusin', onFocus);
    introIn.revert();
    hero.classList.remove('is-scrubbing', 'is-story');
    chapters.forEach((c) => delete c.dataset.state);
    rail.forEach((r) => r.style.removeProperty('--fill'));
  };
}
mm.add(MQ.desktop, () => buildHero(false));
mm.add(MQ.mobile, () => buildHero(true));
mm.add('(prefers-reduced-motion: reduce)', () => {
  sceneState.p = 1;
  setSceneMode('static');
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
