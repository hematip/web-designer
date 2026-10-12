# Framer Motion / Motion for React

Use when the user requests Framer Motion, when a React project already uses it, or when React interactions, layout transitions, or scroll-linked composition make it a suitable implementation choice. This is the animation library, not the Framer website builder. Current documentation calls it **Motion for React**. Read the relevant branch here; do not load or install every animation tool.

## Choose the engine from the scene

Resolve the visual and motion intent in workflow step 5; verify dependencies and implement in step 6. Preserve the [cinematic target](cinematic-direction.md), real content, and [asset contracts](motion-and-assets.md) regardless of engine.

| Need | Preferred starting point |
| --- | --- |
| A small hover/focus response or simple transition already supported by CSS | Existing CSS; a dependency is unnecessary unless it serves other requested motion |
| React state changes, enter/exit, gesture feedback, shared layout, coordinated component animation | Motion for React |
| React scroll-linked composition that can be clearly expressed with motion values and ordinary/sticky layout | Motion is a valid sole animation engine when it achieves the chosen scene |
| Complex pinned chapters, tightly coordinated scrubbed timelines, or an existing GSAP scene | Preserve the skill's GSAP + ScrollTrigger preference; see [GSAP choreography](gsap-choreography.md) |
| Smooth scrolling needed by a new scroll-driven brand build | The existing [Lenis preference](lenis-integration.md) applies separately; Motion is not a smooth-scroll engine |

These are selection heuristics, not claims that either library is incapable of the other effects. Existing architecture and an explicit user choice take priority. Do not install GSAP alongside Motion merely because the project is cinematic, or add Motion to a working GSAP page for trivial hover effects. Combining them needs distinct responsibilities. A new signature scene still needs a meaningful transformation; a list of reveal animations does not satisfy that brief.

## Dependency and framework setup

Inspect the package manifest, lockfile, framework, React version, current imports, and existing animation ownership first. For a new compatible React integration, use the project's package manager to add `motion`; use `motion/react` for React components and hooks. The installation documentation checked on 2026-09-22 requires React 18.2 or newer; verify the chosen release's compatibility when implementing. Record the resolved version, not an invented latest version.

