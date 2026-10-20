// Homepage cinematic scenes (v2; formulation story v5). Every scene animates *from* states set here; the HTML is already the
// resolved composition, so reduced motion, no-JS and failures show complete content.
import { gsap, ScrollTrigger, SplitText, mm, MQ, getLenis } from './motion.js';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

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

// ---------------------------------------------------------------- Hero
mm.add(MQ.motion, () => {
  const hero = $('[data-hero]');
  if (!hero) return;
  const intro = gsap.from($$('[data-hero-in]', hero), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', delay: 0.35 });
  return () => intro.revert();
});

// ---------------------------------------------------------------- Hero film
// Silent, plays once and holds its last frame (no loop). A visible pause/play control covers WCAG 2.2.2.
// With reduced motion it never starts: the poster is the film's last frame.
{
  const video = $('[data-hero-film]');
  const toggle = $('[data-hero-film-toggle]');
  if (video && toggle) {
    const label = $('[data-label]', toggle);
    const sync = () => {
      const paused = video.paused;
      toggle.setAttribute('aria-pressed', String(paused));
      label.textContent = paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause;
    };
    toggle.addEventListener('click', () => {
      if (video.paused) { if (video.ended) video.currentTime = 0; video.play().catch(() => {}); }
      else video.pause();
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Phones get the 720p pair; WebM (VP9) first, MP4 (H.264) for Safari.
    if (window.matchMedia('(max-width: 56.24rem)').matches && video.dataset.src) {
      const base = video.dataset.src;
      video.querySelectorAll('source').forEach((el) => el.remove());
      [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([ext, type]) => {
        const el = document.createElement('source');
        el.src = `${base}-720.${ext}`; el.type = type; video.append(el);
      });
      video.load();
    }
    if (!reduce.matches) {
      toggle.hidden = false;
      video.play().then(sync).catch(() => sync());
    }
  }
}

// ---------------------------------------------------------------- Resin → K-Vie™ → capsule (3D)
// The pinned range scrubs one number. It decides which of the five chapters is read and where the 3D scene
// stands, so text and scene always change together and reverse scroll, fast skips and anchors resolve to the
// same frame. Each chapter plays its stage in the first part of its range and holds the resolved frame while it
// is read. Without WebGL (or before it loads) the static SVG capsule poster stays in place; with reduced motion
// the chapters are listed beside the scene's last frame.
const form = $('[data-form]');
const sceneState = { p: 0 };
// Scene range [from, to] played by each chapter: resin, micronized, microcrystalline,
// K-Vie™ (crystals condense), vegetarian capsule (the halves close, the capsule turns in the light).
const STAGES = [[0, 0.13], [0.13, 0.42], [0.42, 0.62], [0.62, 0.74], [0.74, 1]];
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
  if (!form || sceneLoad) return;
  sceneLoad = import('./formulation-3d.js')
    .then(({ createFormulationScene }) => {
      scene = createFormulationScene({
        section: form,
        canvas: $('[data-form-canvas]', form),
        frame: $('[data-form-frame]', form),
        state: sceneState,
        mode: sceneMode ?? 'static',
        onReady: () => form.classList.add('is-3d'),
        onFail: () => form.classList.remove('is-3d'),
      });
      ScrollTrigger.addEventListener('refresh', () => scene?.resize());
    })
    .catch(() => form.classList.remove('is-3d'));
}
if (form) {
  // Load the renderer well before the section is reached; the rest of the page never waits for it.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      loadScene();
    }
  }, { rootMargin: '150% 0px' });
  io.observe(form);
}

