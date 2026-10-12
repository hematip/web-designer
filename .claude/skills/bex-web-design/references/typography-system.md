# Typography system: choose, compose, verify

Use for new visual systems, font selection, text hierarchy, or a typography review/fix. A wording-only edit does not reopen the brand's font decision. This is a design workflow, not a universal font ranking. Source IDs resolve in [research sources](research-sources.md#typography-research); the business matrix, starting ranges, and decision record below are our synthesis, not experimentally established winners.

Contents: [selection](#choose-for-the-brief) · [business fit](#business-and-page-fit) · [candidates](#small-source-backed-shortlist) · [Framer discovery](#framer-font-discovery) · [hierarchy](#compose-the-hierarchy) · [Persian](#persian-and-bilingual-composition) · [delivery/motion](#font-delivery-and-cinematic-motion) · [QA](#typography-quality-gate).

## Choose for the brief

1. **Resolve the job.** Identify page role, audience, brand voice, languages, text density, typical reading device, and the action that must remain clear. Turn brand adjectives into visible hypotheses: compare, for example, compact versus open forms or quiet text versus expressive display, then judge them in the page. A SaaS marketing hero and its dashboard can share a family but need different hierarchies. Preserve approved brand fonts; assess usable styles and gaps before proposing replacement. [T12]
2. **Apply hard gates before taste.** Confirm required script/glyph coverage and shaping, legitimate web embedding rights, usable files, and needed weights/styles. An installed desktop font or a foundry specimen is not evidence of a web license. Check the actual release/subset, not only the family name. Do not quietly substitute fallback glyphs for unsupported Persian. If an ideal paid family is unavailable, name that gap and select an available legal alternative without buying a license or blocking the rest of the design.
3. **Compare a small shortlist.** Usually two or three plausible families/treatments suffice. Use the same real headline, paragraph, navigation/CTA, smallest necessary label, prices/numbers, and mixed-script fragment. For an implemented design, render these at intended sizes on desktop and mobile. Compare legibility, brand character, hierarchy range, density/wrapping, pairing, and delivery cost; prioritize these according to the task rather than adding an arbitrary numerical score. [T1]
4. **Commit with a reason.** Record the selected family and role, important weight/style/axis choices, a rejected alternative and the meaningful tradeoff, source/license/file status, and fallback. An unrendered concept remains a proposal. If the task asks for one answer, give the recommendation rather than making the user adjudicate every candidate.

For Latin, inspect ambiguous forms (`I l 1`, `O 0`), counters/apertures, x-height, stroke contrast, width and rhythm at use size. High-contrast hairlines or compressed display faces may work in a short hero yet fail in descriptions. For Persian, assess joined word shapes, dots, counters, ascenders/descenders and diacritics; Latin x-height and serif/sans labels do not adequately describe its reading behavior.

Pair **roles**, not just names: a distinct display voice can contrast with a quiet reading face, while a single capable family may handle both. Similar-but-not-quite faces often add noise without hierarchy. Check perceived size, darkness and baseline together; equal CSS size/weight does not guarantee optical equality. Do not add a second family just to satisfy a pairing formula. IxDF's pairing examples are useful comparisons, not a requirement for two or three families or an obligatory serif/sans pair. [T1, T11]

Evaluate **legibility** (distinguishing characters/word forms) separately from **reading flow** (following a passage) and **message comprehension** (understanding the copy). A beautiful isolated alphabet is not proof of usable interface text. Include the actual background, neighboring imagery and control states in the specimen. [T11, T12]

## Business and page fit

These are hypotheses to test against the actual brand and content, not industry-to-font laws.

| Site/task | Prioritize | Direction to explore; typical failure to avoid |
| --- | --- | --- |
| SaaS, B2B product, finance/data UI | Fast scanning, distinct numerals, resilient labels, useful weights | Screen-oriented text family; stronger marketing display is possible. Verify tabular figures in numeric columns; avoid an oversized campaign scale inside dense UI. |
| Commerce, food, coffee, consumer brand | Product identity plus readable names, prices and conditions | Characterful headings with robust product/body/UI roles. The story can be expressive; price, variants, ingredients and checkout language must not become tiny decorative captions. |
| Luxury, architecture, hospitality | Deliberate proportion, material/cultural fit, confident whitespace | Compare refined text/display treatments, not automatically a thin serif. Reservation controls and mobile descriptions need readable weight and contrast. |
| Editorial, education, culture | Sustained reading, clear subsections, annotations and links | Text-optimized serif or sans; consider Persian text/Naskh-informed families for appropriate content. Avoid importing a display face or a print layout unchanged into long mobile prose. |
| Health, public service, professional services | Unambiguous instructions, broad audience, calm trust | Familiar, robust forms with a modest hierarchy and generous reading conditions. A clinical font cannot substitute for accurate content; do not assume older users need the same scale as a fashion campaign. |
| Creative studio, portfolio, event | Distinctive voice, memorable names and program information | An expressive display treatment may be appropriate; isolate experimentation from navigation, schedules, prices and forms. “Wow” cannot depend on unreadable type. |

## Small source-backed shortlist

Starting candidates, not required defaults or an exhaustive catalog. Obtain files from the designer/foundry or authorized distributor and inspect the exact package. No font binaries or commercial licenses are included in this skill. The fit notes are our design judgments, not the source's comparative ranking.

| Candidate / source | Useful comparison role | Constraint to verify |
| --- | --- | --- |
| [Vazirmatn](https://github.com/rastikerdar/vazirmatn) | Persian reading and utility UI baseline | OFL; main and non-Latin variants differ. Inspect which is delivered before pairing English. |
| [Estedad](https://github.com/aminabedi68/Estedad) | Compact, contemporary Persian/Latin text and stronger headings | OFL; compare density at small sizes. The repository documents a weight axis; do not invent an optical-size axis. |
| [Dana](https://fontiran.com/fonts/dana) | Persian geometric/Naskh-informed product and body text | Commercial; package weights/features and the project's web license must be available. |
| [Peyda](https://fontiran.com/fonts/peyda) | Persian geometric brand headings with a related text family | Commercial; prove small-text fit rather than assuming expressive headings imply equally good captions. |
| [Inter](https://rsms.me/inter/) | Latin screen UI, data and product marketing | OFL; do not assume Persian coverage. Check the chosen file's axes/features and supply an intentional Persian companion. |
| [Source Sans 3](https://github.com/adobe-fonts/source-sans) | Latin interface and approachable reading alternative | OFL; select actual required styles, verify locale coverage. |
| [Source Serif 4](https://github.com/adobe-fonts/source-serif) | Latin editorial reading or restrained expressive display | OFL; choose appropriate optical size; compare with Source Sans as a coordinated pair, not a mandatory pairing. |

A culturally specific, licensed brand face outside this list may be the better choice. Search authoritative specimens when the shortlist misses the brief; do not default to Vazirmatn for every Persian site or Inter for every English site. Conversely, familiarity is not a reason to reject a face that genuinely fits.

## Framer font discovery

Use the user-supplied [Framer guide](https://www.framer.com/blog/best-fonts-for-websites/) as an expanded discovery pool when the brief leaves font choice open. Its practical themes are legibility, language/style coverage, licensing, loading cost, and restrained pairing. It is editorial guidance, not evidence that a particular family improves conversion. [T13]

Unranked candidates from that guide: **Archivo, Aspekta, Barlow, Cabinet Grotesk, Caprasimo, Chakra Petch, Domine, EB Garamond, Epilogue, Gambarino, Instrument Serif, Inter, Manrope, Melodrama, Ojuju, Ortica, Pencerio, Public Sans, Ribes, Satoshi, Space Grotesk, Stardom, Tanker, Unbounded, Zodiak**. Do not download the entire list or treat its first item as a default.

Apply the existing selection steps to this pool:

- Translate the brief into a role need before choosing names: sustained reading, compact controls, expressive titles, numerical information, or a combination. When direction is unresolved, compare visibly different treatments on the same real copy. Keep variation relevant to the brand rather than rotating families for novelty. Existing approved typography remains authoritative for scoped revisions.
- Keep this catalogue separate from script support. For a Persian or bilingual site, use the Persian gates below and verified first-party families above; a Latin candidate may serve a companion role only after checking the actual subset, joining, punctuation, and metrics. Do not use Latin display novelty to disguise unsupported Persian glyphs.
- Verify the chosen release against the designer/foundry or authorized distributor before committing. Record URL, release/file, web licence, script coverage, actual weights/styles, and available axes. A Framer picker entry or article label does not establish rights or capabilities in a standalone project. Catalogue classification is provisional: Google's current metadata lists **Caprasimo as a single normal 400 display face**, whereas **EB Garamond supplies normal/italic files with a 400–800 weight axis**. This corrects the guide's variable/sans description of Caprasimo; recheck the release actually used. [T15]
- Select roles and files the page actually needs. One family can suffice; two is a useful starting heuristic, not a quota, and four body weights are not compulsory. Do not invent italics, weights or variable axes to satisfy a recommendation. Compare variable and static payloads for the required subset. [T1, T6, T13]
- Prefer WOFF2 for modern delivery. TTF and OTF are also supported web font formats; reject them only for a concrete compatibility, delivery, or licensing reason, not a blanket claim that they are desktop-only. File format does not grant embedding rights. [T14]

Use the existing typography decision record and quality gate, including the chosen fallback and observed rendering. Keep research notes internal; do not present a shortlist as a proven ranking or include unsupported font-effect statistics in public copy. A broader catalogue expands choices without replacing the project's identity or hierarchy system.

## Compose the hierarchy

Start with a comfortable paragraph and essential control, then shape the headline relationship. Reading texture depends on the combination of face, size, width and line spacing, not size alone. Butterick emphasizes the reading block; USWDS and the Persian Sonnat system illustrate different contextual settings. Their numerical prescriptions are not interchangeable universal rules. [T2, T3, T4]

Create only the roles the page needs, and reuse tokens instead of assigning a new size to every section. Keep the role-to-style mapping stable across pages and states, using whitespace and alignment with size/weight to signal importance. A font change at each chapter is not a substitute for narrative hierarchy. [T11, T12]

| Visual role | Content/semantic purpose | Establish |
| --- | --- | --- |
| Display / page title | Principal page message, usually the page's `h1` | Maximum visual emphasis, usable mobile wrap, safe line height; not an excuse to turn every section into an `h1` |
| Section / subsection | `h2` / `h3` according to information nesting | Clearly differentiated importance and spacing; choose levels for structure, not desired size |
| Lead / deck | Explanatory paragraph, not automatically a heading | Bridges title and reading text without competing with both |
| Body / list | Sustained explanation and evidence | Comfortable reading weight, measure, line height and paragraph rhythm |
| UI / label / data | Navigation, buttons, input labels, price or table value | Crisp at actual size, truthful emphasis, adequate space for translation and errors |
| Supporting / caption | Annotation, photo credit, secondary detail | Still readable and sufficiently contrasted; small text must not hide decision-critical terms |

For each used role record **family/fallback, real weight/style, font size at mobile and desktop (or bounded fluid rule), unitless line height, tracking, maximum measure, and adjacent spacing**. Keep HTML semantics separate from the visual token; a card `h3` can use a compact style without breaking the outline. Do not turn a label, eyebrow, or slogan fragment into a heading merely for appearance.

### Calibrate, do not copy a magic scale

- For an ordinary reading page, a useful **initial experiment** is a 1–1.25rem body, with its appearance checked at the user's normal root size. Dense UI, large-type reading and expressive campaigns need different decisions. WCAG AA does not prescribe a universal 16px minimum.
- Try a restrained hierarchy for data-heavy/product pages and more display contrast for short narrative openings. A modular ratio can generate candidate sizes, but edit those values when real copy, language or mobile wrapping shows weak separation. Do not require identical ratios across languages or devices.
- Starting body line-height experiments: roughly 1.45–1.7 for Latin and 1.65–2 for Persian. Persian headings often need more vertical room than tight Latin display type. These are **skill heuristics**, not standards or limits; inspect dots, descenders, diacritics and multi-line headings at every used weight.
- For Latin reading blocks, experiment near 60–70 characters per line; `ch` measures the advance of `0`, not an average letter. For Persian, set a responsive block width and judge actual joined lines, return sweeps and density; do not relabel the same `ch` count as a Persian character count. Short labels and display headings are different cases. [T3]
- Use `rem` for text tokens and unitless line heights. A fluid `clamp()` can mix relative units with viewport growth, but it must still allow effective enlargement: `rem` bounds alone do not prove a `vw`-heavy preferred value is zoom-safe. Test the actual result; use stepped/rem sizes when simpler. Do not lock the root size to defeat user settings.
- Give a heading more separation from the previous topic than from its own paragraph; keep repeated patterns consistent. Differentiate with a few reliable cues (size, weight, position, spacing), not color alone or numerous nearly identical sizes. Let long titles wrap; do not shrink them to fit an arbitrary line count.
- Use start alignment for sustained prose. Center short text intentionally; do not center entire long descriptions by default. Avoid forced justification, artificial stretching, and hard-coded `<br>` throughout responsive body copy. A deliberate hero break must be checked at other widths. Use hanging punctuation/optical alignment only if it improves the observed result.
- Tracking is face-, size- and script-specific. A modest Latin all-caps eyebrow treatment is not a global paragraph style. Use actual available weight/italic/axis designs rather than synthetic bold, slant, or `scaleX` as a substitute for choosing a fitting face.

For ordinary English interface labels, buttons, helper text and headings, default to sentence case unless the approved brand or a proper name specifies otherwise. Do not apply title case or uppercase globally through CSS; Persian has no casing distinction. Keep the number of weight roles restrained and tied to real font files, rather than inventing a new weight for every component. Product and marketing surfaces may share a family while using separate role scales: campaign display contrast should not spill into form labels, navigation or dense tables. Use stable label/button line heights with room for long translations; table headers, values and helper text need intentional emphasis, and aligned numbers need verified tabular figures where appropriate.

## Persian and bilingual composition

- Use real Persian content with `lang="fa" dir="rtl"`, logical CSS properties and meaningful DOM order. Isolate Latin codes, URLs or model names with suitable `bdi`/direction markup. Review punctuation and parentheses in context, not as isolated characters. [I1]
- Preserve `ی` (U+06CC), `ک` (U+06A9), `پ چ ژ گ`, نیم‌فاصله (U+200C), and needed diacritics. Distinguish intentional source text from normalization; do not silently alter protected copy or identifiers. The sample `می‌خواهم دربارهٔ ویژگی‌های محصول بیشتر بدانم.` exposes more than a font name preview.
- Respect joining and word shapes. Do not apply Latin tracking or per-character animation wrappers to Persian runs. Begin with normal letter spacing; use intact words/lines or a masked duplicate only when the original readable text remains accessible. Inspect ZWNJ boundaries, dots and marks during clipping/transforms. ALReq explains why Arabic-script stretching is not equivalent to uniform Latin tracking; it is a **draft layout note**, not a WCAG rule. [I2]
- Numerals are a content decision: format display prices/dates for the locale, while preserving phone numbers, IDs, email addresses and machine-readable values. A forced Persian-digit font can change the appearance of Latin codes; use the appropriate font variant or formatting strategy instead. Test `۱۲۳٬۴۵۶ تومان`, `SKU A-120`, `09:30` and `name@example.com` in their actual contexts.
- Choose whether the Persian family supplies Latin glyphs or an explicit companion does. Match apparent weight, baseline and scale in the same line without forcing identical numeric sizes. Verify punctuation, digits and currency do not fall into an unintended third face. Arabic coverage alone does not prove good Persian shaping or all Persian letters. [T5]

## Font delivery and cinematic motion

For animated headlines and narrative typography, use [text motion](text-motion.md) for library choice, script-safe units, semantics, and lifecycle. Choreograph actual words/phrases/lines against the brand message; independently boxed Persian letters must not break joined writing. A splitter does not replace typography selection or fix a weak settled layout.

Keep text useful before the preferred face arrives and if it fails. Use licensed web files, typically WOFF2 for modern targets, and ship only useful weights/styles. Compare variable versus static delivery for the actual use; a variable font is not automatically smaller. Choose `font-display` deliberately: `swap` exposes fallback then can change layout; `optional` may leave fallback in use on a slow first visit. Measure transfer and shifts rather than claiming a speed gain. Preload only genuinely critical faces. [T6]

Declare the real weight/style/range in `@font-face`; verify supported OpenType features/axes before using them. Use `font-optical-sizing: auto` only with a face that provides optical sizing. Test `tabular-nums` where aligned figures matter; the CSS declaration alone does not prove the glyph feature exists. Preserve license notices. Do not subset away shaping tables, joining forms, ZWNJ handling or required language glyphs. If tuning fallback with `size-adjust`/metric overrides, measure this font/fallback pair; never copy unrelated percentages.

For cinematic scenes, type metrics are layout inputs. Keep readable text while fonts load; after relevant font readiness and line reflow, rebuild affected text splits/measurements and refresh the existing scroll engine's geometry with proper cleanup. Recheck resize, zoom and late-loading assets. Read the project's [GSAP](gsap-choreography.md) and [Lenis](lenis-integration.md) guides when altering those systems. Do not add a second loop or reset a visitor's scroll position as a font-loading workaround.

Design the settled text composition first, then the reveal and reading hold. Keep headings and essential controls accessible without completing a sequence. Do not use fixed-height pinned/clipped text boxes that fail when copy wraps or a fallback is wider. Adapt/unpin the scene when necessary; retain content and a deliberate static/reduced-motion layout. If visual text is duplicated for effects, prevent duplicate announcements while keeping the semantic original available.

## Typography quality gate

For new builds or material type changes, record what was **specified**, **observed**, and **not tested**. A font-family declaration, build success or a single screenshot is insufficient.

1. **Selection and delivery:** evidence of source/license suitability and files used; inspect network/font loading plus rendered glyphs and real weights. Browser rendered-font tools or font-file metadata can help. `getComputedStyle().fontFamily` only reports the requested stack; `document.fonts.check()` alone does not prove that each glyph used the desired face. Include a font-failure/fallback state.
2. **Hierarchy and reading:** inspect actual headline, paragraph, control and supporting text together at desktop and mobile/constrained width. Can you distinguish the page message, section, explanation and action without relying on color? Check semantic outline independently. Retain a specimen/screenshot and explain any unresolved font comparison; do not claim universal readability or user preference.
3. **Script integrity:** inspect the Persian/mixed examples above in real components; no damaged joins, clipped marks, wrong direction, misleading numeral substitution or accidental fallback. Check longer copy, not just the shortest slogan.
4. **Adaptation:** test text enlarged to 200% without loss and ordinary vertically scrolling content at 320 CSS pixels, respecting criterion exceptions for genuinely two-dimensional content. Viewport size alone does not establish text enlargement. Check real controls, expanded errors and multi-line headings. [T7, T8]
5. **Spacing resilience:** test applicable user overrides together: line-height at least 1.5, paragraph spacing 2em, letter spacing .12em and word spacing .16em, without lost content/function. These are the SC 1.4.12 **override-test values**, not required author defaults. Respect the criterion's language/script exception; do not force Latin tracking onto Persian as its authored style. [T9]
6. **Contrast and motion:** check text on actual backgrounds throughout meaningful frames and at rest. WCAG AA normally requires 4.5:1, or 3:1 for qualifying large text (18pt regular/14pt bold; approximately 24px/18.67px), with defined exceptions. A heading tag alone does not qualify. Check reading holds, clipping and reduced motion after fonts settle. [T10]

Fix observed defects within build/fix scope, then recheck affected states. For review-only requests, report findings. Without browser access, deliver the type specification and test plan, explicitly leaving appearance/delivery unverified. These selected checks are not a full accessibility certification, a reading study, or user acceptance.
