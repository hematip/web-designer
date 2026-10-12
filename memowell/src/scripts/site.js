// Site-wide behaviour: header state, click-only submenus, mobile menu panel.
// Everything here is progressive enhancement; links work without JavaScript.

const header = document.querySelector('[data-header]');

// Border under the sticky header once the page has moved.
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Disclosure submenus (Science, About): open on click, close on Escape, outside click or focus leaving.
const toggles = [...document.querySelectorAll('[data-disclosure]')];
const closeAll = (except) => {
  toggles.forEach((t) => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls'))?.setAttribute('hidden', '');
  });
};
toggles.forEach((toggle) => {
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    closeAll(toggle);
    toggle.setAttribute('aria-expanded', String(!open));
    panel?.toggleAttribute('hidden', open);
  });
  toggle.parentElement?.addEventListener('focusout', (e) => {
    if (!toggle.parentElement.contains(e.relatedTarget)) {
      toggle.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('hidden', '');
    }
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
  if (open) { closeAll(); open.focus(); }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-nav__item')) closeAll();
});

// Mobile menu: modal panel with focus kept inside while open.
const panel = document.querySelector('[data-menu-panel]');
const openBtn = document.querySelector('[data-menu-open]');
const closeBtn = document.querySelector('[data-menu-close]');
if (panel && openBtn && closeBtn) {
  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')];
  const open = () => {
    panel.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = () => {
    panel.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    openBtn.focus();
  };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  panel.addEventListener('click', (e) => { if (e.target.closest('a[href]')) close(); });
  window.matchMedia('(min-width: 75rem)').addEventListener('change', (m) => { if (m.matches && !panel.hidden) close(); });
}
