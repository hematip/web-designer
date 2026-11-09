// Homepage cinematic scenes (v2; formulation story v5). Every scene animates *from* states set here; the HTML is already the
// resolved composition, so reduced motion, no-JS and failures show complete content.
import { gsap, ScrollTrigger, SplitText, mm, MQ, getLenis } from './motion.js';
import { Flip } from 'gsap/Flip';
import { monotone } from '../lib/monotone.js';

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

// ---------------------------------------------------------------- Hero: the film gathers into the label
// The signature scene. On arrival the family film fills the whole hero behind the copy, with a navy shade from the
// copy's side so the question reads over it (the earlier full-screen hero). Scrolling pins the hero for most of a
// screen and gathers the film into the deep-blue label blob on the far side: the frame's box shrinks from the hero
// to the blob's box while its outline turns from the full rectangle into the blob, the shade lifts, and the stripe
// blob and drops arrive. Scrubbed, so reverse scroll opens it back to full screen. The copy stays in place and
// readable throughout. Box and outline are written together from one progress value. Reduced motion and no-JS: the
// blob composition, unpinned.
mm.add(MQ.motion, () => {
  const hero = $('[data-hero]');
  const mark = hero && $('[data-hero-mark]', hero);
  const film = hero && $('.h-hero__film', hero);
  const clip = $('[data-hero-clip]');
  if (!hero || !mark || !film || !clip) return;
  const nums = (d) => (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  const toPath = (n) => { const f = (v) => +v.toFixed(4); let d = `M${f(n[0])} ${f(n[1])}`; for (let i = 2; i < n.length; i += 6) d += `C${n.slice(i, i + 6).map(f).join(' ')}`; return `${d}Z`; };
  const blob = nums(clip.getAttribute('d'));
  if (blob.length !== 62) return;
  const phone = window.matchMedia('(max-width: 56.24rem)').matches;
  const arrivals = [$('.h-hero__stripes', hero)].filter(Boolean);
  const cue = $('.h-cue', hero);
  // The full frame: the unit box as a rectangle drawn with the blob's 10 cubics in the same order and direction
  // (clockwise from the top edge, like the blob), so the two interpolate
  // segment for segment.
  const line = (x1, y1, x2, y2) => [x1 + (x2 - x1) / 3, y1 + (y2 - y1) / 3, x1 + 2 * (x2 - x1) / 3, y1 + 2 * (y2 - y1) / 3, x2, y2];
  // Each rectangle point sits at about the same place round the outline as the blob point it becomes.
  const full = [
    0.3, 0,
    ...line(0.3, 0, 0.62, 0), ...line(0.62, 0, 1, 0), ...line(1, 0, 1, 0.43), ...line(1, 0.43, 1, 1),
    ...line(1, 1, 0.66, 1), ...line(0.66, 1, 0.4, 1), ...line(0.4, 1, 0, 1), ...line(0, 1, 0, 0.54),
    ...line(0, 0.54, 0, 0), ...line(0, 0, 0.3, 0),
  ];
  let rest = null, wide = null;
  const st = { t: 0 };
  const measure = () => {
    gsap.set(film, { clearProps: 'left,top,right,bottom,width,height' });
    rest = { x: film.offsetLeft, y: film.offsetTop, w: film.offsetWidth, h: film.offsetHeight };
    const H = hero.getBoundingClientRect(), M = mark.getBoundingClientRect();
    wide = { x: H.left - M.left, y: H.top - M.top, w: H.width, h: H.height };
    render();
  };
  const render = () => {
    if (!rest || !wide) return;
    const e = gsap.parseEase('power2.inOut')(st.t);
    gsap.set(film, {
      left: wide.x + (rest.x - wide.x) * e, top: wide.y + (rest.y - wide.y) * e,
      width: wide.w + (rest.w - wide.w) * e, height: wide.h + (rest.h - wide.h) * e, right: 'auto', bottom: 'auto',
    });
    clip.setAttribute('d', toPath(full.map((v, i) => v + (blob[i] - v) * e)));
    // The shade lifts later than the frame moves, so the copy never sits on bright film while the frame passes under it.
    film.style.setProperty('--scrim', (1 - e * e * e).toFixed(3));
  };
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: 'top top', end: () => `+=${phone ? 80 : 95}%`, pin: true, scrub: 0.8, anticipatePin: 1,
      refreshPriority: 3, invalidateOnRefresh: true, onRefreshInit: measure,
    },
  });
  tl.to(st, { t: 1, duration: 0.88, ease: 'none', onUpdate: render }, 0)
    .fromTo(arrivals, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.06, immediateRender: true }, 0.5);
  if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.2 }, 0);
  tl.to({}, { duration: 0.12 }); // a beat of the settled label before the pin releases
  measure();
  // The film plays once and holds its last frame; when it has, the scroll cue runs.
  const video = $('[data-hero-film]', hero);
  const ended = () => hero.classList.add('is-film-ended');
  const restart = () => hero.classList.remove('is-film-ended');
  video?.addEventListener('ended', ended);
  video?.addEventListener('play', restart);
  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    video?.removeEventListener('ended', ended);
    video?.removeEventListener('play', restart);
    hero.classList.remove('is-film-ended');
    gsap.set([...arrivals, film, cue].filter(Boolean), { clearProps: 'all' });
    film.style.removeProperty('--scrim');
    clip.setAttribute('d', toPath(blob));
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

