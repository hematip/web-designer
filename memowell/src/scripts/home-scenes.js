// Homepage cinematic scenes (v2; formulation story v5). Every scene animates *from* states set here; the HTML is already the
// resolved composition, so reduced motion, no-JS and failures show complete content.
import { gsap, ScrollTrigger, SplitText, mm, MQ, getLenis } from './motion.js';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------------------------------------------------------------- Hero
// Resolves when the hero entrance has settled (or there is none); heavy work such as the 3D scene waits for it.
let heroSettled;
const heroDone = new Promise((resolve) => { heroSettled = resolve; });
setTimeout(() => heroSettled(), 5000);
if (!window.matchMedia(MQ.motion).matches || !$('[data-hero]')) heroSettled();

// Text performance (film "the wall of names"): the question rises line by line, but "names" arrives a beat late,
// the way a name does; then the answer follows word by word and "someone you love" is underlined. No blur or
// fog-to-clarity effect. The HTML is the settled composition: reduced motion and no-JS show it as is, and focusing
// anything in the hero completes the sequence so no action is ever waiting behind an entrance.
mm.add(MQ.motion, () => {
  const hero = $('[data-hero]');
  if (!hero) return;
  const title = $('[data-hero-title]', hero);
  const word = $('.accent', title);
  const statement = $('[data-hero-statement]', hero);
  const love = $('.h-hero__love', statement);
  const rest = $$('[data-hero-in]', hero);
  const meta = $('.h-hero__meta', hero);
  let tl = null;
  let lines = null, words = null;

  // Back to the settled HTML state (units stay split; only the entrance's inline values are removed).
  const reset = () => {
    tl?.kill();
    tl = null;
    word?.classList.remove('is-reaching');
    gsap.set([...(lines ?? []), ...(words ?? []), word, ...rest].filter(Boolean), { clearProps: 'opacity,visibility,transform,translate' });
    love?.style.removeProperty('--love');
    meta?.style.removeProperty('--rule');
  };
  const settle = () => { reset(); heroSettled(); };

  const play = () => {
    tl = gsap.timeline({ delay: 0.1, onComplete: settle });
    tl.from(lines, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0);
    if (word) {
      tl.fromTo(word, { autoAlpha: 0, y: '0.32em' }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', immediateRender: true }, 0.8)
        .call(() => word.classList.add('is-reaching'), null, 0.35)
        .call(() => word.classList.remove('is-reaching'), null, 1.2);
    }
    tl.from(words, { yPercent: 105, duration: 0.7, ease: 'expo.out', stagger: 0.035 }, 1.15);
    if (love) tl.fromTo(love, { '--love': '0%' }, { '--love': '100%', duration: 0.8, ease: 'power2.inOut', immediateRender: true }, '>-0.2');
    if (meta) tl.fromTo(meta, { '--rule': 0 }, { '--rule': 1, duration: 0.9, ease: 'power3.inOut', immediateRender: true }, 1.45);
    // Opacity only (no visibility), so links stay focusable during the entrance.
    tl.from(rest, { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 1.6);
    // From-states are rendered now, in this same frame, so the CSS pre-hide can lift without a flash.
    hero.classList.add('is-playing');
  };

  // One splitter per subtree: masked lines for the question, masked words for the statement. The entrance plays
  // once. A re-split during it (width change, e.g. a scrollbar appearing) rebuilds it at the same moment on the new
  // units; a re-split after it changes nothing visible.
  let played = false;
  const ready = () => {
    if (!lines || !words) return;
    if (!played) { played = true; play(); return; }
    if (!tl) return reset();
    const at = tl.totalTime();
    reset();
    play();
    tl.totalTime(at, true);
  };
  // Split once the fonts are in, so the first measurement is final and the entrance is not cut short.
  let titleSplit = null, statementSplit = null, live = true;
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    if (!live) return;
    titleSplit = SplitText.create(title, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) => { lines = self.lines; ready(); } });
    statementSplit = SplitText.create(statement, { type: 'words', mask: 'words', tag: 'span', aria: 'none', autoSplit: true, onSplit: (self) => {
      // Span units (valid inside the paragraph) need inline-block so their transform applies.
      gsap.set([...self.masks, ...self.words], { display: 'inline-block' });
      words = self.words;
      ready();
    } });
  });

  const finish = () => tl?.progress(1);
  hero.addEventListener('focusin', finish);
  return () => {
    hero.removeEventListener('focusin', finish);
    live = false;
    settle();
    titleSplit?.revert();
    statementSplit?.revert();
  };
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

