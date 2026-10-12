# Lenis integration

Use when implementing smooth scrolling or changing a Lenis-driven scene. Lenis is the owner's preferred scroll foundation for new scroll-driven brand builds. It does not create parallax, pinning, timelines, or WebGL scenes by itself. Preserve native scrolling when requested and existing engines during unrelated revisions.

For complex cinematic timelines pair it with [GSAP choreography](gsap-choreography.md), following the one-clock branch below. A React scene can instead use [Motion integration](framer-motion-integration.md); that does not require adding GSAP. The plain-page snippet is a lifecycle example, not a sufficient cinematic design or a second loop to paste alongside the GSAP branch.

## Version and setup

Verified on 2026-09-14 against the published **lenis 1.3.26** package, its types, and official sources. This is a tested baseline, not an instruction to pin every future project forever. Inspect the project's lockfile and installed API; for a new installation, verify the current release and record the resolved version. Main-branch documentation can differ from installed releases.

Use the project package manager to add `lenis`, not the old `@studio-freight/lenis` package. Import its matching `lenis/dist/lenis.css`. A no-build site may use version-pinned distribution files; keep JS and CSS versions aligned. Do not add packages during brief-only/review-only work or install them globally merely to update this skill.

For a plain client-rendered integration, this lifecycle is a starting point. Mount once for the intended scroll root; call `dispose()` on teardown. Keep page content readable if enhancement fails.

```js
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function mountSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    respectReducedMotion: true,
    syncTouch: false,
  });
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const onPreference = () => {
    if (preference.matches && !lenis.isStopped) {
      // Cancel inertia, including a locked tween, then immediately restore input.
      lenis.stop();
      lenis.start();
    }
  };
  preference.addEventListener('change', onPreference);
  return {
    lenis,
    dispose() {
      preference.removeEventListener('change', onPreference);
      lenis.destroy();
    },
  };
}
```

With this configuration (`autoToggle` is off), the explicit preference listener cancels an in-flight scroll and immediately restores input; an existing modal stop remains stopped. Cancellation does not finish the original navigation or call its completion callback: preserve meaningful focus/location in the application's navigation flow. Application-owned animation must respond to the preference too. For older installed versions lacking the verified reduced-motion API, provide a tested native fallback or make an in-scope upgrade; do not silently pass unsupported options.

## One clock and one scroll owner

Choose one driver for each Lenis instance; do not combine them:

| Integration | Clock ownership |
| --- | --- |
| Plain page, or Motion for React without an existing GSAP/custom Lenis driver | `autoRaf: true`; no separate `lenis.raf()` loop |
| Existing WebGL/custom render loop | `autoRaf: false`; call `lenis.raf(timeMs)` once per frame before reading scroll and rendering; reschedule the loop and cancel it on teardown |
| GSAP ScrollTrigger | `autoRaf: false`; subscribe `lenis.on('scroll', ScrollTrigger.update)` and feed `lenis.raf(seconds * 1000)` from one GSAP ticker callback |

In the GSAP branch, follow the documented lag-smoothing integration with regard for other users of the shared ticker. Retain callback identities, unsubscribe scroll updates, remove the ticker callback, and destroy the instance on teardown. `destroy()` cannot remove an application-owned render loop or ticker subscription. Do not add GSAP or WebGL just because Lenis supports integration with them.

Use Lenis's current animated position/progress for synchronized scene updates; do not build a second easing system from raw wheel deltas. Keep product scale and text safe areas governed by the motion reference. RAF timestamps use milliseconds; some renderer/ticker clocks expose seconds.

For React, use the official `lenis/react` adapter in a client boundary and avoid a second root instance. Set `options.autoRaf` explicitly: the adapter and core have different defaults. Use adapter callbacks for scroll state without causing a React render on every frame. Clean up custom tickers/listeners on unmount and verify remounts. Read the installed adapter documentation before adapting the plain-page example.

When Motion reads scroll through `useScroll`, use the actual scroll container controlled by Lenis and verify the installed combination, including offsets, reverse input, anchors, and changed layout/pin geometry. Motion does not become a second Lenis driver. If a custom progress bridge is necessary, give the scene one progress source and clean up its subscription; do not drive the same value from both that bridge and `useScroll`. See [Motion ownership rules](framer-motion-integration.md#share-ownership-safely-with-gsap-and-lenis).

## Navigation, input, and layout

- Keep real fragment links and semantic destinations. `anchors: true` enables the library's anchor handling; it is not a substitute for focus, URL/history, or route restoration. Test mouse, keyboard, direct hashes, and back/forward. Custom programmatic navigation owns its focus/history behavior.
- Use one header-offset policy. Verify how the installed version handles CSS scroll margins/padding before adding a Lenis offset. Avoid global CSS smooth scrolling competing with the chosen engine.
- Keep touch behavior conservative (`syncTouch: false`) unless scroll synchronization actually needs emulated touch and has been device-tested. Do not claim a desktop viewport simulation verifies iOS behavior.
- For a nested panel, use a targeted `data-lenis-prevent`/`prevent` exception and actual overflow containment. Broader nested-scroll detection is an option with event-processing cost, not a mandatory default. A modal's focus management and background lock remain application responsibilities.
- Leaving Lenis `stop()`ped is a scroll lock, not a reduced-motion solution. The paired stop/start above only cancels current motion; it does not leave scrolling disabled. Disable optional parallax/3D movement as appropriate while retaining meaningful scene content and synchronization.
- After fonts, images, routes, or pin geometry change, refresh measurements in the dependency order: settle layout/pinning, update Lenis limits, then restore the intended location. Automatic resizing does not establish that an external timeline has refreshed correctly.

Do not enable infinite scrolling, `autoToggle`, expensive dimension checks, or snapping by default. For a requested feature, check its browser support and interaction with existing layout first. Native CSS scroll-snap, iframe input boundaries, and Safari behavior need special attention; no universal frame-rate guarantee is made.

## Verify the integration, not just initialization

Exercise wheel/trackpad, keyboard, section links, a direct hash, back/forward, resize/content growth, and any nested panel. Check reduced motion initially and when toggled during movement; inspect the static scene. After teardown/remount, verify scrolling works and callbacks are not duplicated. Inspect a real midpoint and settled frame at desktop/mobile widths. Profile actual delivery when performance is in scope; library adoption alone does not prove a faster site.

## Official references

- [User-selected README](https://github.com/darkroomengineering/lenis/blob/main/README.md) and [release 1.3.26](https://github.com/darkroomengineering/lenis/releases/tag/v1.3.26): setup, integrations and release context.
- [Core implementation](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/core/src/lenis.ts) and [types](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/core/src/types.ts): options and lifecycle; prefer the installed distribution for exact runtime behavior.
- [Recommended CSS](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/core/lenis.css): stylesheet behavior and overflow integration.
- [React guide](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/react/README.md) and [provider implementation](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/react/src/provider.tsx): adapter defaults and cleanup.

This reference combines verified API facts with this skill's integration and scope decisions; it is not a copy of the upstream manual.
