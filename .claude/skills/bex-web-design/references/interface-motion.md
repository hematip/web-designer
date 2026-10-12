# Functional interface motion

Read for feedback, component transitions or loading states. This complements the existing [cinematic direction](cinematic-direction.md), [text motion](text-motion.md) and [continuous object storytelling](scroll-object-storytelling.md); it does not replace the owner's brand-specific cinematic default with microinteractions.

## Define a role and ownership

For each meaningful transition state **cause → relationship/feedback it clarifies → resolved state → interruption/reduced-motion behavior**. A hover animation, dialog entrance and scroll chapter have different jobs. State feedback follows actual input/results from [interaction and status](interaction-and-status.md); animation completion cannot determine whether a transaction succeeded.

Reuse an appropriate installed engine or native CSS. Use [Motion for React](framer-motion-integration.md) for compatible state/layout/presence behavior, the existing GSAP contract for narrative timelines and Three.js where spatial rendering serves the direction. Do not install multiple engines for elementary hover states. Keep one owner per animated property/transform; use distinct wrappers for independent layout and scene transforms.

## Functional timing and state behavior

Start with the established project motion tokens. Without them, authored starting ranges may be about 100–180ms for small feedback and 180–300ms for a contained panel transition, adjusted to distance, reading context and input. These are tuning examples, not standards or measured universal optima. Use consistent easing roles; abrupt state feedback may be immediate, entrances can decelerate and exits may be shorter. Avoid overshooting essential text or requiring visitors to wait for controls.

Hover responses apply to capable pointers and do not substitute for visible focus. Keep pressed/selected behavior distinct. Enter/exit transitions preserve focus and layout stability; a closing panel must not keep invisible focusable controls active through an exit animation. Focus visibility, disabled state and error messages must not wait for a fade to complete. Verify presence/unmount behavior of the chosen primitive rather than overriding its accessibility lifecycle.

Use measured height/layout animation carefully with actual content and font loading; avoid a guessed max-height that truncates detail. Loading animation represents a real pending state; preserve stable geometry and a readable status label. A decorative loop should not attract more attention than the user's task. Avoid artificial delays, fake progress or endlessly replaying attention-grabbing motion.

## Reduced motion and responsive behavior

Respect the platform preference and the project's controls. Replace nonessential travel, scale, parallax and loops with an immediate or restrained state change, keeping the full information, reading order and useful controls. Any brief opacity change still must not gate meaning. Reduced-motion narrative scenes need an intentionally resolved composition and compatible scroll flow.

Inspect rapid repeated input, interrupted entrance/exit, resizing, keyboard focus, RTL, reduced motion and settled output for the affected interaction. Clean up timelines/listeners on teardown, avoid replaying resolved states unnecessarily and preserve readable text throughout. Functional motion should make behavior understandable without weakening narrative craft or expanding the page's feature scope.