If the project already uses `framer-motion`, preserve its compatible package/import family for an in-scope change. Do not mix imports or install both direct dependencies by default. A deliberate migration must update imports and check version-specific changes using the [upgrade guide](https://motion.dev/docs/react-upgrade-guide). Some official examples retain older import paths; follow the actual installed package. Non-React projects do not gain React just to use this reference; preserve their architecture and choose the existing engine, CSS, or a separately verified framework-appropriate API.

For Next.js App Router, keep hook-driven animation in a small client component. Where only motion elements are required, check whether the installed version's `motion/react-client` entry fits the server component. Do not turn the whole site into a client component solely for animation. Keep initial markup and client rendering consistent; do not read browser globals while server-rendering. See [installation](https://motion.dev/docs/react-installation).

Do not install packages globally, during brief/review-only work, or merely to update this skill. Premium Motion+ examples and tools are not required dependencies or assumed entitlements.

## Implement the selected behavior

| Behavior | Implementation guide |
| --- | --- |
| State and gesture feedback | Use semantic `motion` elements, `animate`, variants, and appropriate `whileHover`/`whileTap`/`whileFocus` states. Keep keyboard focus visible and never make hover the only way to discover essential content. |
| Coordinated entrances or state changes | Share purposeful variants/transition roles; use springs or tweens to match the brand and interaction. Avoid a global preset that makes every section bounce or delays access to the CTA. |
| Exit animation | Use `AnimatePresence` with stable, unique keys on its direct children. Keep the presence boundary mounted while the child exits. Choose overlap/sequencing deliberately; check installed mode constraints. |
| Layout continuity | Use `layout` for a real layout change and `layoutId` for an intentional shared element. Apply destination layout through CSS/classes or style, allowing Motion to animate the change. |
| Entering the viewport | Use `whileInView` or `useInView` when entry should trigger an animation. Choose replay versus once-only behavior deliberately. This is different from continuously mapping scroll progress. |
| Scroll-linked transformation | Use `useScroll` with the actual container/target and explicit offsets, then map motion values through `useTransform`. Add spring lag only when it improves the scene without disconnecting it from reading or navigation. |
| Imperative sequence | Use scoped `useAnimate` when declarative state is insufficient. Keep selectors within the owned region and cancel application-owned work on teardown. |

Read the official [animation guide](https://motion.dev/docs/react-animation), [AnimatePresence](https://motion.dev/docs/react-animate-presence), [scroll guide](https://motion.dev/docs/react-scroll-animations), [useScroll](https://motion.dev/docs/react-use-scroll), or [useAnimate](https://motion.dev/docs/react-use-animate) for the branch being implemented. Do not copy an example's content-hiding initial state onto all public copy. Use a visible baseline, including `initial={false}` where appropriate, so optional entrance effects do not gate essential information.

### Layout, components, and asset fidelity

Resolve spacing, padding, grid tracks, responsive constraints, and hierarchy through the [foundation contract](layout-and-visual-foundations.md). Motion interpolates a change; it does not repair a poor destination layout. Do not use transforms as permanent spacing fixes.

Layout animation uses transforms and can scale descendants. Inspect text, logos, and approved product geometry throughout the transition. Where only position should change, consider `layout="position"` or separate a moving frame from the fixed-proportion asset. Scope shared element identities so unrelated component instances do not connect accidentally. Use `layoutScroll` or `layoutRoot` only for the corresponding scrollable/fixed layout context after checking the installed [layout API](https://motion.dev/docs/react-layout-animations).

When adding Motion to sourced controls, retain their real semantics, refs, keyboard behavior, focus return, and portal/scroll-lock lifecycle. With Radix-based components, use supported composition such as `asChild` when appropriate; conditional exits can require controlled state and `forceMount`. Apply that only to the involved primitive and keep the hidden/exiting state non-interactive as appropriate. Do not assume a Motion wrapper provides dialog or menu accessibility. Follow the actual component source and the [Radix integration guide](https://motion.dev/docs/radix).

### Text animation

Use [text motion](text-motion.md) for expressive headlines, split/staggered units, rolling labels and narrative scroll text. Core Motion can animate authored phrase/word units; its premium `motion-plus` splitter and text components require separate access. The reference compares GSAP SplitText, Anime.js and SplitType when a dedicated splitter is useful. Do not assume a `splitText` export in free `motion/react` or add another engine for a trivial effect.

Choose the unit by script and actual typography. Preserve Persian joining and ZWNJ, semantic reading order, font/reflow handling, and a readable reduced-motion state. Give a DOM splitter a stable owned subtree; React reconciliation and an imperative splitter must not concurrently rewrite the same children.

## Share ownership safely with GSAP and Lenis

Give each animated node/property one writer. Treat `transform` as one ownership unit: Motion writing `x` and GSAP writing `y` on the same node can still conflict. Motion layout projection, CSS transform transitions, and imperative code count as writers too. Use separate wrappers when responsibilities must coexist, keep pin/measurement wrappers stable, and avoid animating a shared-layout element with GSAP Flip at the same time. Prefer one engine per coherent scene.

Lenis owns scrolling; Motion reads or renders animation state. Follow the [one-clock rule](lenis-integration.md#one-clock-and-one-scroll-owner) for the Lenis instance. Motion's internal scheduling is not an instruction to call `lenis.raf()` again. If GSAP already drives Lenis, keep that single driver. Without GSAP/custom-loop ownership, use the documented Lenis auto-RAF branch; adding Motion alone does not require a GSAP ticker.

For `useScroll`, observe the same actual scroll container that Lenis controls. Verify the installed combination against native position, anchors, reverse input, resize, and changed pin/layout geometry. A transformed virtual scroller is not automatically compatible with native scroll measurement. If a scene requires a custom progress bridge, use one documented source and motion values, unsubscribe on teardown, and do not simultaneously drive the same value from `useScroll` and another subscription. Avoid redundant smoothing of an already delayed scene.

## Reduced motion, lifecycle, and delivery cost

Set `MotionConfig reducedMotion="user"` at a suitable application boundary. It suppresses transform/layout animation but does not automatically suppress every opacity/color effect, custom loop, video, or imperative animation. Use `useReducedMotion` to explicitly adapt those branches and scroll parallax; keep hooks unconditional. Show a complete, intentionally composed reading state and preserve controls, anchor access, and focus. Reducing duration to near zero while retaining a long empty pin is insufficient. See the [accessibility guide](https://motion.dev/docs/react-accessibility).

Use motion values for continuous visual updates rather than setting React state on every frame. Let scoped APIs own their animations; separately clean up external subscriptions, timers, observers, and asynchronous callbacks. Exercise interruption, unmount/remount, and the project's development lifecycle so stale callbacks cannot restart an abandoned scene. A route exit requires a persistent owner and a supported router strategy; wrapping an arbitrary remounting route in `AnimatePresence` does not establish correct navigation.

Keep the installed feature set proportional to the page. If bundle cost warrants `LazyMotion`, use the compatible lightweight `m` entry and verify that the selected feature bundle supports all required behavior, especially layout or drag. Do not mix full `motion` components into that boundary unintentionally. Use [LazyMotion](https://motion.dev/docs/react-lazy-motion) for the installed release; do not promise a fixed bundle saving or universal frame rate. Expensive imagery, filters, video, and layer count still matter.

## Embedded construction checks

Apply only to the affected integration, inside workflow step 6:

- Required project checks, imports, hydration, initial readable state, and actual rendering succeed.
- Enter/exit, interruptions, layout changes, focus/keyboard use, mobile/RTL composition, and asset proportions remain correct, including intermediate frames.
- Scroll-linked scenes handle reverse/fast scroll, direct anchors, resized or newly loaded content, and coexistence with any existing pins/smoother.
- Reduced motion works on first load and preference change; content remains available, optional loops stop, and navigation remains usable.
- Teardown/remount leaves no duplicate listeners, running abandoned sequence, stuck scroll lock, or competing transform writers.

Keep functional, visual, and creative judgments separate. Record observed evidence and unverified states using [review and release](review-and-release.md). This adds no user-testing phase, analytics, business outcome measurement, or post-launch monitoring.

Official documentation above was reviewed on **2026-09-22**. API guidance comes from those sources; engine selection, ownership safeguards, and workflow placement are this skill's implementation policy. Recheck relevant APIs when changing dependencies rather than loading the entire reference set on every edit.
