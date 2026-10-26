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

// ---------------------------------------------------------------- Why: one thread ties the subject to its caveat
// A single cyan thread (the section's own "thread of a conversation"; the film's "connection") enters at the top,
// underlines the research subject, runs down between photo and text, lights the three moments families notice,
// and becomes the rule of "not a settled answer". It is drawn from measured anchors, so it follows the real layout.
// No anatomy or mechanism is drawn. Reduced motion shows the finished thread; without JS the note keeps its CSS rule.
{
  const why = $('[data-why]');
  const svg = why && $('[data-why-thread]', why);
  const path = svg && $('path', svg);
  const title = why && $('[data-why-title]', why);
  const note = why && $('[data-why-note]', why);
  if (why && path && title && note) {
    const moments = $$('.h-why__moment', why);
    const state = { p: 1 };
    let length = 0;

    const build = () => {
      const box = why.getBoundingClientRect();
      const rtl = getComputedStyle(why).direction === 'rtl';
      // Last display line of the subject, measured on its text (not the split line boxes, which are full width).
      const rects = [];
      // (Line splitting may move text out of the subject span, so walk the heading and skip only the lead-in.)
      // Measure the settled layout: neutralise the heading's entrance transforms for this read, then restore them.
      const moved = [...title.querySelectorAll('*')].filter((el) => el.style.transform || el.style.translate);
      const saved = moved.map((el) => [el.style.transform, el.style.translate]);
      moved.forEach((el) => { el.style.transform = 'none'; el.style.translate = 'none'; });
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (!t.textContent.trim() || t.parentElement.closest('.h-why__context')) continue;
        range.selectNodeContents(t);
        rects.push(...[...range.getClientRects()].filter((r) => r.width > 1));
      }
      moved.forEach((el, i) => { el.style.transform = saved[i][0]; el.style.translate = saved[i][1]; });
      if (!rects.length) return;
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const last = rects.filter((r) => r.bottom > bottom - 4);
      const ul = Math.min(...last.map((r) => r.left)) - box.left;
      const ur = Math.max(...last.map((r) => r.right)) - box.left;
      const uy = bottom - box.top - 2;
      const n = note.getBoundingClientRect();
      const ny = n.top - box.top, nb = n.bottom - box.top;
      const nx = (rtl ? n.right : n.left) - box.left + (rtl ? -1.5 : 1.5);
      const dir = rtl ? -1 : 1;
      const gap = parseFloat(getComputedStyle(why.querySelector('.h-why__grid')).columnGap) || 32;
      // Runs down the middle of the gutter between photo and reading column (or just outside the column).
      const photo = $('.h-why__photo', why)?.getBoundingClientRect();
      const body = $('.h-why__body', why).getBoundingClientRect();
      const sideBySide = photo && photo.width && (photo.right <= body.left || photo.left >= body.right);
      const gx = sideBySide
        ? ((rtl ? photo.left + body.right : photo.right + body.left) / 2) - box.left
        : nx - dir * Math.max(14, gap * 0.6);
      const sx = (rtl ? ur : ul) - dir * Math.max(14, gap * 0.45); // enters in the margin before the subject
      const start = rtl ? ur : ul, end = rtl ? ul : ur;
      const r = 26;
      const swing = Math.min(120, Math.abs(end - gx) * 0.35 + 40);
      const d = [
        `M ${sx} 0`,
        `L ${sx} ${uy - r}`,
        `Q ${sx} ${uy} ${sx + dir * r} ${uy}`,
        `L ${start + dir * 0} ${uy}`,
        `L ${end} ${uy}`,
        `C ${end + dir * swing} ${uy} ${gx} ${uy + swing * 0.6} ${gx} ${uy + swing * 1.4}`,
        `L ${gx} ${ny - r}`,
        `C ${gx} ${ny} ${nx} ${ny - r * 0.4} ${nx} ${ny + r * 0.6}`,
        `L ${nx} ${nb}`,
      ].join(' ');
      path.setAttribute('d', d);
      length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      apply();
    };
    const apply = () => { path.style.strokeDashoffset = String(length * (1 - state.p)); };

    why.classList.add('has-thread');
    const ro = new ResizeObserver(() => build());
    ro.observe(why);
    document.fonts?.ready.then(build);
    ScrollTrigger.addEventListener('refresh', build);
    build();

    mm.add(MQ.motion, () => {
      state.p = 0;
      apply();
      moments.forEach((m) => m.style.setProperty('--lit', '0%'));
      const tween = gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: { trigger: why, start: 'top 72%', endTrigger: note, end: 'bottom 62%', scrub: 0.6 },
      });
      const lights = moments.map((m) => ScrollTrigger.create({
        trigger: m, start: 'top 68%',
        onEnter: () => m.style.setProperty('--lit', '100%'),
        onLeaveBack: () => m.style.setProperty('--lit', '0%'),
      }));
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        lights.forEach((t) => t.kill());
        moments.forEach((m) => m.style.removeProperty('--lit'));
        state.p = 1;
        apply();
      };
    });
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
