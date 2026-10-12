# Text motion and narrative typography

Use for animated headlines, expressive slogans, typographic scene transitions, split/rolling text, scroll-linked emphasis, typewriter/scramble effects, or revisions to them. Consider text choreography during visual direction on new builds; use it where it strengthens this brand's message. A narrow text-motion request does not reopen the entire site. This adds capabilities within workflow steps 5–6, not another research, test, analytics, or measurement phase.

Contents: [direction](#design-the-text-performance) · [tools](#choose-the-smallest-compatible-toolset) · [integration](#integration-branches) · [Persian](#persian-rtl-and-segmentation) · [semantics](#readable-and-accessible-by-construction) · [lifecycle](#layout-lifecycle-and-cost) · [checks](#embedded-construction-checks).

## Design the text performance

Read the current Brand, UX and Creative Design Brief and the [typography system](typography-system.md). Resolve the exact message, type roles, wrapping, and settled composition before the effect. Identify what the visitor should notice and why motion expresses the proposition. Keep text in counterpoint with the scene's image, frame, or recurring motif; do not animate every heading identically.

For meaningful text motion, add a compact record to the existing storyboard: **source/brand meaning -> exact text and narrative role -> phrase/word/line/glyph unit -> trigger and progression -> readable hold/resolved composition -> responsive and reduced-motion equivalent -> tool/ownership**. Choose entrance playback, state change, or continuous scroll deliberately. The information and real action must remain available without completing the performance.

| Mechanism | Useful role | Design limit |
| --- | --- | --- |
| Masked line or phrase reveal | Coordinate a claim with a frame opening or product reveal | Leave room for real glyph extents and mobile wrapping; settle into a complete readable statement |
| Word/phrase stagger | Give a sentence or value proposition intentional emphasis and cadence | Budget the total sequence against actual text length; long copy must not turn into a slow queue |
| Typographic composition change | Bring separated ideas into a relationship, move a key phrase into the next chapter, or transform hierarchy | Tie the before/after relationship to brand meaning; maintain reading order and a stable semantic source |
| Scroll-linked emphasis | Develop a short idea as a chapter unfolds | Keep unhighlighted words readable and the whole statement available on direct entry; avoid a low-contrast reading gate |
| Rolling label or phrase swap | Responsive button feedback or a genuinely meaningful change of state | Keep label dimensions, focus, and the real action stable; no endless rotating essential proposition |
| Typewriter or scramble | A short authored editorial/technical motif when it belongs to the brand | Optional, bounded and interruptible; preserve the final message and do not scramble instructions, terms, errors, or required form labels |
| Variable-type or numeric motion | Emphasize a change in an available font axis or a real value | Verify the font's actual axis and layout cost; preserve exact numbers/units and never invent counters as social proof |

These are mechanisms to choose or combine, not an effect checklist. A letter stagger alone does not satisfy the [cinematic craft target](cinematic-direction.md); meaningful typographic composition can itself form a signature scene. The reading hold and handoff matter as much as entrance. Keep surrounding text calm enough for the main moment to have emphasis.

## Choose the smallest compatible toolset

Check the existing stack, package/lockfile, scope, and available licenses. A splitter prepares DOM units; an animation engine moves them. They are different responsibilities, and a complete library is unnecessary when CSS or a few authored phrase wrappers suffice. Do not install all these alternatives, migrate an accepted engine for a text effect, or install packages just to edit this skill.

| Option | When to choose it | Access and boundary |
| --- | --- | --- |
| Existing CSS / browser animation | Whole-text, phrase, mask, or label movement without complex orchestration | No added package; retain a visible semantic baseline |
| Motion for React / existing Framer Motion | React-owned phrase/word components, state transitions, or compatible scroll-linked text | The core can animate authored units; preserve the project's package family and follow [Motion integration](framer-motion-integration.md) |
| Motion+ text tools | A licensed project benefits from its ready-made splitter or text components | `splitText` from `motion-plus` and components such as `Typewriter` are premium, not exports to assume in free `motion/react`. Verify access/API; use an available alternative when unavailable. [M1, M2] |
| GSAP SplitText | The site already uses GSAP, or text must join a coordinated pinned/scrubbed timeline | Supports responsive splitting and masking. Use the existing scene owner. GSAP's no-charge commercial license is distinct from MIT/ISC open-source licenses; check the relevant terms. [G1, G2] |
| Anime.js text utilities | An Anime.js project, or a framework-neutral splitter with a justified integration | MIT-licensed engine; `splitText` supports lines/words/chars and has a standalone `animejs/text` import since v4.2.0. Verify the chosen version. [A1, A2] |
| SplitType | A standalone splitter fits an existing engine and explicit resize/semantic management is acceptable | Produces units rather than animations. Line/absolute splitting needs rebuilding on resize and nested multiline content has limits. The inspected manifest declares ISC; verify the distributed release's license/notices. [S1, S2] |

Selection is a design/engineering judgment, not a benchmark ranking. For a React/Motion site, start with core Motion and authored units when sufficient. For a GSAP narrative, start with SplitText rather than introduce another engine. Use Anime.js or SplitType where their fit justifies the dependency and integration work. Record the actual resolved version, source, and license in the existing implementation record; no purchase or subscription is implied.

## Integration branches

### Motion / Framer Motion

Use semantic `motion` elements, variants/stagger, or scoped `useAnimate` for the appropriate scene. Derive visual units and accessible text from the same copy source. Prefer React-owned spans for simple phrase/word effects; retain whitespace and punctuation. Use the project's existing `framer-motion` imports or compatible `motion/react`, not both by default. For scroll, reuse the established progress/container and motion values; keep hooks unconditional and do not set React state every frame. Follow [Motion integration](framer-motion-integration.md) for lifecycle, reduced motion and property ownership.

Motion+'s DOM splitter requires membership/access and is separate from the core engine. Follow its installed API for font readiness, line handling and teardown; do not assume GSAP-style `revert()` or `autoSplit` methods exist. Keep an imperative splitter's subtree isolated from React reconciliation and restore/rebuild it when source copy changes. Ready-made examples still need the script, content, and accessibility decisions below. [M1]

### GSAP SplitText

Register `SplitText` from the installed GSAP package. In versions supporting them, use `autoSplit` with `onSplit` to recreate animations against the current units after font/width changes; return the animation from `onSplit` for documented cleanup/progress handling. Use supported masks and `revert()`; connect to the existing ScrollTrigger lifecycle rather than creating a second scene owner. Default ARIA handling does not preserve all nested semantics. Keep interactive rich text outside the split region or design a verified semantic alternative. [G1]

### Anime.js and SplitType

For Anime.js use the installed text API, requesting only needed units; the documented standalone entry can supply splitting without adopting a second animation engine. Check its current responsive, accessibility, and teardown APIs instead of copying GSAP options. [A1]

For SplitType explicitly select `types`, scope the target, recreate affected animation targets when re-splitting, and call `revert()` at teardown. Observe relevant container width changes for line/absolute splits; do not rebuild on every scroll event or depend only on a window resize. Provide the semantic strategy yourself and inspect nested-content wrapping. [S1]

For every branch: one splitter owns a text subtree; one engine writes a node's transform. Stop old animation before replacing its units. Reuse the page's scroll owner and coordinate with existing pins/Lenis; do not let independent engines race over the same spans.

## Persian, RTL, and segmentation

For Persian/Arabic connected writing, prefer intact **words, phrases, or lines**. Putting each letter in an independently transformed box can break shaping; do not use Latin character-splitting recipes by default. Preserve ZWNJ, joining characters, marks, punctuation, and the original string. W3C documents the special requirements of joined letters; this word/phrase-first policy is our implementation choice. [I1, I2]

Keep logical text order and let `dir`/bidi markup handle visual direction. Never reverse the string or DOM array to “fix RTL.” Choose the timing origin deliberately and inspect mixed Persian/Latin text and numerals. Use scoped direction isolation for embedded names/values where needed, not blanket bidi overrides. [I3]

When character effects suit a script, use grapheme-aware segmentation rather than `split("")` or assuming code points equal visible characters. `Intl.Segmenter` supplies locale-sensitive segmentation; detect support and preserve whole phrases if needed. Grapheme safety does **not** guarantee connected-script shaping. Do not strip separators or overwrite whitespace while wrapping units. [I4]

Validate with actual copy and the actual font, including a specimen such as «می‌خواهیم تجربه‌ای روشن بسازیم — BEX 2026». Do not change approved spelling, remove half-spaces, disable font features globally, add tracking between joined letters, or insert arbitrary line breaks to rescue an effect. Use a whole-run mask when individual units cannot preserve the composition. This applies to intermediate frames as well as the resting state.

## Readable and accessible by construction

- Keep real semantic HTML text, headings, and controls. Do not replace essential copy with canvas, a raster, or only SVG paths. Decorative visual clones must not create duplicate announcements, focus stops, or IDs.
- For a plain noninteractive heading, a complete accessible name with hidden visual split units can be appropriate; inspect the resulting accessibility tree. An `aria-label` is not a blanket fix for paragraphs or nested links/emphasis. Prefer leaving rich interactive text unsplit. Never hide a keyboard-focusable control inside `aria-hidden` content.
- Preserve selection/copy, reading order, and accurate labels where the content's role requires them. Typewriter/scramble frames are decorative updates, not a stream of live-region announcements; actual status feedback remains meaningful.
- Start from readable content. Only hide for an optional entrance once its controller can run and restore it; font, script, or dependency failure must not strand hidden text. Follow the existing site's rendering architecture without turning a small fix into a migration.
- Reduced motion shows the finished message immediately, removes continuous typographic travel/scrambling and unnecessary pins, and handles preference changes. Keep keyboard focus visible and support focus as well as hover for label feedback. Avoid automatic repeat where it distracts from reading; if repeating movement is required, provide applicable pause/control behavior.

These safeguards are integration requirements; a library's “accessible” feature label is not evidence that the completed component is accessible.

## Layout, lifecycle, and cost

Treat fonts, source copy, width, and wrapping as geometry inputs. Measure line splits after relevant fonts are ready; keep fallback content readable meanwhile. Recompute affected units after copy/locale, font, or container-width changes without nested wrappers or replaying an entrance on every resize. Preserve scene progress or intentionally settle it. Refresh only the relevant existing scroll geometry and never reset the visitor's scroll position as a repair.

Use natural wrapping and the [foundation system](layout-and-visual-foundations.md). Masks must accommodate real ascenders, descenders and marks; fixed pixel heights and copied padding values are not a typographic solution. Reserve a suitable stable area for changing phrases without leaving large mobile gaps. Verify line breaks before and after splitting, including fallback fonts and enlarged text.

Keep server and initial client markup consistent. Run browser measurement in the appropriate client lifecycle. Cancel pending font callbacks, timers, animations, and observers on unmount or rebuild; restore owned DOM/attributes and avoid duplicate setup during development remounts. Library-managed cleanup does not clean up unrelated custom timers or observers.

Limit split scope to deliberate moments, not an entire document. Prefer transforms/opacity for movement; scrutinize per-glyph blur, continuous string updates, layout properties, and font-axis animation for actual cost. Don't promote every letter to a permanent layer. Any frame-rate or bundle-size claim needs observed evidence from the built project.

## Embedded construction checks

Within step 6, inspect the affected scene at entry, a meaningful midpoint, and settled state; compilation alone cannot validate typography.

- Exact copy, whitespace/ZWNJ, shaping, reading order and semantic name survive the effect; no duplicate spoken labels or hidden focusable elements.
- Actual desktop/mobile widths, font loading/failure, enlarged text and longer copy preserve wraps and unclipped glyphs.
- Reverse/fast scroll, direct anchors, skipped entrance, interruption and route remount do not leave partial text, stale units or a stuck pin.
- Keyboard/focus and reduced-motion states expose the full message and real action; unavailable optional animation still leaves usable content.
- Rebuilding changes only the intended text region, with one splitter and transform owner, no observer loop, and no excessive active DOM/layers.

Record observed results and limits in the existing handoff. No user-testing study, analytics setup or business outcome measurement is introduced.

## Primary references

Reviewed **2026-09-27**. Recheck the relevant API/license when choosing a dependency version; these are documentation findings, not performance tests or universal compatibility guarantees.

- **M1:** [Motion splitText](https://motion.dev/docs/split-text) — premium utility and integration.
- **M2:** [Motion text animation](https://motion.dev/docs/text-animation) — technique overview and premium components.
- **G1:** [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) — splitting, masks, responsive lifecycle and ARIA caveats.
- **G2:** [GSAP standard license](https://gsap.com/community/standard-license/) — no-charge usage terms; not an MIT license.
- **A1:** [Anime.js splitText](https://animejs.com/documentation/text/splittext/) — API and standalone text module.
- **A2:** [Anime.js repository](https://github.com/juliangarnier/anime) — project and MIT license.
- **S1:** [SplitType documentation](https://github.com/lukePeavey/SplitType) — units, resize/revert and nested-line limitations.
- **S2:** [SplitType inspected package manifest](https://raw.githubusercontent.com/lukePeavey/SplitType/master/package.json) — declared package/license; not a claim about the latest published release.
- **I1:** [W3C Arabic and Persian layout requirements](https://www.w3.org/TR/alreq/) — joined-script requirements.
- **I2:** [CSS Text: shaping boundaries](https://www.w3.org/TR/css-text-3/#boundary-shaping) — shaping across inline boundaries.
- **I3:** [W3C inline bidi markup](https://www.w3.org/International/articles/inline-bidi-markup/) — mixed-direction inline text.
- **I4:** [MDN Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) — grapheme/word segmentation and compatibility.