// ---------------------------------------------------------------- Why memory changes
// The photograph opens like a curtain from the copy's side while it settles from a closer view; the three moments
// families notice first are highlighted one after another as the paragraph is read. Scrubbed. Reduced motion and
// no-JS: the open photograph and full highlights.
mm.add(MQ.motion, () => {
  const photo = $('[data-why-photo]');
  const img = photo && $('img', photo);
  const para = $('[data-why-moments]');
  // Text motion: the paragraph arrives line by line from a mask each time it comes into view (the heading's lines and
  // the closing sentence's word-by-word brightening come from motion.js). Lines only, so shaping is kept; the moment
  // spans are re-read after every split.
  const paraText = para && $('p', para);
  let paraSplit = null;
  if (paraText) {
    paraSplit = SplitText.create(paraText, {
      type: 'lines', mask: 'lines', aria: 'none', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 105, opacity: 0, duration: 0.95, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: paraText, start: 'top 84%', toggleActions: 'restart none none reset' } }),
    });
  }
  const momentsNow = () => (para ? $$('.h-why__moment', para) : []);
  const moments = momentsNow();
  const rtl = document.documentElement.dir === 'rtl';
  const tweens = [];
  if (photo) {
    tweens.push(gsap.fromTo(photo, { clipPath: rtl ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', scrollTrigger: { trigger: photo, start: 'top 90%', end: 'top 40%', scrub: 0.8 },
    }));
    // (the Photo wrapper flips the curtain's origin: it opens from the copy's side, toward the far edge)
    if (img) tweens.push(gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom 40%', scrub: true } }));
  }
  if (moments.length) {
    const st = { p: 0 };
    const paint = () => { const n = moments.length; momentsNow().forEach((m, i) => m.style.setProperty('--hl', gsap.utils.clamp(0, 1, st.p * n - Math.min(i, n - 1)).toFixed(3))); };
    paint();
    tweens.push(gsap.to(st, { p: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: moments[0].closest('[data-why-moments]'), start: 'top 75%', end: 'bottom 50%', scrub: 0.6 } }));
  }
  return () => {
    tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    if (photo) gsap.set(photo, { clearProps: 'clipPath' });
    if (img) gsap.set(img, { clearProps: 'transform' });
    momentsNow().forEach((m) => m.style.removeProperty('--hl'));
    paraSplit?.revert();
  };
});

