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

// ---------------------------------------------------------------- Resin → K-Vie™ → capsule
function buildFormulation({ pinned }) {
  const section = $('[data-form]');
  if (!section) return null;
  const svg = $('[data-form-svg]', section);
  const resin = $('[data-form-resin]', svg);
  const morph = $('[data-form-morph]', svg);
  const capsule = $('[data-form-capsule]', svg);
  const shape = $('[data-form-capsule-shape]', svg);
  const labels = $$('[data-form-label]', section);
  const layer = $('[data-form-particles]', svg);

  // Decorative particle cloud (created only while the scene is active).
  const N = 120;
  const rnd = gsap.utils.random;
  const ns = 'http://www.w3.org/2000/svg';
  const start = [], burst = [], lattice = [], converge = [];
  const cols = 12, gap = 24, rows = Math.ceil(N / cols);
  const rot = (x, y, deg) => {
    const a = (deg * Math.PI) / 180, dx = x - 300, dy = y - 300;
    return { x: 300 + dx * Math.cos(a) - dy * Math.sin(a), y: 300 + dx * Math.sin(a) + dy * Math.cos(a) };
  };
  const dots = [];
  for (let i = 0; i < N; i++) {
    const t = rnd(0, Math.PI * 2), rr = Math.sqrt(Math.random());
    start.push({ x: 300 + Math.cos(t) * 95 * rr, y: 330 + Math.sin(t) * 115 * rr });
    const a = rnd(0, Math.PI * 2), d = rnd(140, 280);
    burst.push({ x: 300 + Math.cos(a) * d, y: 300 + Math.sin(a) * d });
    lattice.push({ x: 300 + ((i % cols) - (cols - 1) / 2) * gap, y: 300 + (Math.floor(i / cols) - (rows - 1) / 2) * gap });
    converge.push(rot(rnd(160, 440), rnd(240, 360), -22));
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', String(rnd(2.2, 5.2)));
    c.setAttribute('fill', i % 3 ? '#f3d9a8' : '#ffffff');
    c.setAttribute('cx', String(start[i].x));
    c.setAttribute('cy', String(start[i].y));
    c.setAttribute('opacity', '0');
    layer.appendChild(c);
    dots.push(c);
  }

  gsap.set(resin, { autoAlpha: 1, scale: 0.86, svgOrigin: '300 330' });
  gsap.set(morph, { autoAlpha: 0, attr: { d: resin.getAttribute('d') }, fill: '#e2a245' });
  gsap.set(capsule, { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
  gsap.set(labels, { autoAlpha: 0, y: 14 });

  const show = (i) => ({ autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
  const dim = { autoAlpha: 0.55, duration: 0.35 };
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: pinned
      ? { trigger: $('[data-form-pin]', section), start: 'top top', end: '+=260%', pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true }
      : { trigger: $('.h-form__stage', section), start: 'top 80%', end: 'bottom 30%', scrub: 0.7 },
  });

  tl.to(resin, { scale: 1, duration: 0.8 }, 0)
    .to(labels[0], show(0), 0.2)
    .addLabel('micronized', 1)
    .to(resin, { autoAlpha: 0, scale: 1.18, duration: 0.6 }, 'micronized')
    .to(dots, { attr: { opacity: 1 }, duration: 0.15 }, 'micronized')
    .to(dots, { attr: { cx: (i) => burst[i].x, cy: (i) => burst[i].y }, duration: 1.2, ease: 'power3.out', stagger: { amount: 0.25, from: 'center' } }, 'micronized')
    .to(labels[0], dim, 'micronized+=0.3')
    .to(labels[1], show(1), 'micronized+=0.35')
    .addLabel('crystal', 2.6)
    .to(dots, { attr: { cx: (i) => lattice[i].x, cy: (i) => lattice[i].y, r: 3.2 }, duration: 1.2, stagger: { amount: 0.3, grid: [rows, cols], from: 'edges' } }, 'crystal')
    .to(labels[1], dim, 'crystal+=0.3')
    .to(labels[2], show(2), 'crystal+=0.35')
    .addLabel('kvie', 4.2)
    .to(dots, { attr: { cx: (i) => converge[i].x, cy: (i) => converge[i].y, r: 1.6 }, duration: 1, ease: 'power3.in', stagger: { amount: 0.25, from: 'random' } }, 'kvie')
    .to(morph, { autoAlpha: 1, duration: 0.4 }, 'kvie+=0.45')
    .to(morph, { morphSVG: shape, fill: '#f0dcbc', duration: 0.9 }, 'kvie+=0.5')
    .to(dots, { attr: { opacity: 0 }, duration: 0.3 }, 'kvie+=1.05')
    .to(capsule, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 'kvie+=1.1')
    .to(morph, { autoAlpha: 0, duration: 0.3 }, 'kvie+=1.5')
    .to(labels[2], dim, 'kvie+=0.4')
    .to(labels[3], show(3), 'kvie+=0.6')
    .to(labels[4], show(4), 'kvie+=1.3')
    .to(labels, { autoAlpha: 1, duration: 0.4 }, 'kvie+=1.8')
    .to(capsule, { rotate: 8, duration: 1.2, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 'kvie+=1.6');

  return () => {
    dots.forEach((d) => d.remove());
  };
}
mm.add(MQ.desktop, () => buildFormulation({ pinned: true }));
mm.add(MQ.mobile, () => buildFormulation({ pinned: false }));

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
