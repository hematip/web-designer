// Product page scenes (2026-11-28): "inside the capsule". The HTML is the resolved composition (open capsule, the
// three ingredients listed); with motion, the capsule arrives closed, parts as the composition is read, the
// ingredients rise out of the gap, and the capsule then travels into step 01 of "How to take it", where it stays.
// Reduced motion and no-JS: the resolved state and the step's own capsule.
import { gsap, ScrollTrigger, mm, MQ } from './motion.js';
const one = (sel, root = document) => root.querySelector(sel);
const all = (sel, root = document) => [...root.querySelectorAll(sel)];

// 0 · Hero: the copy rises, then the fan of bottles opens from the centre.
mm.add(MQ.motion, () => {
  const hero = one('[data-p-hero]');
  if (!hero) return;
  const parts = all('[data-hero-in]', hero);
  const bottles = all('[data-hero-bottle]', hero);
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(parts, { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.1)
    .from(bottles, { rotate: 0, y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: { each: 0.08, from: 'center' } }, 0.35);
  return () => { tl.kill(); gsap.set([...parts, ...bottles], { clearProps: 'all' }); };
});

mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
  if (!ctx.conditions.motion) return;
  const stage = one('[data-cap-stage]');
  const section = one('[data-cap-section]');
  if (!stage || !section) return;
  const cap = one('[data-cap]', stage);
  const halfA = one('[data-cap-a]', stage);
  const halfB = one('[data-cap-b]', stage);
  const chips = all('[data-cap-chip]', stage);
  const gap = Number(stage.dataset.capGap || 34);
  const desktop = !!ctx.conditions.desktop;

  // 1 · The capsule opens as the composition is read; the ingredients rise out of the gap, one after another.
  const open = gsap.timeline({ scrollTrigger: { trigger: section, start: desktop ? 'top 55%' : 'top 70%', end: desktop ? 'bottom 85%' : 'top 15%', scrub: 0.6 } });
  open.from(halfA, { xPercent: gap, ease: 'power2.inOut', duration: 0.5 }, 0)
    .from(halfB, { xPercent: -gap, ease: 'power2.inOut', duration: 0.5 }, 0)
    .from(chips, { opacity: 0, y: 36, scale: 0.9, stagger: 0.14, ease: 'power3.out', duration: 0.5 }, 0.18);

  // 2 · Handoff (desktop): the open capsule closes again and glides into the step's slot, where the step's own
  //     capsule takes over. Measured on every refresh, so the fit follows the layout.
  const slot = one('[data-cap-slot]');
  const stepArt = one('[data-cap-step]');
  if (!desktop || !slot || !stepArt) return () => open.kill();
  gsap.set(stepArt, { opacity: 0 });
  const travel = gsap.timeline({ paused: true });
  const build = () => {
    travel.clear();
    gsap.set(cap, { clearProps: 'transform' });
    // Centre to centre, scaled to the slot's width (measured where the capsule rests, so sticky offsets are included).
    const c = cap.getBoundingClientRect(), t = slot.getBoundingClientRect();
    const fit = { x: t.left + t.width / 2 - (c.left + c.width / 2), y: t.top + t.height / 2 - (c.top + c.height / 2), scale: t.width / c.width, transformOrigin: '50% 50%' };
    travel.to(chips, { opacity: 0, y: -12, stagger: 0.04, duration: 0.3 }, 0)
      .to(halfA, { xPercent: gap, duration: 0.5 }, 0.1).to(halfB, { xPercent: -gap, duration: 0.5 }, 0.1)
      .to(cap, { ...fit, rotation: -20, ease: 'power2.inOut', duration: 1 }, 0.1);
  };
  build();
  const st = ScrollTrigger.create({
    trigger: slot, start: 'top 95%', end: 'top 45%', scrub: 0.5,
    // Measured as the handoff begins (the stage is then at its resting place below the copy), not at refresh,
    // when the sticky stage still sits at the top of its column.
    onRefreshInit: () => { travel.progress(0); build(); },
    onEnter: (self) => { travel.progress(0); build(); travel.progress(self.progress); },
    onUpdate: (self) => {
      travel.progress(self.progress);
      const done = self.progress > 0.985;
      gsap.set(stepArt, { opacity: done ? 1 : 0 });
      gsap.set(cap, { visibility: done ? 'hidden' : 'visible' });
    },
  });
  return () => { st.kill(); travel.kill(); open.kill(); gsap.set([cap, halfA, halfB, stepArt, ...chips], { clearProps: 'all' }); };
});