// ---------------------------------------------------------------- K-Vie™ → AKBA → capsule (3D)
// The pinned range scrubs one number. It decides which of the five chapters is read and where the 3D scene
// stands, so text and scene always change together and reverse scroll, fast skips and anchors resolve to the
// same frame. Each chapter plays its stage, then keeps drifting slowly through the stage's quiet tail while it is
// read; the scene never stops, so the next chapter's text arrives on a moving scene that then gathers speed into
// its stage. Without WebGL (or before it loads) the static SVG capsule poster stays in place; with reduced motion
// the chapters are listed beside the scene's last frame.
const form = $('[data-form]');
const sceneState = { p: 0, t: 0 }; // scene progress, scroll progress through the pin
// Scroll each chapter gets, in % of the view height (desktop, phones). The two lattice chapters carry the least
// change, so they are shorter; the AKBA chapter, now the last, has the most room: the molecule builds, then makes
// one full turn before the pin releases. (The capsule chapter was removed, client direction 2026-11-09.)
const CHAPTER_SCROLL = { desktop: [112, 84, 84, 160], mobile: [104, 80, 80, 148] };
// Scroll → scene progress, as [chapter + share of that chapter's scroll, scene] knots on a smooth monotone curve.
// Per chapter: its start, the point where its stage has resolved, its end. Stages: micronized 0–0.2 (the dust vortex →
// dust), microcrystalline 0.2–0.4 (lattice), K-Vie™ · 40% 0.4–0.56 (two in five crystals gold), AKBA 0.56–0.84 (fly
// through the lattice, the molecule builds by 0.78, then makes one full turn by 0.84 and holds for the last
// chapter's actions). 0.84 is the scene's end (formulation-3d.js, SCENE_END).
const SCENE_KNOTS = [
  [0, 0], [0.64, 0.18], [1, 0.2],
  [1.64, 0.375], [2, 0.4],
  [2.64, 0.53], [3, 0.56],
  [3.22, 0.625], [3.5, 0.765], [3.6, 0.78], [3.9, 0.84], [4, 0.84],
];
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
    .then(async ({ createFormulationScene }) => {
      scene = await createFormulationScene({
        section: form,
        canvas: $('[data-form-canvas]', form),
        frame: $('[data-form-frame]', form),
        state: sceneState,
        mode: sceneMode ?? 'static',
        onReady: () => form.classList.add('is-3d'),
        onFail: () => { form.classList.remove('is-3d'); form.classList.add('no-3d'); },
      });
      if (sceneMode) scene?.setMode(sceneMode); // the layout may have changed while it was being built
      ScrollTrigger.addEventListener('refresh', () => scene?.resize());
    })
    .catch(() => { form.classList.remove('is-3d'); form.classList.add('no-3d'); });
}
if (form) {
  // Build the renderer ahead of the section, but in a quiet moment: once the hero entrance has settled and the
  // visitor has paused scrolling, in idle time. If they come within reach of the section first, start then. The build
  // itself is staged (formulation-3d.js), so neither path stalls a scroll; until it is ready the poster shows.
  let lastScroll = 0;
  const onScroll = () => { lastScroll = performance.now(); };
  const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200));
  const near = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) start();
  }, { rootMargin: '60% 0px' });
  const start = () => {
    window.removeEventListener('scroll', onScroll);
    near.disconnect();
    loadScene();
  };
  const whenQuiet = () => idle(() => (performance.now() - lastScroll < 600 ? setTimeout(whenQuiet, 300) : start()), { timeout: 2000 });
  window.addEventListener('scroll', onScroll, { passive: true });
  near.observe(form);
  heroDone.then(whenQuiet);
}

