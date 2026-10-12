# GSAP choreography for cinematic scenes

Use for new cinematic scroll implementations and changes to an existing GSAP scene. Preferred stack for complex pinned/scrubbed sequences: GSAP timelines + ScrollTrigger for sequence control, with Lenis when smooth scrolling is needed. [Motion for React](framer-motion-integration.md) is an alternative for suitable React scenes and a possible companion for separately owned UI interactions; do not install both automatically. This is a tool choice supporting the scene, not a requirement to replace a working engine during unrelated edits. Check project versions and current official APIs before adding dependencies. Do not install globally or assume a plugin is present.

## Responsibilities and ownership

| Responsibility | Owner |
| --- | --- |
| Smooth scrolling | One Lenis instance; follow [Lenis integration](lenis-integration.md) |
| Related scene beats | One parent GSAP timeline controlled by one ScrollTrigger |
| Layout, pin measurements, clipping | Stable outer wrappers; animate descendants, not the pin target |
| Shared-element layout change | Flip when it solves actual layout continuity; capture and resolve real geometry |
| 3D/camera/shader | [Three.js integration](threejs-integration.md) when suitable; GSAP updates owned scene values, while Three.js/R3F owns rendering. Request frames for imperative updates if rendering is on demand. |

Do not attach independent scrub triggers to children of a scroll-controlled parent timeline. Do not let CSS, GSAP, Motion (including layout projection), and a custom loop compete over the same transform. Separate wrappers when engines coexist; separate x/y ownership on the same node is not sufficient. Do not combine GSAP Flip and Motion layout animation on the same element. Do not combine Lenis with ScrollSmoother or another scroll engine.

This ownership table describes the GSAP-controlled branch. A [continuous object journey](scroll-object-storytelling.md) may instead derive its pose from scroll in a custom Three.js/R3F frame evaluator, with GSAP animating separately owned HTML. Do not add a second timeline writer to that model. If GSAP supplies a progress signal, let the frame evaluator consume it and be the sole writer of the model pose; choose which layer smooths travel rather than stacking lag unintentionally.

For the GSAP path use `autoRaf: false`, subscribe `lenis.on('scroll', ScrollTrigger.update)`, and call `lenis.raf(seconds * 1000)` from one named GSAP ticker callback. Apply official lag-smoothing guidance deliberately at the application owner; it is shared ticker state, not a setting each component should repeatedly change. Remove the owned subscription/ticker callback and destroy Lenis on teardown. A separate WebGL loop must not tick that same Lenis again.

## Build the scene as a timeline

Use semantic labels for setup, transformation, reveal/reading, and handoff. Allocate timeline durations to the relative importance of those beats; a hold needs an actual interval with the intended text settled, not just a label at an instant. Use linear mapping for scrubbed spatial travel unless a deliberate easing choice remains controllable while reversing. Short entrance/hover tweens can use their own appropriate easing outside that parent scene.

- Pin a stable block wrapper and animate inner frame/art/text layers. Nested pinning is not supported; avoid relying on transformed ancestors for viewport-fixed positioning.
- Choose the scroll range from story length and viewport geometry. Prefer measured or function-based values and `invalidateOnRefresh` when sizes change. Longer tween duration does not make a scrubbed scene consume more scroll distance.
- Keep ordinary pin spacing unless the overlapping composition explicitly owns the replacement space. `pinSpacing: false` copied from a demo can make later content run underneath a pin or create an incorrect handoff.
- For horizontal `containerAnimation`, use `ease: 'none'`; its child ScrollTriggers cannot pin or snap. Define focus/anchor routing into the visible panel and a mobile equivalent. The animated gallery is not permission to hijack wheel direction across the entire site.
- Update progress-dependent visual labels from the controlling animation when numeric scrub continues after the last scroll event; trigger progress and visible animation progress can differ.

Use [ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and the [mistakes guide](https://gsap.com/resources/st-mistakes/) for the selected branch, rather than copying unrelated demo defaults.

## Shared-element transitions

For a click/layout state change, capture `Flip.getState(targets)`, apply the destination layout, then animate `Flip.from(state, options)`. For a scrubbed layout scene, precompute a supported from/to geometry and rebuild it at responsive changes; do not repeatedly reparent or measure DOM on every scroll frame. Use stable element identity and restore layout state when reverting.

Scope absolute positioning to the elements that need it; forcing every item absolute can collapse flow. Scaling may be inappropriate for approved fixed-size products or readable text; choose position/frame changes instead. Preserve full source aspect ratio and opacity. Consult [Flip.from](https://gsap.com/docs/v3/Plugins/Flip/static.from()/) and inspect the selected demo's source before adapting it.

## Responsive lifecycle and navigation

Use `gsap.matchMedia()` for motion-enabled desktop, motion-enabled mobile, and reduced-motion conditions; scoped GSAP work is reverted when conditions change. Prefer this current API over legacy `ScrollTrigger.matchMedia()`. Give custom event handlers, media, tickers, and renderer resources explicit cleanup; GSAP reversion does not own them. In React use scoped `useGSAP()` / context-safe late callbacks when that adapter exists; preserve the site's architecture.

When changing mode inside a pin: remember the current semantic scene/beat, revert the old scene and spacer, create the new geometry, refresh ScrollTrigger, update Lenis limits, then restore a meaningful position and focus. Keeping the old raw `scrollY` after removing a long pin can jump the visitor to the footer. Reduced motion removes optional scrub/pin/camera movement and shows content in a complete ordered composition; it must not leave Lenis stopped or essential text hidden.

Protect the saved scene token from timeline updates caused by reversion itself; do not overwrite it with reset progress during teardown. Commit state only from the active, settled scene and reject stale callbacks from a previous mode. Preserve a reading-hold chapter as well as the opening and final chapter.

For direct links into pinned chapters, route fragments to a named timeline beat (for example `labelToScroll()` where applicable), then set meaningful focus. A DOM `offsetTop` is not necessarily the displayed chapter's scroll position. Keep real fragment links/history and a standard static destination when enhancement is absent. Controls belonging to hidden panels must not remain keyboard-focusable offscreen.

After fonts, images, async content, or layout changes settle: refresh pin/timeline geometry before resizing Lenis. Create dependent pins in document order. Rebuild rather than stack another set of triggers on resize/remount. Do not repeatedly refresh on every animation frame.

## Evidence and cost

Exercise the actual signature transformation forward, reverse, quickly skipped, and from a direct URL; test keyboard, a constrained width, motion-enabled mobile, reduced motion initially and during a pin, and teardown/remount. Observe the midpoint and resolved frame, not only DOM dimensions. Verify that temporary pins, callbacks, and hidden states disappear on reversion.

Profile the implemented effects when performance claims are in scope. Large animated masks, filters, video decoding, multiple composited layers, and WebGL can be expensive even when their libraries are efficient. Prefer an equally distinctive lower-cost mechanism when necessary; importing GSAP/Lenis is not performance evidence. Do not promise universal 60 fps or autoplay.

Official reference snapshot checked 2026-09-14: [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [React integration](https://gsap.com/resources/React/), and [Lenis](https://github.com/darkroomengineering/lenis). These links are living implementation references, not copied manuals or claims of user-tested design quality.