// ---------------------------------------------------------------- K-Vie™ → AKBA → capsule (3D)
// The pinned range scrubs one number. It decides which of the five chapters is read and where the 3D scene
// stands, so text and scene always change together and reverse scroll, fast skips and anchors resolve to the
// same frame. Each chapter plays its stage in the first part of its range and holds the resolved frame while it
// is read. Without WebGL (or before it loads) the static SVG capsule poster stays in place; with reduced motion
// the chapters are listed beside the scene's last frame.
const form = $('[data-form]');
const sceneState = { p: 0 };
// Scene range [from, to] played by each chapter: micronized (granules → dust), microcrystalline (lattice),
// K-Vie™ · 40% (two in five crystals gold), AKBA (the molecule builds), vegetarian capsule (the halves close).
const STAGES = [[0, 0.2], [0.2, 0.4], [0.4, 0.56], [0.56, 0.78], [0.78, 1]];
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
  // Compiling the 3D scene blocks the main thread; start only after the hero entrance has settled,
  // or as soon as the visitor scrolls, so it never stalls the hero text.
  const scrolled = new Promise((resolve) => window.addEventListener('scroll', resolve, { once: true, passive: true }));
  Promise.race([heroDone, scrolled]).then(() => io.observe(form));
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
      refreshPriority: 2,
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
  const head = $('.h-who__head', section);
  const entries = $$('[data-who-entry]', section);
  const details = entries.map((entry) => $('.h-who__detail', entry));
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
    onRefreshInit: () => {
      Flip.killFlipsOf(frames);
      // Measure the featured-photo layout, excluding the introduction and thumbnail strip.
      select(0, false);
      const photo = frames[0];
      const stickyTop = parseFloat(getComputedStyle(head).top);
      const photoCenter = stickyTop + gallery.offsetTop + photo.offsetTop + photo.offsetHeight / 2;
      details.forEach((detail, i) => {
        const top = photoCenter - detail.offsetHeight / 2;
        detail.style.setProperty('--who-detail-top', `${top}px`);
        entries[i].style.setProperty('--who-entry-inset', `${top - stickyTop}px`);
      });
    },
    onRefresh: () => {
      starts = entries.map((entry, i) => {
        const textTop = parseFloat(details[i].style.getPropertyValue('--who-detail-top'));
        const inset = parseFloat(getComputedStyle(entry).paddingTop);
        return entry.getBoundingClientRect().top + window.scrollY + inset - textTop;
      });
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
    details.forEach((detail) => detail.style.removeProperty('--who-detail-top'));
    entries.forEach((entry) => entry.style.removeProperty('--who-entry-inset'));
  };
});