function buildFormulation(mobile) {
  if (!form) return null;
  const chapters = $$('.h-chapter', form);
  const rail = $$('[data-form-rail] span', form);
  const n = chapters.length;
  const lengths = chapters.map((_, k) => CHAPTER_SCROLL[mobile ? 'mobile' : 'desktop'][k] ?? 112);
  const total = lengths.reduce((a, b) => a + b, 0);
  const bounds = lengths.reduce((acc, l) => [...acc, acc[acc.length - 1] + l / total], [0]);
  const from = (k) => bounds[k];
  const to = (k) => bounds[k + 1];
  const at = (c) => { const k = Math.min(n - 1, Math.floor(c)); return from(k) + (to(k) - from(k)) * (c - k); };
  const sceneAt = monotone(SCENE_KNOTS.filter(([c]) => c <= n).map(([c, p]) => [at(c), p]));
  const st = { t: 0 };
  let active = -1;

  const sync = () => {
    const t = st.t;
    let i = 0;
    while (i < n - 1 && t >= to(i)) i++;
    sceneState.p = sceneAt(t);
    sceneState.t = t;
    if (i !== active) {
      active = i;
      chapters.forEach((c, k) => { c.dataset.state = k < i ? 'past' : k === i ? 'active' : 'future'; });
    }
    rail.forEach((r, k) => r.style.setProperty('--fill', Math.min(1, Math.max(0, (t - from(k)) / (to(k) - from(k)))).toFixed(3)));
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
      end: `+=${total}%`,
      pin: true,
      refreshPriority: 2,
      scrub: 1.4,
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

// ---------------------------------------------------------------- Professional photograph (when the band renders)
// The professional photograph settles behind its panel as the band scrolls in.
mm.add(MQ.motion, () => {
  const figure = $('[data-pro-photo] .photo');
  if (!figure) return;
  const tween = gsap.fromTo(figure, { scale: 1.08 }, {
    scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-pro]', start: 'top bottom', end: 'center center', scrub: true },
  });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(figure, { clearProps: 'transform' }); };
});

// ---------------------------------------------------------------- How to take it: a day in three doses
// One line draws across the day (right to left in RTL) and, as it reaches each dose, its time of day, tick and
// note rise. Typographic only: no capsule or plate imagery (client direction). Scrubbed in place, no pin. Decorative: the dose line and the labels say it; reduced motion and
// no-JS show the resolved row.
mm.add(MQ.motion, () => {
  const day = $('[data-dir-day]');
  if (!day) return;
  const line = $('[data-dir-line]', day);
  const doses = $$('[data-dir-dose]', day);
  if (!doses.length) return;
  const cells = doses.map((d) => $('.h-dose__time', d));
  const ticks = doses.map((d) => $('.h-dose__tick', d));
  const labels = doses.map((d) => $('.h-dose__note', d));
  // Where the line passes each dose is measured (RTL: from the right).
  let at = doses.map((_, i) => (i + 0.5) / doses.length);
  const rtl = (day.closest('[dir]')?.getAttribute('dir') || document.documentElement.dir) === 'rtl';
  const measure = () => {
    const L = line?.parentElement?.getBoundingClientRect();
    if (!L || !L.width) return;
    at = ticks.map((t) => { const r = t.getBoundingClientRect(); const c = r.left + r.width / 2; return gsap.utils.clamp(0, 1, (rtl ? L.right - c : c - L.left) / L.width); });
  };
  measure();
  const ease = gsap.parseEase('power3.out');
  const st = { p: 0 };
  const render = () => {
    const q = st.p;
    line?.style.setProperty('--draw', q.toFixed(4));
    doses.forEach((_, i) => {
      const e = ease(gsap.utils.clamp(0, 1, (q - at[i] + 0.14) / 0.16));
      gsap.set(cells[i], { y: 18 * (1 - e), opacity: 0.12 + 0.88 * e, scale: 0.94 + 0.06 * e });
      gsap.set(ticks[i], { scale: 0.3 + 0.7 * e, opacity: e });
      gsap.set(labels[i], { y: 8 * (1 - e), opacity: 0.25 + 0.75 * e });
    });
  };
  render();
  const tween = gsap.to(st, { p: 1, ease: 'none', onUpdate: render, scrollTrigger: { trigger: day, start: 'top 88%', end: 'bottom 62%', scrub: 0.6, onRefresh: () => { measure(); render(); } } });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set([...cells, ...ticks, ...labels], { clearProps: 'all' });
    line?.style.removeProperty('--draw');
  };
});

