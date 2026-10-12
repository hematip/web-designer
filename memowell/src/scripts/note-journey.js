// "Facts in hand": one decorative note travels from behind the bottle, rides beside the reading
// column while its rows tick, and arrives complete beside the summary action.
// The pose is a pure function of live anchor geometry (reload, reverse, skips and anchors resolve
// correctly). One writer: this module. Native scroll only. Reduced motion / narrow screens: no travel.

const layer = document.querySelector('[data-note-layer]');
const liveNote = layer?.querySelector('[data-note]');
const anchors = {
  hero: document.querySelector('[data-note-anchor="hero"]'),
  column: document.querySelector('[data-note-anchor="column"]'),
  final: document.querySelector('[data-note-anchor="final"]'),
};
const sections = [...document.querySelectorAll('[data-note-section]')];
const progressNotes = [...document.querySelectorAll('[data-note]')].filter((n) => n.dataset.state === 'complete' || n === liveNote);

const root = document.documentElement;
const wide = window.matchMedia('(min-width: 68.75rem)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => ({ cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), s: lerp(a.s, b.s, t), rot: lerp(a.rot, b.rot, t) });

let live = false;
let size = { w: 0, h: 0 };
let queued = false;

// Rows tick when their section reaches the reading position — in every mode.
progressNotes.forEach((n) => { n.dataset.state = 'progress'; });
function updateTicks() {
  const line = window.innerHeight * 0.55;
  for (const sec of sections) {
    const reached = sec.getBoundingClientRect().top < line;
    for (const note of progressNotes) {
      note.querySelector(`[data-row="${sec.dataset.noteSection}"]`)?.classList.toggle('is-ticked', reached);
    }
  }
}

function measure() {
  if (!anchors.column) return;
  size.w = anchors.column.offsetWidth;
  liveNote.style.width = `${size.w}px`;
  size.h = liveNote.offsetHeight;
}

const poseOf = (el) => {
  const b = el.getBoundingClientRect();
  return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, top: b.top, h: b.height, s: Number(el.dataset.scale) || 1, rot: Number(el.dataset.rot) || 0 };
};

function updatePose() {
  const vh = window.innerHeight;
  const stickyTop = parseFloat(getComputedStyle(anchors.column).top) || 0;
  const hero = poseOf(anchors.hero);
  const col = poseOf(anchors.column);
  const fin = poseOf(anchors.final);

  // Beat 1 — leaves the bottle and settles in the column: page top -> column slot sticks.
  const travel = window.scrollY + col.top - stickyTop;
  const p1 = travel > 1 ? clamp01(window.scrollY / travel) : 1;

  // Beat 2 — carried past the professional band and availability: holds its screen place, tilts slightly.
  const restCy = stickyTop + col.h / 2;
  const released = clamp01((restCy - col.cy) / (vh * 0.3));
  const column = { cx: col.cx, cy: Math.max(col.cy, restCy), s: lerp(1, 0.86, ease(released)), rot: lerp(0, 3, ease(released)) };

  // Beat 3 — arrives beside the summary action.
  const finRest = Math.max(stickyTop, (vh - fin.h) / 2);
  const p2 = clamp01((vh - fin.top) / Math.max(1, vh - finRest));

  const pose = mix(mix(hero, column, ease(p1)), fin, ease(p2));
  liveNote.style.transform = `translate3d(${(pose.cx - size.w / 2).toFixed(1)}px, ${(pose.cy - size.h / 2).toFixed(1)}px, 0) rotate(${pose.rot.toFixed(2)}deg) scale(${pose.s.toFixed(3)})`;
}

function frame() {
  queued = false;
  updateTicks();
  if (live) updatePose();
}
const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };

function setMode() {
  const canTravel = !!(liveNote && anchors.hero && anchors.column && anchors.final) && wide.matches && !reduce.matches;
  live = canTravel;
  root.classList.toggle('note-live', live);
  if (live) measure();
  frame();
}

window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', () => { if (live) measure(); schedule(); });
wide.addEventListener('change', setMode);
reduce.addEventListener('change', setMode);
document.fonts?.ready.then(() => { if (live) measure(); schedule(); });
window.addEventListener('load', () => { if (live) measure(); schedule(); });
setMode();
