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
// same frame. Each chapter plays its stage, then keeps drifting slowly through the stage's quiet tail while it is
// read; the scene never stops, so the next chapter's text arrives on a moving scene that then gathers speed into
// its stage. Without WebGL (or before it loads) the static SVG capsule poster stays in place; with reduced motion
// the chapters are listed beside the scene's last frame.
const form = $('[data-form]');
const sceneState = { p: 0, t: 0 }; // scene progress, scroll progress through the pin
// Scroll each chapter gets, in % of the view height (desktop, phones). The two lattice chapters carry the least
// change, so they are shorter; the capsule chapter has more room: the molecule turns, then the two halves close
// around it.
const CHAPTER_SCROLL = { desktop: [112, 84, 84, 112, 172], mobile: [104, 80, 80, 104, 160] };
// Scroll → scene progress, as [chapter + share of that chapter's scroll, scene] knots on a smooth monotone curve.
// Per chapter: its start, the point where its stage has resolved, its end. Stages: micronized 0–0.2 (granules →
// dust), microcrystalline 0.2–0.4 (lattice), K-Vie™ · 40% 0.4–0.56 (two in five crystals gold), AKBA 0.56–0.78 (fly
// through the lattice, the molecule builds), vegetarian capsule 0.78–1 (the molecule turns by 0.86, the halves
// close by 0.99), then the closed capsule holds for the last chapter's actions.
const SCENE_KNOTS = [
  [0, 0], [0.64, 0.18], [1, 0.2],
  [1.64, 0.375], [2, 0.4],
  [2.64, 0.53], [3, 0.56],
  [3.3, 0.625], [3.7, 0.765], [4, 0.78],
  [4.28, 0.86], [4.82, 0.99], [4.92, 1], [5, 1],
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
        onFail: () => form.classList.remove('is-3d'),
      });
      if (sceneMode) scene?.setMode(sceneMode); // the layout may have changed while it was being built
      ScrollTrigger.addEventListener('refresh', () => scene?.resize());
    })
    .catch(() => form.classList.remove('is-3d'));
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
  const at = doses.map((_, i) => (i + 0.5) / doses.length); // where the line passes each dose
  const ease = gsap.parseEase('power3.out');
  const st = { p: 0 };
  const render = () => {
    line?.style.setProperty('--draw', st.p.toFixed(4));
    doses.forEach((_, i) => {
      const e = ease(gsap.utils.clamp(0, 1, (st.p - at[i] + 0.14) / 0.16));
      gsap.set(cells[i], { y: 18 * (1 - e), opacity: 0.12 + 0.88 * e, scale: 0.94 + 0.06 * e });
      gsap.set(ticks[i], { scale: 0.3 + 0.7 * e, opacity: e });
      gsap.set(labels[i], { y: 8 * (1 - e), opacity: 0.25 + 0.75 * e });
    });
  };
  render();
  const tween = gsap.to(st, { p: 1, ease: 'none', onUpdate: render, scrollTrigger: { trigger: day, start: 'top 85%', end: 'bottom 40%', scrub: 0.6 } });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set([...cells, ...ticks, ...labels], { clearProps: 'all' });
    line?.style.removeProperty('--draw');
  };
});

// Eight weeks: the segments fill as the panel scrolls up. Decorative; the sentence says it.
mm.add(MQ.motion, () => {
  const weeks = $$('[data-week]');
  if (!weeks.length) return;
  const fill = { v: 0 };
  const paint = () => weeks.forEach((w, i) => w.style.setProperty('--fill', gsap.utils.clamp(0, 1, fill.v * weeks.length - i).toFixed(3)));
  paint();
  const tween = gsap.to(fill, { v: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: '[data-weeks]', start: 'top 85%', end: 'top 35%', scrub: 0.6 } });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); weeks.forEach((w) => w.style.removeProperty('--fill')); };
});


// Where to find it: the arched photograph is revealed from the bottom like a curtain while the image settles from a
// slight zoom; it replays when the section comes back into view.
mm.add(MQ.motion, () => {
  const frame = $('[data-where-photo]');
  const figure = frame && $('.photo', frame);
  if (!figure) return;
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' }, 0)
    .fromTo(figure, { scale: 1.18 }, { scale: 1, duration: 2, ease: 'power3.out' }, 0.1);
  ScrollTrigger.create({ trigger: frame, start: 'top 82%', end: 'bottom top', onEnter: () => tl.restart(), onEnterBack: () => tl.restart() });
  ScrollTrigger.create({ trigger: frame, start: 'top bottom', end: 'bottom top', onLeave: () => tl.pause(0), onLeaveBack: () => tl.pause(0) });
  return () => gsap.set([frame, figure], { clearProps: 'clipPath,transform' });
});

// Closing: the label mark (white blob, cyan stripes) grows from behind the bottle as the bottle rises; replays when
// the section comes back into view.
mm.add(MQ.motion, () => {
  const stage = $('[data-close]');
  const mark = stage && $('[data-close-mark]', stage);
  const bottle = stage && $('[data-close-bottle]', stage);
  if (!stage || !mark || !bottle) return;
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(mark, { scale: 0.5, opacity: 0, transformOrigin: '50% 70%' }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0)
    .fromTo(bottle, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' }, 0.15);
  const enter = ScrollTrigger.create({ trigger: stage, start: 'top 75%', end: 'bottom top', onEnter: () => tl.restart(), onEnterBack: () => tl.restart() });
  const reset = ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onLeave: () => tl.pause(0), onLeaveBack: () => tl.pause(0) });
  return () => { enter.kill(); reset.kill(); tl.kill(); gsap.set([mark, bottle], { clearProps: 'all' }); };
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
    const a = nums(path.getAttribute('d'));
    const b = nums(path.dataset.alt || '');
    if (a.length < 8 || a.length !== b.length) return;
    const owner = path.closest('section, aside, header') || path.closest('svg');
    const st = { t: 0 };
    const render = () => path.setAttribute('d', toPath(a.map((v, i) => v + (b[i] - v) * st.t)));
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