// How to take it: the product appears. As the stage scrolls in, the label's navy shape grows from behind (and turns a
// little), the cyan shape swings in over it, then the bottle rises onto them from below, straightening as it lands; it settles before the stage is
// centred. Scrubbed, so reverse scroll takes it back down. Reduced motion and no-JS: the resolved composition.
mm.add(MQ.motion, () => {
  const stage = $('[data-dir-stage]');
  const mark = stage && $('[data-dir-mark]', stage);
  const bottle = stage && $('[data-dir-bottle]', stage);
  const cyan = stage && $('[data-dir-mark-cyan]', stage);
  if (!stage || !mark || !bottle) return;
  const rtl = (stage.closest('[dir]')?.getAttribute('dir') || document.documentElement.dir) === 'rtl';
  const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 88%', end: 'center 58%', scrub: 0.8 } });
  tl.fromTo(mark, { scale: 0.45, rotate: rtl ? 14 : -14, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, 0)
    .fromTo(cyan, { scale: 0.3, rotate: rtl ? -40 : 40, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, 0.12)
    .fromTo(bottle, { yPercent: 38, scale: 0.82, rotate: rtl ? 9 : -9, autoAlpha: 0 }, { yPercent: 0, scale: 1, rotate: 0, autoAlpha: 1, duration: 0.75, ease: 'back.out(1.4)', transformOrigin: '50% 100%' }, 0.25);
  return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set([mark, cyan, bottle].filter(Boolean), { clearProps: 'all' }); };
});

// The course: eight weeks of days fill dose by dose as the calendar scrolls in, one week after another. One custom
// property (--n, doses filled) paints all the pips through CSS. Decorative; the sentence beside it says it.
mm.add(MQ.motion, () => {
  const course = $('[data-course]');
  if (!course) return;
  const total = $$('i', course).length;
  const st = { n: 0 };
  const paint = () => course.style.setProperty('--n', st.n.toFixed(2));
  paint();
  const tween = gsap.to(st, { n: total, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: course, start: 'top 85%', end: 'bottom 45%', scrub: 0.6 } });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); course.style.removeProperty('--n'); };
});

// ---------------------------------------------------------------- Evidence: the measured gap
// As the chart scrolls in, the Memowell line rises from the dummy-capsule line to its place, the bracket grows with it
// and the figure counts to the published difference. One value (--rise) drives the line, the bracket and the
// figure's opacity in CSS; the count is written into the decorative figure only. Reduced motion: the resolved chart.
mm.add(MQ.motion, () => {
  const chart = $('[data-gap]');
  const num = chart && $('[data-gap-number]', chart);
  if (!chart || !num) return;
  const text = num.textContent;
  const target = parseFloat(text);
  if (!Number.isFinite(target)) return;
  const decimals = (text.split('.')[1] || '').length;
  const ease = gsap.parseEase('power2.inOut');
  const st = { r: 0 };
  const paint = () => {
    const e = ease(st.r);
    chart.style.setProperty('--rise', e.toFixed(4));
    num.textContent = (target * e).toFixed(decimals);
  };
  paint();
  const tween = gsap.to(st, { r: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: chart, start: 'top 80%', end: 'center 45%', scrub: 0.7 } });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); chart.style.removeProperty('--rise'); num.textContent = text; };
});