// ---------------------------------------------------------------- Glass sections (Evidence → Closing)
// The glass panels themselves are opened by the shared controller in motion.js. Here: the professional photograph
// settles behind its panel, and the soft colour fields behind the panels drift against the scroll so the frost
// visibly changes as the page moves.
mm.add(MQ.motion, () => {
  const figure = $('[data-pro-photo] .photo');
  if (figure) {
    gsap.fromTo(figure, { scale: 1.08 }, {
      scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-pro]', start: 'top bottom', end: 'center center', scrub: true },
    });
  }
  $$('.glass-field').forEach((field, i) => {
    const dir = i % 2 ? -1 : 1;
    gsap.fromTo(field, { yPercent: 16 * dir, xPercent: -6 * dir }, {
      yPercent: -16 * dir, xPercent: 6 * dir, ease: 'none',
      scrollTrigger: { trigger: field.closest('section, aside') ?? field, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
});

// ---------------------------------------------------------------- How to take it: one day, then eight weeks
// One scrubbed value is the time of day. The sun walks the arc from morning to evening (right to left in RTL, where
// breakfast is on the right) and lights the arc behind it; as it reaches each meal the capsule drops onto that plate,
// the plate gives a small settle and the meal's label comes up. Everything is a function of that value, so reverse
// scroll and direct anchors land on the same frame. Desktop pins the day while it plays; phones scrub it in place.
// Reduced motion and no-JS show the resolved day: every plate with its capsule, the arc drawn, no sun.
const MEALS_AT = [0.2, 0.5, 0.8]; // when the sun reaches breakfast, lunch and dinner
const ARC = [[20, 210], [260, -50], [740, -50], [980, 210]]; // the SVG path in its 1000×220 viewBox
const bezier = (t, k) => {
  const u = 1 - t;
  return u * u * u * ARC[0][k] + 3 * u * u * t * ARC[1][k] + 3 * u * t * t * ARC[2][k] + t * t * t * ARC[3][k];
};
function buildDay(pinned) {
  const scene = $('[data-dir-scene]');
  const stage = $('[data-dir-stage]');
  if (!scene || !stage) return;
  const sun = $('[data-dir-sun]', stage);
  const lit = $('[data-dir-arc]', stage);
  const svg = lit?.ownerSVGElement;
  const meals = $$('[data-dir-meal]', stage);
  const caps = meals.map((m) => $('[data-dir-cap]', m));
  const plates = meals.map((m) => $('[data-dir-plate]', m));
  const labels = meals.map((m) => $('.h-plate__label', m));
  if (!sun || !svg || meals.length !== MEALS_AT.length) return;
  const rtl = getComputedStyle(stage).direction === 'rtl';
  const fall = gsap.parseEase('power2.in');
  const rise = gsap.parseEase('power2.out');
  const clamp = gsap.utils.clamp(0, 1);
  let box = null;
  const measure = () => {
    const s = svg.getBoundingClientRect();
    const d = stage.getBoundingClientRect();
    box = { x: s.left - d.left, y: s.top - d.top, w: s.width, h: s.height };
  };
  const day = { p: 0 };
  const render = () => {
    if (!box) measure();
    const t = clamp(day.p / 0.94);
    const along = rtl ? 1 - t : t;
    gsap.set(sun, { x: box.x + (bezier(along, 0) / 1000) * box.w, y: box.y + (bezier(along, 1) / 220) * box.h, opacity: t > 0.001 && t < 0.999 ? 1 : t >= 0.999 ? 0.9 : 0 });
    lit.style.strokeDashoffset = rtl ? 1 + t : 1 - t;
    MEALS_AT.forEach((at, i) => {
      const k = clamp((day.p - (at - 0.1)) / 0.1); // the capsule's fall, ending as the sun arrives
      const settle = clamp((day.p - at) / 0.06);
      gsap.set(caps[i], { y: -150 * (1 - fall(k)), opacity: clamp(k * 3), scale: 1.25 - 0.25 * fall(k) });
      gsap.set(plates[i], { scale: 1 + 0.05 * Math.sin(Math.PI * settle) });
      gsap.set(labels[i], { opacity: 0.32 + 0.68 * rise(clamp((day.p - at + 0.02) / 0.08)) });
    });
  };
  lit.style.strokeDasharray = '1 1';
  render();
  const st = ScrollTrigger.create({
    trigger: pinned ? scene : stage,
    // Pinned below the fixed header, so the heading stays readable while the day plays.
    start: pinned ? () => `top ${Math.round(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) * 16 || 88) + 16}px` : 'top 80%',
    end: pinned ? '+=140%' : 'bottom 45%',
    pin: pinned,
    scrub: 0.8,
    refreshPriority: pinned ? 1 : 0,
    invalidateOnRefresh: true,
    onRefresh: () => { box = null; render(); },
    onUpdate: (self) => { day.p = self.progress; render(); },
  });
  return () => {
    st.kill();
    gsap.set([sun, ...caps, ...plates, ...labels], { clearProps: 'all' });
    lit.style.strokeDasharray = ''; lit.style.strokeDashoffset = '';
  };
}
// Pin only where there is room for the whole day on screen.
mm.add('(min-width: 56.25rem) and (min-height: 40rem) and (prefers-reduced-motion: no-preference)', () => buildDay(true));
mm.add('(max-width: 56.24rem), (max-height: 39.99rem)', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  return buildDay(false);
});

// Eight weeks: the segments fill one after another as the panel scrolls up (decorative; the sentence says it).
mm.add(MQ.motion, () => {
  const weeks = $$('[data-week]');
  if (!weeks.length) return;
  const fill = { v: 0 };
  const paint = () => weeks.forEach((w, i) => w.style.setProperty('--fill', gsap.utils.clamp(0, 1, fill.v * weeks.length - i).toFixed(3)));
  paint();
  gsap.to(fill, { v: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: '[data-weeks]', start: 'top 85%', end: 'top 35%', scrub: 0.6 } });
  return () => weeks.forEach((w) => w.style.removeProperty('--fill'));
});

// Closing: the bottle rises into place in front of the glass as the panel opens.
mm.add(MQ.motion, () => {
  const bottle = $('[data-close-bottle]');
  if (!bottle) return;
  gsap.fromTo(bottle, { y: 90, opacity: 0, rotate: -4 }, {
    y: 0, opacity: 1, rotate: 0, duration: 2, ease: 'power3.out', delay: 0.6,
    scrollTrigger: { trigger: '[data-close]', start: 'top 72%', toggleActions: 'play none none reverse' },
  });
});