function buildFormulation(mobile) {
  if (!form) return null;
  const chapters = $$('.h-chapter', form);
  const rail = $$('[data-form-rail] span', form);
  const n = chapters.length;
  const from = (k) => k / n;
  const to = (k) => (k + 1) / n;
  const st = { t: 0 };
  let active = -1;

  const sync = () => {
    const t = st.t;
    const i = Math.min(n - 1, Math.floor(t * n));
    const [a, b] = STAGES[Math.min(i, STAGES.length - 1)];
    const local = ease(Math.min(1, Math.max(0, (t - from(i)) / ((to(i) - from(i)) * PLAY))));
    sceneState.p = a + (b - a) * local;
    if (i !== active) {
      active = i;
      chapters.forEach((c, k) => { c.dataset.state = k < i ? 'past' : k === i ? 'active' : 'future'; });
    }
    rail.forEach((r, k) => r.style.setProperty('--fill', Math.min(1, Math.max(0, (t - from(k)) * n)).toFixed(3)));
  };

  form.classList.add('is-scrubbing');
  setSceneMode(mobile ? 'mobile' : 'desktop');
  sync();
  const tween = gsap.to(st, {
    t: 1,
    ease: 'none',
    onUpdate: sync,
    scrollTrigger: {
      trigger: mobile ? $('[data-form-scene]', form) : $('[data-form-pin]', form),
      start: 'top top',
      end: mobile ? '+=400%' : '+=420%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Keyboard: focusing a link in a chapter that is not on screen scrolls to where that chapter is read.
  const onFocus = (e) => {
    const owner = e.target.closest('.h-chapter');
    if (!owner) return;
    const i = chapters.indexOf(owner);
    if (i === active) return;
    const trig = tween.scrollTrigger;
    const y = trig.start + (trig.end - trig.start) * (from(i) + (to(i) - from(i)) * 0.85);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };
  form.addEventListener('focusin', onFocus);

  return () => {
    form.removeEventListener('focusin', onFocus);
    form.classList.remove('is-scrubbing');
    chapters.forEach((c) => delete c.dataset.state);
    rail.forEach((r) => r.style.removeProperty('--fill'));
  };
}
mm.add(MQ.desktop, () => buildFormulation(false));
mm.add(MQ.mobile, () => buildFormulation(true));
mm.add('(prefers-reduced-motion: reduce)', () => {
  sceneState.p = 1;
  setSceneMode('static');
});

// ---------------------------------------------------------------- Who: four contexts move from contact sheet to focus
mm.add('(min-width: 64rem) and (min-height: 48rem) and (prefers-reduced-motion: no-preference)', () => {
  const section = $('[data-who-story]');
  if (!section) return;
  const gallery = $('[data-who-gallery]', section);
  const entries = $$('[data-who-entry]', section);
  const frames = $$('[data-who-frame]', section);
  if (!section || !gallery || frames.length !== entries.length || !entries.length) return;

  section.classList.add('is-story');
  let active = -2;
  let starts = [];
  const select = (next, animate) => {
    if (active === next) return;
    Flip.killFlipsOf(frames);
    const state = animate ? Flip.getState(frames) : null;
    gallery.classList.toggle('is-focused', next >= 0);
    frames.forEach((frame, i) => frame.classList.toggle('is-active', i === next));
    active = next;
    if (state) Flip.from(state, { duration: 0.75, ease: 'power3.inOut', absolute: true });
  };
  const sync = (animate = true) => {
    let next = -1;
    starts.forEach((start, i) => { if (window.scrollY >= start) next = i; });
    select(next, animate);
  };
  const story = ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'bottom top',
    onRefresh: () => {
      Flip.killFlipsOf(frames);
      starts = entries.map((entry) => entry.getBoundingClientRect().top + window.scrollY + entry.offsetHeight * 0.3 - window.innerHeight * 0.55);
      sync(false);
    },
    onUpdate: () => sync(),
  });
  ScrollTrigger.refresh();
  return () => {
    story.kill();
    Flip.killFlipsOf(frames);
    gsap.set(frames, { clearProps: 'all' });
    section.classList.remove('is-story');
    gallery.classList.remove('is-focused');
    frames.forEach((frame) => frame.classList.remove('is-active'));
  };
});

// ---------------------------------------------------------------- Closing: a visible, staged entrance into the conversation
mm.add(MQ.motion, () => {
  const panel = $('[data-close-appear]');
  if (!panel) return;
  const parts = [...$('.h-close__copy', panel).children];
  const bottle = $('.h-close__bottle', panel);
  const section = panel.closest('#closing');
  const entrance = gsap.timeline({ paused: true });
  entrance.from(panel, { opacity: 0, y: 64, scale: 0.97, duration: 1.2, ease: 'power3.out' }, 0);
  entrance.from(parts, { opacity: 0, y: 70, duration: 1.05, stagger: 0.22, ease: 'power3.out' }, 0.2);
  if (bottle) entrance.from(bottle, { opacity: 0, y: 120, scale: 0.86, duration: 1.45, ease: 'power3.out' }, 0.35);
  const revealForFocus = () => entrance.progress(1).pause();
  const playEntrance = () => panel.contains(document.activeElement) ? revealForFocus() : entrance.restart();
  const resetEntrance = () => {
    if (!panel.contains(document.activeElement)) entrance.pause(0);
  };
  // Reset only outside the viewport, so reverse scrolling never hides a visible panel.
  ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'bottom top',
    onLeave: resetEntrance, onLeaveBack: resetEntrance,
  });
  ScrollTrigger.create({
    trigger: section, start: 'top 60%', end: 'bottom top',
    onEnter: playEntrance, onEnterBack: playEntrance,
  });
  panel.addEventListener('focusin', revealForFocus);
  return () => panel.removeEventListener('focusin', revealForFocus);
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