// Where to find it: the label's wave. One progress value p (0…1) draws the whole shape layer in pixels:
//  · flood (p 0 → 0.5): the blue wave, its cyan rim a beat ahead, rises from below the section over the end of
//    "How to take it" until its crest stands above the section top; the crest swells as it rises;
//  · part (p 0.42 → 1, wide screens): its far edge draws back from beyond the page to a curved boundary, uncovering
//    the photograph; the rim follows a beat later as a cyan band along the edge; the stripe blob rides the corner
//    where the crest meets the edge, tucked behind the blue.
// Phones have no part beat: the wave floods the section and the photograph below the copy rises into place.
// Scrubbed with scroll (reverse undoes it). Without motion, and before any scroll, the shape is drawn at its resting
// state (p = 1). Mirrored for RTL by drawing x from the other edge.
{
  const section = $('[data-where]');
  const shape = section && $('[data-where-shape]', section);
  const navy = shape && $('[data-where-navy]', shape);
  const rim = shape && $('[data-where-rim]', shape);
  if (section && navy && rim) {
    const stripes = $('[data-where-stripes]', section);
    const photo = $('[data-where-photo]', section);
    const photoImg = photo && $('img', photo);
    const rtl = (section.closest('[dir]')?.getAttribute('dir') || document.documentElement.dir) === 'rtl';
    const phoneMQ = window.matchMedia('(max-width: 56.24rem)');
    const ease = gsap.parseEase('power2.inOut');
    const out = gsap.parseEase('power3.out');
    const band = (p, a, b) => gsap.utils.clamp(0, 1, (p - a) / (b - a));
    const lerp = (a, b, t) => a + (b - a) * t;
    const f1 = (v) => v.toFixed(1);
    let W = 0, Hs = 0, R = 0, phone = false, shift = 0;
    const copy = $('.h-where__copy', section);
    const cubicX = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
    const measure = () => {
      W = shape.clientWidth; Hs = shape.clientHeight;
      R = parseFloat(getComputedStyle(shape).top) * -1 || 0;
      phone = phoneMQ.matches;
      shape.setAttribute('viewBox', `0 0 ${W} ${Hs}`);
      shape.setAttribute('preserveAspectRatio', 'none');
      // Keep the copy clear of the wave's edge: the edge is laid out in shares of the full width, but the copy sits in
      // the centred content column, so on wide screens it would run under the edge. Sample the resolved edge across the
      // copy's height and push the whole edge toward the far side until it clears the copy by --clear.
      shift = 0;
      if (phone || !copy) return;
      const S = shape.getBoundingClientRect(), C = copy.getBoundingClientRect();
      const copyEnd = rtl ? S.right - C.left : C.right - S.left;
      const top = C.top - S.top - 24, bottom = C.bottom - S.top + 24;
      const clear = Math.max(48, W * 0.035);
      const H = Hs - R, yT = R * 0.72;
      const xT = W * 0.53, b1 = W * 0.63, b2 = W * 0.27, xB = W * 0.4;
      let minX = Infinity;
      for (let i = 0; i <= 64; i++) {
        const t = i / 64;
        const y = cubicX(yT, R + H * 0.3, R + H * 0.78, Hs, t);
        if (y < top || y > bottom) continue;
        minX = Math.min(minX, cubicX(xT, b1, b2, xB, t));
      }
      if (minX < Infinity) shift = Math.max(0, copyEnd + clear - minX);
    };
    // One wave outline. f: flood 0…1, q: part 0…1, grow: crest offset (rim stands higher), wide: boundary offset.
    const wave = (f, q, grow, wide) => {
      const H = Hs - R;
      const drop = (1 - f) * Hs * 1.08;
      const X = (x) => f1(rtl ? W - x : x);
      const Y = (y) => f1(y + drop);
      const far = W * 1.12;
      // the crest: low at the start edge, swelling to its peak about a third across, easing down to the corner
      const yL = R * (phone ? 0.75 : 0.62) - grow, yT = R * 0.72 - grow;
      const c1y = lerp(R * 0.7, R * 0.02, f) - grow, c2y = lerp(R * 0.75, R * -0.1, f) - grow;
      if (phone) {
        return `M${X(0)} ${Y(yL)}C${X(W * 0.22)} ${Y(c1y)} ${X(W * 0.62)} ${Y(c2y)} ${X(W)} ${Y(yT)}L${X(W)} ${Y(Hs)}L${X(0)} ${Y(Hs)}Z`;
      }
      const xT = lerp(far, W * 0.53 + shift, q) + wide, xB = lerp(far, W * 0.4 + shift, q) + wide;
      const b1 = lerp(far, W * 0.63 + shift, q) + wide, b2 = lerp(far, W * 0.27 + shift, q) + wide;
      const cx1 = Math.min(W * 0.14, xT * 0.3), cx2 = Math.min(W * 0.36, xT * 0.68);
      return `M${X(0)} ${Y(yL)}C${X(cx1)} ${Y(c1y)} ${X(cx2)} ${Y(c2y)} ${X(xT)} ${Y(yT)}`
        + `C${X(b1)} ${Y(R + H * 0.3)} ${X(b2)} ${Y(R + H * 0.78)} ${X(xB)} ${Y(Hs)}L${X(0)} ${Y(Hs)}Z`;
    };
    const draw = (p) => {
      if (!W) return;
      const fN = out(band(p, 0, 0.5)), fR = out(band(p, 0, 0.42));
      const qN = phone ? 0 : ease(band(p, 0.42, 1)), qR = phone ? 0 : ease(band(p, 0.36, 0.94));
      navy.setAttribute('d', wave(fN, qN, 0, 0));
      rim.setAttribute('d', wave(fR, qR, R * 0.16 + 6, W * 0.045 * qR));
      if (stripes) {
        const sw = stripes.clientWidth, sh = sw * 0.75;
        let x, y;
        if (phone) { x = W - sw * 0.85; y = (photo ? photo.offsetTop : Hs - R) - sh * 0.55 + (1 - out(band(p, 0.25, 1))) * 60; }
        else {
          const xT = lerp(W * 1.12, W * 0.53 + shift, qN);
          x = Math.min(xT - sw * 0.55, W - sw * 0.7);
          y = R * 0.72 + (1 - fN) * Hs * 1.08 - R - sh * 0.7;
        }
        if (rtl) x = W - x - sw;
        stripes.style.setProperty('--sx', `${f1(x)}px`);
        stripes.style.setProperty('--sy', `${f1(y)}px`);
        stripes.style.opacity = phone ? String(band(p, 0.3, 0.7)) : String(fN);
      }
      // On wide screens the photograph waits under the wave until the wave covers the section, so it is never seen
      // before the edge uncovers it.
      if (photo && !phone) photo.style.opacity = p < 0.4 ? '0' : '1';
      if (photoImg) {
        const k = phone ? out(band(p, 0.25, 1)) : ease(band(p, 0.4, 1));
        photoImg.style.transform = `scale(${(1.18 - 0.18 * k).toFixed(4)})`;
        if (phone) photo.style.transform = `translateY(${f1((1 - k) * 60)}px)`;
      }
    };
    const st = { p: 1 };
    const rest = () => { measure(); draw(st.p); };
    rest();
    let tween = null;
    const motion = window.matchMedia(MQ.motion);
    const setup = () => {
      tween?.scrollTrigger?.kill(); tween?.kill(); tween = null;
      if (!motion.matches) { st.p = 1; if (photo) { photo.style.transform = ''; photo.style.opacity = ''; } rest(); return; }
      st.p = 0; rest();
      tween = gsap.to(st, {
        p: 1, ease: 'none', onUpdate: () => draw(st.p),
        scrollTrigger: {
          trigger: section,
          start: phoneMQ.matches ? 'top 92%' : 'top 100%',
          end: phoneMQ.matches ? 'top 20%' : 'top 8%',
          scrub: 0.8, invalidateOnRefresh: true, onRefresh: () => { measure(); draw(st.p); },
        },
      });
    };
    setup();
    motion.addEventListener('change', setup);
    phoneMQ.addEventListener('change', setup);
    if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); draw(st.p); }).observe(section);
  }
}

// The foot of Where to find it follows the closing dome's arch: same ellipse (the dome's width share and its height),
// so the white band between them has two parallel curves. sag = how far the arch rises at the page edges' midpoint,
// ry · (1 − √(1 − (0.5 / k)²)) for an ellipse k widths wide. Not motion: runs everywhere, re-measured on resize.
{
  const where = $('#where');
  const dome = $('[data-close-dome]');
  if (where && dome) {
    const phoneMQ = window.matchMedia('(max-width: 56.24rem)');
    const fit = () => {
      const ry = dome.offsetHeight;
      if (!ry) return;
      const k = phoneMQ.matches ? 1.5 : 0.92;
      const sag = ry * (1 - Math.sqrt(1 - (0.5 / k) ** 2));
      where.style.setProperty('--arch-rx', `${k * 100}%`);
      where.style.setProperty('--arch-ry', `${ry.toFixed(1)}px`);
      where.style.setProperty('--arch-sag', `${sag.toFixed(1)}px`);
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(dome);
    else window.addEventListener('resize', fit);
  }
}

// Closing: the label rises. Scrubbed with scroll: the dome comes up from below (its crown rising and widening), and the
// bottle rises from behind its edge like a sunrise, straightening as it stands. Reverse scroll sets it again.
// Reduced motion and no-JS: the resolved composition.
mm.add(MQ.motion, () => {
  const section = $('[data-close]');
  const dome = section && $('[data-close-dome]', section);
  const bottle = section && $('[data-close-bottle]', section);
  if (!section || !dome || !bottle) return;
  const phone = window.matchMedia('(max-width: 56.24rem)').matches;
  const rx = phone ? 150 : 92;
  const st = { d: 0 };
  const paint = () => {
    const e = gsap.parseEase('power2.out')(st.d);
    const c = `ellipse(${(rx * (0.55 + 0.45 * e)).toFixed(2)}% ${(100 * (0.7 + 0.3 * e)).toFixed(2)}% at 50% 100%)`;
    dome.style.clipPath = c; dome.style.webkitClipPath = c;
  };
  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 20%', scrub: 0.8 } });
  tl.to(st, { d: 1, duration: 0.6, ease: 'none', onUpdate: paint }, 0)
    .fromTo(bottle, { yPercent: 70, rotate: -6, scale: 0.9 }, { yPercent: 0, rotate: 0, scale: 1, duration: 0.7, ease: 'power3.out', transformOrigin: '50% 100%' }, 0.2);
  paint();
  return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set(bottle, { clearProps: 'transform' }); dome.style.clipPath = ''; dome.style.webkitClipPath = ''; };
});

// ---------------------------------------------------------------- Label blobs: the mark moves with the page
// Every blob outline ([data-blob-main], [data-blob-stripe]) morphs between its `d` and `data-alt` as its section
// scrolls through the viewport, and the stripe blob slides a little against the main one, so the mark is never
// frozen. Scrubbed, one writer per path. Satellite drops drift counter to the scroll. Reduced motion: resting shapes.
mm.add(MQ.motion, () => {
  const nums = (d) => (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  const toPath = (n) => {
    const f = (v) => +v.toFixed(3);
    let d = `M${f(n[0])} ${f(n[1])}`;
    for (let i = 2; i < n.length; i += 6) d += `C${n.slice(i, i + 6).map(f).join(' ')}`;
    return `${d}Z`;
  };
  const tweens = [];
  $$('[data-blob-main], [data-blob-stripe]').forEach((path) => {
    const d0 = path.getAttribute('d');
    if (nums(d0).length < 8 || nums(d0).length !== nums(path.dataset.alt || '').length) return;
    const owner = path.closest('section, aside, header') || path.closest('svg');
    const st = { t: 0 };
    // the endpoints are re-read when a fitted panel redraws them (resize), so the morph follows the new outline
    let cache = { base: '', alt: '', a: [], b: [] };
    const render = () => {
      const base = path.dataset.base || d0, alt = path.dataset.alt || '';
      if (cache.base !== base || cache.alt !== alt) cache = { base, alt, a: nums(base), b: nums(alt) };
      if (cache.a.length !== cache.b.length) return;
      path.setAttribute('d', toPath(cache.a.map((v, i) => v + (cache.b[i] - v) * st.t)));
    };
    tweens.push({ kill() { path.setAttribute('d', path.dataset.base || d0); } });
    tweens.push(gsap.to(st, { t: 1, ease: 'none', onUpdate: render, scrollTrigger: { trigger: owner, start: 'top bottom', end: 'bottom top', scrub: 1.2 } }));
    if (path.hasAttribute('data-blob-stripe')) {
      tweens.push(gsap.fromTo(path, { xPercent: 2, yPercent: -2 }, { xPercent: -2, yPercent: 3, ease: 'none', scrollTrigger: { trigger: owner, start: 'top bottom', end: 'bottom top', scrub: 1.4 } }));
    }
  });
  $$('[data-blob-drop], [data-blob-drops]').forEach((drop, i) => {
    const owner = drop.closest('section, aside, header') || drop;
    tweens.push(gsap.fromTo(drop, { y: 14 * (i % 2 ? -1 : 1) }, { y: -14 * (i % 2 ? -1 : 1), ease: 'none', scrollTrigger: { trigger: owner, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }));
  });
  return () => {
    tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    $$('[data-blob-main], [data-blob-stripe]').forEach((path) => { gsap.set(path, { clearProps: 'transform' }); });
    $$('[data-blob-drop], [data-blob-drops]').forEach((d) => gsap.set(d, { clearProps: 'transform' }));
  };
});
