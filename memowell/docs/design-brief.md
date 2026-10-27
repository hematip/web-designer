# Memowell® website: Brand, UX and Creative Design Brief

Internal working record. Not public copy.
Version 1 · 2026-10-12 · Source authority: `brief/BRIEF.md` (agency-approved build brief, identical in both uploads) and the assets in `brief/assets/`.

## Executive summary

- **Focused problem.** People who notice small memory changes, in themselves or in someone close, and caregivers acting for them, cannot find clear and reliable information about memory, Alzheimer's and Memowell in one place. Some readers are elderly or have memory problems. The site informs them calmly and prepares them for **a conversation with a doctor or pharmacist** (DOC-01 Part 1, Part 2.1). It does not sell and it gives no medical advice.
- **Offer.** Memowell®, a dietary supplement (90 vegetarian capsules) with K-Vie™ boswellic acids, made by Kondor Pharma in Canada under NPN 80107357.
- **Primary action.** Take the one-page summary to a doctor or pharmacist. The summary PDF does not exist yet, so every summary button has an honest pending state. There are no dead links.
- **Secondary paths.** Professionals go to `/science/professionals` (scientific-question and feedback forms). Distributors go to `/about/partners` (partnership form). All forms are built but inactive.
- **Fixed.** The English copy is verbatim, plus the site map, the claim matrix, the official assets and the technical requirements. EN, FR and AR are built from day one. FR and AR stay pending. AR is built but not published.
- **Creative opportunity.** The approved closing line, *"the conversation goes better with the facts in hand"*, becomes the site's narrative premise. As the visitor reads, the homepage visibly gathers a doctor-ready note.
- **Non-goals.** No shop, price, testimonials, newsletter, analytics, audience gateway, competitor comparison, FDA mark, generated people or generated packaging.

## Source register

| ID | Source | Coverage |
|---|---|---|
| DOC-01 | `brief/BRIEF.md` Parts 1–9 | Read in full (text) |
| AST-01 | `assets/official/memowell-bottle-front.png` | Viewed. Front label: blue organic blobs, cyan diagonal stripes, "Memory Health", "90 vegetarian capsules", ™ on wordmark |
| AST-02 | `assets/official/memowell-capsule-in-hand.jpeg` | Viewed. Cream/tan capsule between finger and thumb, white background |
| AST-03 | `assets/official/memowell-bottle-in-hand-photo.jpeg` | Viewed. Casual office photo, shows scale |
| AST-04 | `assets/web-ready/*` logos | Viewed. Memowell wordmark (blue→navy "memo", cyan "well", leaf, ™); Kondor Pharma (blue + green leaf) |
| AST-05 | `existing-brand-communications/*` | Viewed. Context only. The Instagram headline is the source of the H1. The social creative copy and people are **not** usable |

## Key findings → implications

| ID | Finding (DOC-01 locator) | Implication |
|---|---|---|
| FIND-01 | Readability for older people and caregivers is a priority; some readers have memory problems (P1, P7) | Body text 20px desktop / 19px mobile, line-height 1.6, measure ≈ 36rem, tap targets ≥ 48px (buttons 56px), click-only disclosures (no hover menus), predictable sticky header, motion never carries meaning |
| FIND-02 | Primary action is a doctor/pharmacist conversation, prepared with a one-page summary (P2.1) | Signature scene = the summary note assembling; header action points to the summary section |
| FIND-03 | Visuals count as claims: no cure, no before/after, no "fog lifting", no mechanism beyond the copy (P5) | No brain imagery, no clarity/fog transitions, no memory-restoration metaphors. The transformation is about *gathering information*, not changing a person |
| FIND-04 | Every number keeps population, duration, comparison and source (P4 notes) | The "3.11" figure is only shown inside a block that carries all four |
| FIND-05 | Copy is verbatim; new words must be flagged (How to use) | UI microcopy and pending-state strings live in CMS settings and are listed in the handoff |
| FIND-06 | Bottle: front view only, no 3D, no new angles; capsule is cream/tan (P6) | Bottle is a 2D official cutout. The capsule appears only as the real photo or as a flat cream glyph |
| FIND-07 | No brand guidelines; label uses organic blobs and diagonal stripes (P6) | The label's blob and stripe vocabulary becomes a quiet graphic motif. Royal/navy are for ink and actions; cyan is decorative only (it fails text contrast) |
| FIND-08 | CMS with Draft → Approved; three languages; blog is the main search entry (P7) | Astro static site + Decap CMS (editorial workflow, i18n). Content gating: production renders only `approved` entries |
| FIND-09 | Forms inactive until addresses are supplied; never fake success (P7) | `<fieldset disabled>` plus the visible honest state "This form will open soon." The endpoint, once configured in the CMS, activates the form |

## Define

- **Problem statement.** A worried adult or caregiver arrives from search, social, Amazon or a QR code, often unsure whether this concerns them. They need a calm, plain explanation of what Memowell is, who it was studied in, what the research found, and how it is taken and when not to take it. Every number is sourced. They leave ready to talk to their doctor or pharmacist.
- **Experience principles.**
  1. Calm, never alarming: quiet surfaces and no urgency devices.
  2. Facts with their context: numbers, populations and sources stay together.
  3. One path for patients and caregivers; depth on demand for professionals.
  4. Readable first: motion and colour are never the only carriers of meaning.
  5. Honest gaps: pending items show truthful states, never fake content.
- **Observable build criteria.** Copy matches the deck verbatim (scripted check). No banned word in the rendered HTML (scripted). Footer disclaimer on every page. Professional band at the end of content pages. No FDA mark. Summary and catalogue buttons never 404. Rendering verified at 1440, 1024 and 390 widths, RTL preview, and reduced motion.

## Creative interpretation

**Narrative premise: "facts in hand".** The approved closing line is turned into a visible relationship. A plain paper note titled *Taking this to your doctor* (the approved heading from `/memowell`) leaves the bottle in the hero. It travels beside the reading column and ticks off what the visitor has just read. It arrives, complete, beside the summary action in the closing section. The visitor watches information being gathered for a conversation, which is exactly the site's job. Nothing about a person's memory changes on screen.

**Visual treatment: calm editorial guide with a label-derived graphic motif.**
- The page reads like a well-edited health guide rather than a supplement advert, which sets it apart from the brand's social creatives and from competitor-style product pages.
- The warm paper background (#FBF9F4) and a cream note (echoing the real capsule) balance the brand's cool royal blue and navy.
- The label's organic blobs and cyan stripes appear as a stage under the bottle, in section dividers and in the professional band. They are drawn as new SVG shapes inspired by the label, not copied from it.

**Alternatives considered.**
- (A) **Label blob as aperture.** The bottle's blue blob expands into full-bleed chapter backgrounds. Rejected: it is a decorative expansion with no meaning tied to the visitor's task, and it is close to the frame-opening default the skill warns against.
- (B) **Capsule journey.** A capsule travels from resin to capsule to the meals. Rejected: any depiction of the capsule reaching the body risks implying absorption or mechanism (needs scientific-officer approval).
- (C) **"Facts in hand" note.** Selected: it is traceable to Part 2.1 and the approved closing copy, it involves no claims, and it supports memory-impaired readers as a recap device.

**Hero structure.** A type-led split:
- a large serif question with the eyebrow, lead and two actions on the reading side
- the official bottle standing in an open field on a soft royal blob with cyan stripes on the other side
- the blank note tucked behind the bottle

There is no photograph, frame mask or pinned hero.

**Typography.**
- **Source Serif 4 (variable, opsz)**, OFL, for display and section headings. It gives calm editorial authority and clear numerals for 3.11 and 1.65.
- **Atkinson Hyperlegible Next (variable)**, OFL, for body text and UI. It was designed for low-vision legibility and fits FIND-01 directly, with distinct `I l 1` and `O 0` forms.
- **Noto Naskh Arabic (variable)**, OFL, for Arabic. Naskh is the most familiar Arabic reading style for older readers.
- Rejected: Inter (it reads as a product UI and loses warmth) and an all-sans system matching the logo (it would look like the ad creatives).
- Files come from `@fontsource-variable/*` npm packages and are self-hosted.

**Palette roles.** All text pairs were checked to AA or better (see the verification notes).

| Token | Value | Role |
|---|---|---|
| paper | #FBF9F4 | Page background |
| ink | #101A47 | Text (≈16:1 on paper) |
| ink-soft | #3B4470 | Secondary text (≈9:1) |
| royal | #2A3DAB | Links, buttons (≈8.4:1 on paper; white on royal ≈8.9:1) |
| night | #0E1C55 | Professional band, footer |
| cyan | #00B4C0 / stripe #5EBAC8 | Decorative only |
| cream | #F2E6D3 / note #FFFBF3 | Note card, summary surfaces |
| line | #D8DBE6 | Rules |

**Motion engine decision.**
- Native scroll, with no Lenis. A smooth-scroll layer changes scroll physics for older visitors and assistive-technology users, and the scene does not need it.
- No GSAP. Holds come from CSS `position: sticky`, and the note's pose is a pure function of the anchor geometry, evaluated in one rAF-throttled scroll and resize handler (a single pose writer).

## Signature scene contract: "facts in hand" (homepage)

| Field | Decision |
|---|---|
| Reason | P2.1 primary action. Closing copy: "the conversation goes better with the facts in hand" |
| Subject | One decorative note card (aria-hidden). The real content and actions stay in semantic HTML |
| Anchors | `hero` (behind the bottle, rotated −7°, 70% scale) → `column` (sticky slot, right column of the "facts" chapter, sections 2–6) → `held` (the column's on-screen position, while sections 7–8 pass; scale 0.86, rotation 3°) → `final` (closing section, beside the summary action, scale 1) |
| Before | A blank ruled note peeks from behind the bottle |
| Transformation | As the facts chapter rises, the note slides out from behind the bottle and settles upright in the reading column. Rows tick as their sections reach reading position: §3 "What is in it", §5 "What the research found", §6 "How to take it". Over §7–8 the note stays with the reader, tilted like something carried. In §9 it glides into its place and the last row ("Five questions worth asking") ticks |
| Resolved | A complete note beside the "Download a one-page summary (PDF)" and "Contact us" actions |
| Reverse, skip and anchors | The pose is computed from the live anchor rects each frame, so it is correct on reload mid-page, on direct anchors and in reverse |
| Mobile (<1100px) | No overlay. The hero note is static behind the bottle. The closing note is static and its rows tick in when it enters view |
| Reduced motion | No travel and no tick animation. Static complete note in the column slot and in the closing section |
| No-JS | Same as reduced motion |

Row labels are fragments of approved copy: the `/memowell` §6 sentence and the section headings. They are flagged in the handoff.

## Open gaps (build around, never invent)

See `memowell/README.md` → "Placeholders and pending items". The README carries the single consolidated list required by DOC-01 Part 8.4.

## Decisions log

| ID | Decision | Source | Status |
|---|---|---|---|
| DEC-01 | Build the full site directly (concept recorded here, not a separate approval round) | User request "build the site with these briefs" (overrides P8.1 sequencing) | Selected |
| DEC-02 | Astro 5 static + Decap CMS editorial workflow, i18n multiple_folders | P7 | Selected |
| DEC-03 | Production build = EN only, approved content. Preview build = all locales and drafts, with local pending states and noindex; global banner removed at the client's request on 2026-10-20 | P7 (FR/AR pending, AR unpublished); client revision | Selected |
| DEC-04 | The header action is labelled "Taking this to your doctor" and links to `/memowell#summary` (approved heading; avoids a dead PDF link) | P3, P7 downloads | Flagged |
| DEC-05 | No chart of study results (only between-group differences are supplied; a chart would need scientific-officer approval) | P4 science note | Selected |
| DEC-06 | Privacy policy translated from the Persian draft into EN, FR and AR as drafts awaiting approval | P4 §6 | Draft |

---

## Version 2: visual redesign (2026-10-12)

**User feedback (supersedes the v1 visual direction):**

> The visual is not trendy or new; it's too simple and old-fashioned. Build a modern, trendy, attractive visual.

This matches the owner's standing preference in the skill's taste profile: cinematic, modern, scroll-triggered motion with a "wow" effect, and creative freedom beyond a cautious reading of the brief.

**Unchanged:**

- the copy (verbatim)
- the site map and navigation
- the claim rules
- the official assets
- accessibility for older readers
- the CMS, the three languages and the pending states

**Replaced:**

- the visual treatment
- the type system
- the motion system
- the homepage scenes

### Direction: "Clinical-cosmic product stage"

| Field | Decision |
|---|---|
| Treatment | Deep midnight/cobalt immersive bands alternate with bright ice-white reading sections. The label's royal-cyan colours become luminous aurora gradients. Glass chips and cards, oversized display type with one italic serif accent word, bento grids, large 28–40px radii and subtle grain |
| Hero | The product sits in an open field on a midnight aurora. A giant headline uses an italic accent on "names". The official bottle has a glow halo and orbit rings, with floating glass fact chips taken from the label |
| Type | IBM Plex Sans Variable for every Latin role (headings 600, body 450, UI 600–700, with italics); IBM Plex Sans Arabic (AR). All OFL, self-hosted. Replaced Bricolage Grotesque / Plus Jakarta Sans on 2026-10-26; see "Typeface change" below |
| Colour | midnight #060C33 / #0C1650; royal #2B3FD9; electric #4C63FF; cyan #19D3E2 (accents on dark only); ice #F4F6FF; cream capsule #F2DFC2. Text contrast stays ≥ 4.5:1, mostly ≥ 7:1 |
| Motion engine | GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3.26, on one GSAP ticker clock. `gsap.matchMedia` for desktop, mobile and reduced motion. HTML renders the final state; JS only animates from it. Three.js r186 renders the formulation scene (v3; the hero since v4) from the same ticker |

### Signature scenes

**1. Resin → K-Vie™ → capsule** (home §3, pinned on desktop)

This answers the client's own question: how does Memowell differ from ordinary frankincense?

Version 3 (client feedback: the 2D version felt "basic, like PowerPoint") renders it in real-time 3D:

| Beat | Before → transformation → resolved |
|---|---|
| 01 Resin | A lumpy amber resin tear, lit like a product shot (warm key, brand-blue rim, studio reflections); the camera dollies in |
| 02 Micronized | The tear disintegrates from the base up with glowing edges. Each grain is born exactly where the surface opens, then the dust spins into a flat vortex seen from above |
| 03 Microcrystalline | The dust snaps into a 3D lattice with faceted crystals and faint unit-cell lines; the camera orbits to show depth |
| 04 K-Vie™ | The lattice condenses into a capsule-shaped cloud; the cream body and cap slide in from depth and close around it, with a rim-light pulse |
| 05 Vegetarian, gluten-free | The closed capsule (colour and 2.9:1 proportion taken from the official capsule photo) turns under a sweeping light |

- One scroll value drives everything, so reverse scroll, fast skips and anchor entry land on the same frame.
- Labels use exact copy fragments, shown one at a time as film-style captions with a progress rail.
- Particles fade behind the reading column (canvas mask), so the copy stays clean.
- No body, no bloodstream and no mechanism is shown beyond the copy's own words.

**2. One capsule with each of the three main meals** (home §6)

- A capsule drops in and splits into three, each landing on one of three plates.
- This is a literal staging of the approved sentence.

**3. Who it was studied in** (home §4)

- A pinned horizontal track of four large cards.
- On mobile it becomes a vertical stack.

**4. Evidence** (home §5)

- On midnight, the approved sentence lights up word by word as you scroll.
- "3.11 points higher on MMSE" resolves in cyan inside its full sentence, so the population, duration, placebo comparison and source all stay present.
- Unlit words stay readable (≥ 4.5:1).

**Supporting motion:**

- Hero load choreography: masked line reveal and the bottle rising.
- The hero scroll-out has depth, and the aurora reacts to the pointer.
- A scroll-linked fact marquee (not auto-moving).
- Batched reveals on inner pages.

### Claim-rule check for visuals

- No dark-to-light "clarity" transition is tied to memory.
- No brain imagery, no before/after, no fog.
- The particle sequence depicts only the processing words in the copy: resin, micronized, microcrystalline, standardised, capsule.

### Responsive and accessibility

- **Below 900px:** no pins, except the formulation stage (v4: the hero scene), which pins full-screen after its copy so the 3D sequence has room; other scenes play as scrubbed sequences inside normal flow; the horizontal track becomes a vertical stack. Fewer particles on phones.
- **Formulation fallbacks:** reduced motion renders one still 3D frame of the closed capsule and lists all five labels; without WebGL (or on context loss) the SVG capsule poster stays.
- **Reduced motion and no JS:** final composed states only, with no Lenis.
- **Auto-moving content:** none runs beyond the load entrance (WCAG 2.2.2). The 3D scene's ambient motion advances only while the visitor scrolls and settles within about 1.5 s.

### Also replaced

The v1 "facts in hand" travelling note is retired. The summary returns as a glass "Taking this to your doctor" card in the closing section and on `/memowell`.

## Version 4: the hero tells the formulation (2026-10-13)

**Request (client):** use the 3D formulation motion in the hero, with text that changes on scroll together with the motion, telling the production story from frankincense resin to capsule.

**Decision.** The hero and the former home §3 become one pinned scene. Chapter 0 is the approved hero; chapters 1–5 are the formulation, one per stage of the existing 3D scene. The separate §3 section is removed so the story is told once.

| Chapter | Text (verbatim) | Scene stage (scene progress) |
|---|---|---|
| 0 | Approved hero: eyebrow, "Searching for names a little more often lately?", lead, two buttons | Resin tear, studio-lit (0–0.05) |
| 1 Resin of Boswellia trees — frankincense | §3 ¶1 (two sentences) | The tear turns in the light (0.05–0.13) |
| 2 Micronized | §3 ¶2 (two sentences, K-Vie™ — pending approval) | Disintegrates into micronized dust, vortex (0.13–0.42) |
| 3 Microcrystalline | — | Crystal lattice (0.42–0.62) |
| 4 K-Vie™ · standardised to 40% boswellic acids | — (pending approval) | Lattice condenses into a capsule-shaped cloud (0.62–0.74) |
| 5 Vegetarian and gluten-free | "One bottle holds 90 vegetarian capsules." (`/memowell` §1) + "More about the formulation" | Halves close; the capsule turns (0.74–1) |

- **Sync rule:** one scrubbed value picks the chapter and the scene progress. Each chapter plays its stage in its first 70% and holds the resolved frame for reading, so text and motion change at the same moment, in both directions.
- **Layout:** desktop pins the whole hero (≈4.6 screens); the reading column holds the intro, then the §3 heading, a five-part rail and one chapter at a time as a title card; the scene plays to the right (left in RTL) and fades behind the text. The intro scales with viewport height so it fits one screen on laptops. Phones read the intro in flow, then pin the scene (≈4 screens) with the chapter text over a scrim at the bottom.
- **Fallbacks:** reduced motion and no JS show the resolved composition (intro beside the still closed capsule, five chapters listed); without WebGL the SVG capsule poster stays. Keyboard focus into a hidden chapter scrolls to it.
- **Must not imply:** no body, bloodstream, brain or mechanism; no dark→light "clarity" tied to memory; the capsule is not shown "working"; nothing links the scene to an outcome. The story depicts only the processing words in the copy.
- **Retired:** the v2 hero bottle, orbit rings, glow and fact chips (the bottle remains in the closing panel; the chips' fragments remain in the marquee).

## Version 5: page order restored, hero film pending (2026-10-13)

- **Reverted from v4:** the approved hero question followed directly by a transformation that ends on a capsule reads as problem → product → solution (Kondor rule 7, montage causality). Order is now hero question → "why" (inflammation research, "not a settled answer") → the formulation story in 3D, with the v4 chapter system unchanged.
- **Hero:** the approved question on the aurora, scaled to fit one screen on laptops. A silent hero film (Memowell cognitive-moment grammar, no product, no on-screen text) is in concept approval; nothing generated yet.

## Scoped research-section redesign (2026-10-19)

- **Request / baseline:** redesign the homepage `#why` section shown in the user's screenshot; baseline `78401a0`. The current hero film, formulation scene, centred header, navigation and all other sections are protected.
- **Source authority:** DOC-01 HOME §2 and `content/pages/en/home.yml`. The heading, both paragraphs, CTA and DOI remain verbatim. The existing caregiver/calendar photograph and its illustrative-image note remain intact. No new claim or public label is introduced.
- **Visitor question → answer → next step:** why is inflammation being discussed here? Read the sourced research context together with its explicit uncertainty, then follow the existing memory-health link.
- **Creative interpretation:** an open editorial spread replaces the raised white text card. A portrait photograph occupies five shares of an eleven-share composition; the reading column occupies six, separated by a fluid 40–96px gutter. The approved heading's qualifying clause becomes a readable lead-in, while the research subject carries the display scale. Cyan underlines and a logical-side rule reuse the label-derived vocabulary.
- **Foundation:** retain Bricolage / Plus Jakarta / IBM Plex Arabic, ice canvas, navy text, existing max-width and page gutters. Body copy uses the existing 19–20px role and 1.62 line height. The research qualification gets its own restrained note, followed by the action and readable DOI behind a thin divider. The photograph has one enlarged logical corner; no additional shadows or card surface.
- **Responsive contract:** below 64rem, the columns would leave the long heading and prose too narrow. Switch to heading → image → explanation → qualification → action/source in DOM order. The portrait becomes 5:4 on tablets and square below 40rem, keeping both people and their calendar interaction visible. Long DOI text may wrap. Missing-photo content uses one reading column.
- **Motion:** reuse the existing one-time reveal on whole blocks. No new scroll driver, pin or scientific mechanism illustration. The semantic heading remains whole, and complete static HTML is the reduced-motion / no-JavaScript counterpart.
- **Verification:** preview build and the existing copy/link check passed (232 sentences/labels; 3,576 internal links). Actual desktop, 1,023px / 1,024px breakpoint, 390px and 320px compositions were inspected. The tablet reading column was centred after observing excess space on one side. No section overflow at 320px; both people and the calendar remain visible. Arabic preview mirrors the columns, corner and note rule, keeping its existing English fallback. Enter on the reading link opens `/ar/memory-health`. Existing reduced-motion logic is unchanged; its media preference was not emulated interactively. The pre-existing mobile header wraps at 320px and is outside this section-only change.
- **Release:** use the existing `claude/happy-volta-7wdu1t` push workflow to `memowell-preview-site.vercel.app`; live readiness and section appearance must be verified before delivery.

## Scoped lower-homepage redesign (2026-10-19)

- **Request / baseline:** redesign the "Who it was studied in" section, then continue through the remaining homepage sections. Baseline `6131b40`. The client explicitly freezes "Boswellic acids, in a formulation built for absorption". Header, hero, the completed research introduction and shared footer are also outside this change.
- **Source authority:** approved homepage content in `content/pages/en/home.yml` and the brief. All headings, group descriptions, study sentences, sources, actions and pending-file states remain. No new public claims, labels, photographs or product artwork.
- **Journey:** population relevance → sourced study result → daily routine → professional information / local availability → a conversation with a doctor or pharmacist. Preserve the existing destinations and honest unavailable-PDF state.
- **Selected direction:** an open numbered index replaces the audience carousel. A repeated card grid was rejected because it would flatten the distinction between audience context, evidence, practical directions and the closing action. Existing typography, ice/navy/cyan palette, page gutters and label-derived stripe vocabulary bind the varied compositions together.
- **Audience:** a short sticky introduction occupies one share beside a two-share ruled list. Each group has a visible index and its full title and explanation. Below 80rem, title and explanation stack within each row; below 64rem the whole section becomes one centred reading column. The horizontal scroll pin is retired; existing one-time reveals are used instead.
- **Evidence:** one navy study spread pairs the complete context sentence and DOI with the complete result sentence. The existing word-focus animation applies to the result only. A ruled foot carries the other-study sentence and both real actions. Population, duration, placebo comparison and prescribed-care context remain visible together with the result, without a new numerical chart.
- **Directions:** heading and two complete paragraphs establish the instruction above a full-width three-plate stage. The existing capsule-to-three-meals timeline is unchanged. At the tablet breakpoint use a single grid column; on phones reserve seven rem above the plate stage so the moving capsule clears the action above it.
- **Professionals / availability:** an outlined lavender panel gives professional readers a distinct route. Availability returns to an open text-and-photo spread. The existing pharmacy image keeps its full source aspect ratio so the people and product on the counter remain visible.
- **Closing:** navy copy/action panel with a restrained stripe field, an upright document illustration and the official bottle in separate visual columns. The existing PDF action stays disabled with its availability message and preview approval note. Below 40rem the duplicate, aria-hidden document is omitted; substantive text, real actions, status and bottle remain. Narrow-phone padding and body size were adjusted after inspecting the 320px rendering.
- **Protection audit:** exact comparison against the baseline confirms unchanged formulation markup, chapter/animation JavaScript, all 51 formulation CSS rules and shared global styles. The 3D renderer has no diff. No formulation fix, refactor or timing adjustment is included.
- **Verification:** preview build passed. The existing content/link checker preserved 232 sentences/labels and 3,576 internal links; its Windows CRLF reading workaround is external to the repository. An additional section-local check preserved 35 approved headings, sentences, descriptions and action labels in their own sections. Actual 1280px desktop, 1024px/1023px breakpoint, 390px and 320px compositions were inspected. Narrow layouts have no horizontal overflow. Arabic preview mirrors columns and visuals with its existing English fallback; Enter on the closing contact action opens `/ar/contact`, and Enter on the audience action opens `/who-its-for`. No browser errors were observed. Reduced-motion logic and static HTML fallbacks remain; the media preference was not interactively emulated in this pass.
- **Release:** publish through the existing branch workflow and verify the deployed section DOM and rendered appearance before delivery. Source freeze checks are required immediately before committing.

## Shared footer and decorative-text revision (2026-10-20)

- **Request / baseline:** redesign the footer to match the accepted homepage direction, remove the yellow global "Preview build — not for publication" banner, and remove the decorative double blue strokes beneath heading words. Baseline `c895927`. The later explicit text-decoration request supersedes the previous accent treatment; approved wording is unchanged.
- **Source authority / task:** brief Part 3 audience routes and Part 4 footer/repeated copy, plus `content/site/en/strings.yml`. Help visitors find product, educational, professional, partner, contact and legal destinations after reading any page. Preserve all five link groups, the fixed general disclaimer, market line, exact last line and official artwork. Do not invent contact details or turn pending actions into active destinations.
- **Direction:** open ice navigation area followed by a solid navy information base. The official Memowell wordmark and the unchanged slogan form the signature row; the slogan uses solid display typography in two phrases rather than the previous oversized outline. Ruled groups echo the new audience and evidence sections. The maker logo and full general disclaimer sit together below navigation, followed by the exact registration/company line. No added card grid, aurora, generated asset or animation.
- **Foundation:** existing colour, type, spacing and container tokens are retained. Footer navigation is 17px with 44px minimum primary link height; the fixed disclaimer is 17px/1.75 on navy. Brand images retain their proportions. Footer styles now live in the component instead of the shared global block, with visible dark/light focus colours inherited from the existing system.
- **Responsive contract:** five columns become three below 75rem, then two below 48rem; below 24rem the main groups use one column. The signature and maker/disclaimer relationships stack below 48rem. The company group spans the mobile grid: an observed 390px defect broke the last letter of the company domain onto its own line, so the domain now gets a full-width line while the short company links share two columns. Contact and legal retain their complete text and order.
- **Banner / text decoration:** delete the global banner markup, its body flag and header offset. Preserve preview content gates, local pending messages and `noindex`. Remove the shared double-stroke `.accent` paint; heading words remain ordinary complete text. Homepage/formulation source and motion are otherwise unchanged.
- **Verification:** preview build passed; approved-copy checker passed 232 sentences/labels and 3,655 internal links across 79 pages. A footer-local check confirms every page retains the full footer copy, has no preview banner and keeps preview indexing behaviour. Browser comparison preserved all 21 existing footer links and added only the locale-aware home-logo link. Actual wide desktop, 1280px, 1200px/1199px, 768px/767px, 390px and 320px layouts were inspected; no footer/page horizontal overflow was found. The Arabic preview mirrors groups and artwork while preserving its English fallback semantics. Enter on "General disclaimer" reaches and visibly focuses the full text on navy; Enter on "Privacy policy" opens `/ar/privacy`. No browser errors were observed. The footer is static HTML/CSS, with no new motion or JavaScript dependency; a full accessibility conformance assessment and interactive text-enlargement emulation were not performed.
- **Scope audit / release:** exact source comparison confirms unchanged homepage, chapter animation and 3D renderer; shared CSS changes are limited to the old footer, removed preview-banner rules and the requested accent paint. Publish on the existing preview branch and verify the live footer, banner absence and computed heading decoration before delivery.

## Homepage visual refinement and audience story (2026-10-20)

- **Request / scope:** after asking for a wider review, the client limited implementation to the homepage. Remove the pictured internal PDF note and make "Who it was studied in" more visual, with a longer reading pause. Baseline `706104b`; the formulation section remains frozen. Other page layouts and copy are unchanged.
- **Source / method:** retain approved homepage YAML, original film, official bottle and existing illustrative photographs. Kondor Studio brand sources guide the calm, human, scientific tone; its current bundle has no website execution adapter, so Bex Web Design supplies the web implementation method. No new medical claim, generated asset or paid production is involved.
- **Hero / facts:** calmer navy film composition, bounded display scale, readable lead and plain cyan eyebrow. The fact band uses solid text and small separators. On narrow phones the home header keeps its logo and menu on one row. The English root retains its left-hand logo; Arabic follows its existing RTL layout.
- **Audience composition:** a four-image contact sheet becomes a featured image plus three thumbnails as visitors read the four complete numbered groups. On wide screens at least 48rem tall, the introduction/gallery stays beside the native vertical reading stages; GSAP Flip re-composes the frames at each stage. No text is hidden or replaced. Four real anchor links support keyboard/direct navigation and mark the current context. Reverse scrolling restores the matching frame.
- **Photography / interpretation:** reuse the planner appointment, waterfront walk, calendar interaction and shared lunch as illustrative contexts. Preserve source assets, readable faces and the explicit diagnostic caveat. The images do not represent trial participants or evidence of an outcome. An illustrative-image label stays visible.
- **Fallbacks:** below 64rem each group carries its own full-aspect photograph in ordinary flow. Short desktop screens and reduced motion use a static contact sheet with the complete list. No JavaScript still leaves every heading, description, photo and destination available.
- **Closing action:** Contact us becomes the first, active action; the PDF remains unavailable with its truthful status. The homepage hides only its internal approval-workflow note via an opt-out property whose default preserves other pages. Retire the duplicate decorative document on Home; keep the official bottle and complete approved text.
- **Verification:** preview build passed. The section-local copy audit preserved 35 approved headings, sentences, group descriptions and action labels; the existing checker passed 232 sentences/labels and 3,655 internal links across 79 pages. Desktop rendering at 1280px confirms featured frames 01–04, matching current markers, direct anchor selection and reverse navigation; no browser errors were observed. At 390px all four group photographs load, the gallery is hidden and the page has no horizontal overflow. The 320px home header, hero and closing actions were also inspected. Reduced-motion behaviour is implemented through the media condition and static HTML; the preference was not interactively emulated. This is scoped QA, not a full accessibility conformance assessment.
- **Protection / release:** exact guard confirms unchanged formulation markup, chapter animation and all 51 relevant CSS rules; the renderer and shared global stylesheet have no changes. Publish through the existing branch workflow and verify the final live homepage before delivery.

## Audience alignment and conversation banner refinement (2026-10-20)

- **Requests / baseline:** starting from `6080097`, remove the small number tags on the audience photos and the numbered navigation beneath them; enlarge the featured image and align the left/right containers at both edges. Then remove the entire unavailable-PDF button/status from the homepage closing banner and redesign that banner. The large numbers beside the four text groups remain; the formulation and inner pages remain protected.
- **Audience geometry:** use one viewport-bounded stage-height token for the sticky left composition and each desktop reading stage. The gallery fills the remaining left-column height after the heading, caveat/action and illustrative-image note. At 1280 × 1000, both containers measured 880px tall with matching top/bottom edges within 0.2px; the featured image measured 537px tall, compared with the previous 240px. Scroll-driven image changes and complete native text remain. Remove the retired number markup, styles and marker state code rather than hiding it.
- **Closing direction:** the approved conversation heading and full paragraph occupy a navy reading panel. Cyan emphasis on the existing word "conversation" connects to two overlapping speech shapes on an ice field, with the unchanged official bottle artwork in front. These shapes express the next step, not a medical mechanism or outcome. Contact us is the sole action. No new public wording or generated imagery is introduced; other pages retain their unavailable-PDF states.
- **Responsive / verification:** desktop and 390px/320px banner renders inspected; narrow screens stack copy, action and product illustration without horizontal overflow. Preview build and content checks passed: 232 sentences/labels, 3,655 internal links across 79 pages, and 34 current homepage copy/action checks after the requested PDF removal. The formulation source guard still confirms its unchanged markup, chapter animation and 51 CSS rules. Verify the same state on the stable Vercel URL after publication.

## Open product banner, Appear and quieter annotations (2026-10-20)

- **Client feedback / scope:** the client rejected the white frame and then the full closing-banner design from `a213d2c`, requested Appear motion, asked to remove "Illustrative image" tags if not legally prescribed, and asked for a quieter treatment of the yellow placeholder boxes. Preserve the approved copy, product artwork, audience story and frozen formulation.
- **Direction choice:** considered a type-only invitation, a full-bleed human scene, and the product in an open field. Choose the open field to retain the supplied bottle while removing the rejected nested-card and speech-bubble grammar. One navy stage places the upright, larger bottle on the left over a restrained label-derived stripe field. The right column gives the existing word "conversation" its own display line. A full-width contact row with a cyan arrow replaces the small pill button. There is no white image backing, bubble, new copy, new image generation or outcome metaphor.
- **Responsive layout:** two columns remain useful down to 48rem; below that threshold the text/action precede the product in ordinary flow. At 1280px the bottle keeps its source proportions at 272 × 521px. Actual 1280px, 768px/767px and 320px states were inspected; the narrow heading and page have no horizontal overflow. Enter on the contact action reaches `/contact`.
- **Appear:** one ScrollTrigger entrance at top 85%, once. Heading, paragraph and action rise 28px while fading over 0.85s, staggered 0.12s; the bottle rises 48px over 1.1s after a 0.15s delay. No ongoing motion or replay on reverse scroll. Observed the initial opacity/translation and resolved state. Keyboard focus completes the timeline immediately. The existing reduced-motion media condition omits the animation and no-JavaScript HTML stays fully composed; reduced-motion preference was not interactively emulated.
- **Photo labels:** remove eight CMS photo-note values plus the separate audience-gallery note. Retain the original images, provenance comments and internal asset record. The source review did not identify a requirement for the literal badge wording in the reviewed [Canadian advertising guidance](https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/false-or-misleading-representations) and [UAE media content standards](https://uaemc.gov.ae/en/media-content-standards/). Those sources still require truthful, non-misleading presentation; this scoped review is not a jurisdiction-wide legal clearance. No photo is described as a trial participant or a testimonial.
- **Pending notes:** retain the missing-information text and disabled destinations; replace the yellow fill and dashed 2px border with a neutral grey-blue fill, solid 1px edge and readable 15px text. Dark sections use a low-contrast translucent surface with light text. The frozen homepage formulation contains no pending-note element, so its presentation is unaffected.
- **Verification / release:** preview build passed; copy check preserved 232 sentences/labels, 3,655 internal links across 79 pages and 34 homepage headings/sentences/actions. No browser errors were observed. The protected formulation guard passed. Publish through the existing branch workflow and inspect the live banner, photo-label absence and neutral footer placeholder before delivery.

## Stronger closing-banner Appear (2026-10-20)

- **Feedback / baseline:** the client could not perceive the entrance from `0b8495c`. The previous trigger began when the panel top reached 85% of the viewport, before much of its centred copy was visible. The user's browser reports reduced motion off.
- **Correction:** use the untransformed closing section as the trigger at viewport 60%. The whole panel now fades and rises 64px from 97% scale over 1.2s. Text groups rise 70px over 1.05s, beginning at 0.2s with 0.22s staggering. The bottle enters at 0.35s, rising 120px from 86% scale over 1.45s. The sequence resolves in 1.8s, without bounce or a continuous loop.
- **Preservation / checks:** keep the once-per-page behaviour, reduced-motion/static counterpart and focus-to-complete handler. Layout, copy, original artwork, annotations and other scenes are unchanged. Preview build and the protected formulation guard passed; initial opacity/scale/translation and the complete resolved composition were inspected in the browser. Verify the published bundle and final visible state on the stable URL.

## Repeated banner entrance and unnumbered audience titles (2026-10-20)

- **Requests / baseline:** from `39566fa`, replay the closing-banner entrance whenever scrolling back into the section, and remove the large 01–04 numbers above the four audience-context titles shown in the client's screenshot.
- **Audience:** remove the decorative number elements and their desktop/mobile styles. Preserve the full titles, descriptions, photos, section anchors and gallery transitions; the existing grid centres each remaining text group in its reading stage.
- **Banner:** retain the stronger 1.8s sequence and 60% downward-entry trigger. A paused timeline restarts on downward entry and on reverse entry after the section has passed above the viewport. Reset only after the section is completely outside the viewport in either direction, so a still-visible banner does not abruptly disappear. Keyboard focus completes and pauses the entrance and prevents resets of the focused panel. The existing reduced-motion condition and static HTML remain.
- **Scope:** preserve the banner design/copy, other homepage sections, inner pages and protected formulation markup, styles and animation.
- **Verification:** preview build passed (79 pages); all 34 approved homepage headings/sentences/actions remain, and the formulation guard confirms unchanged markup, chapter JavaScript and 51 CSS rules. Actual 1280px desktop and 390px mobile renders show all four titles without decorative numbers and no horizontal overflow. Without reloading, observed first entrance, completed state, unchanged opacity while still partly visible on reverse scroll, full-exit reset, a second downward entrance and upward re-entry. Keyboard focus changed the hidden panel, all three copy groups and bottle to full opacity. Reduced-motion/static logic is preserved; its media preference was not emulated. Verify deployment and the live rendered titles before delivery.

## Audience text aligned to the featured photograph (2026-10-20)

- **Request / baseline:** from `1b07898`, vertically centre each right-hand title and description against the featured photograph rather than the entire left column, and remove the dividers between text groups.
- **Geometry:** measure the focused gallery's actual photo frame before ScrollTrigger refresh, excluding the heading, introduction and thumbnail strip. Give each text group a sticky top and initial inset derived from that photo centre and its own measured height. Remove the repeated introductory inset between stages to shorten the surplus scroll gap; the last text group follows the photograph as the whole stage leaves. Text remains in its native list stage and hands off to the next group while scrolling; photograph selection follows that group's arrival at the aligned reading position. Refreshes remeasure the geometry before downstream trigger measurements, and cleanup removes the inline alignment values.
- **Scope / fallbacks:** remove the audience entry borders at all widths. Keep complete copy, photographs, existing mobile single-column flow, reduced-motion/static content, closing-banner motion and the frozen formulation unchanged.
- **Verification:** the 79-page preview build, all 34 homepage copy checks and protected-formulation guard passed. Inspected the four featured contexts, reverse navigation and the last context leaving the section. Settled text/photo centre differences measured within 0.4px at 1280px and 2151px widths, and within 0.2px at the 1024px desktop threshold. At 390px the desktop alignment variables and sticky stage clean up correctly; all copy remains in the single-column flow without dividers or horizontal overflow. No browser errors were observed. Reduced-motion/static conditions remain in source; the media preference was not emulated. Verify the published layout and bundle before delivery.

## Remove the fact marquee below the hero (2026-10-21)

- **Request / baseline:** from `1117337`, remove the moving strip below the homepage hero.
- **Change:** remove the marquee markup, unused view variable, four dedicated CSS rules and its scroll-triggered animation. The next section follows the hero directly with its existing section padding; no replacement spacer is added. Keep historical CMS values without rendering them, and update the implementation notes to mark the strip retired.
- **Scope:** preserve the hero film/copy, audience alignment, closing entrance, other pages and frozen formulation source.
- **Verification:** the 79-page preview build and protected formulation guard passed. Inspected the rendered desktop hero-to-Why transition. At 1280px and 390px, DOM geometry confirms no marquee, `#why` directly after the hero, zero intervening gap and no horizontal overflow. Existing section padding remains. No browser errors were observed. Verify the published page before delivery.

## Hero copy, hierarchy and text motion (2026-10-26)

- **Request / baseline:** from `75acf80`, make the hero answer its own question in the voice of the film ("the wall of names"), redesign the text hierarchy and add text motion; align the home meta description. Client-directed copy change; Part 4 of the build brief now holds the new hero text.
- **Hierarchy:** the question stays the display headline with "names" in cyan. The answer follows as one large display-face statement ("Behind every name is someone you love.", the loved-one phrase underlined in cyan), then a quieter supporting line. Product information sits apart below a hairline: one smaller sentence, the two actions, and the Health Canada licence as a small trust line. Type and spacing scale with viewport height on laptops so the hero stays one screen.
- **Text motion (GSAP SplitText, existing engine):** masked line rise for the question; "names" arrives a beat after its line with a faint cyan slot under it, echoing the film's pause before the name is found; the statement rises word by word and the underline draws under "someone you love"; the supporting line, product sentence, actions and licence follow. About 3.4 s in total. No blur or fog-to-clarity effect, nothing loops. Re-splits during the entrance rebuild it at the same moment; focusing anything in the hero completes it; the actions animate opacity only, so they stay focusable. Reduced motion and no-JS show the settled HTML.
- **Verification:** production and preview builds and both content checks passed. Inspected entrance frames at 0.45, 1.25, 1.7, 2.25, 2.9 and 4.2 s, the settled state at 1440×900 and 1280×720, 390px and 320px phones (no horizontal overflow) and reduced motion. The accessibility tree exposes the complete heading and paragraphs. In the headless test browser the 3D formulation scene's shader compile blocks the main thread for several seconds right after load, which makes the entrance jump to its end there; frames were therefore inspected with that module blocked. On real devices a long compile at load would shorten the entrance in the same way; the formulation loader was left unchanged because that section is frozen.

## Hero entrance fixes (2026-10-26)

- **Observed (load frames from navigation, 1280×800):** the settled hero text flashed before the entrance hid it; the product block's hairline stood alone while everything around it was hidden; the missing "names" lasted over a second and read as an error; and the 3D formulation renderer, which loaded on page load, compiled its shaders while the hero text sat in its hidden start state, so the hero stayed empty and then jumped to the end.
- **Fixes:** with motion allowed and scripts on, the hero copy is pre-hidden in CSS until the entrance has rendered its start state (4 s failsafe shows it if the script never runs); the hairline is drawn in with the product block; the entrance is tightened to about 2.6 s ("names" pause about 0.45 s); the 3D scene starts loading after the hero entrance settles or at the visitor's first scroll, whichever comes first (5 s failsafe). Reduced motion loads it as before. The formulation section's markup, chapters, renderer and design are unchanged; only its load timing moved.
- **Verification:** load frames with the real 3D scene show no flash and a continuous entrance; the module is requested at about 3.3 s without scrolling and within about 0.2 s of an early scroll; the scene still reaches its 3D state. Focus completes the entrance, 320px has no overflow, the accessibility tree is complete, and both builds and content checks pass.

## "Why" section redesign: the thread (2026-10-26)

- **Request / baseline:** from `f0b93e2`, redesign the section after the hero (`#why`) with Bex Web Design. Approved heading, both paragraphs, link, DOI and the illustrative photograph stay verbatim; hero, formulation and later sections are protected.
- **Signature / reason:** the section's own copy names "losing the thread of a conversation", and the film's concept is connection. One cyan thread is scroll-drawn through the section: it enters at the top margin, underlines "inflammation in the nervous system", turns down the gutter between photograph and reading column, and becomes the rule of "This is an area of active research, not a settled answer." The three moments families notice first are set in ink and underline as the reader reaches them. No anatomy, neuron, fog or mechanism imagery (brief Part 5).
- **Composition:** the research subject becomes a full-width display headline (lead-in above it, "inflammation" in royal blue); the portrait photograph sits left (5 of 12 columns) and the reading column right (6 of 12); the research caveat becomes a display-face pull statement; link and DOI follow directly below. Below 64rem it stacks heading → photo → text → caveat → link/source, with the thread in the left margin passing behind the photograph.
- **Implementation:** an SVG path is built from measured anchors (heading text rects with entrance transforms neutralised, note box, gutter centre) and rebuilt on resize, font load and ScrollTrigger refresh; one scrubbed ScrollTrigger owns its stroke. RTL mirrors the route. Reduced motion draws the finished thread; without JavaScript the caveat keeps its CSS rule and the moments keep their underline.
- **Verification:** production and preview builds and both content checks passed. Inspected scroll states at 1440×900, 1280×800 (reduced motion), 1024×768, 390×844 and 320×640, plus Arabic preview at 1440; no horizontal overflow and no browser errors. Fixed during the build: the underline first measured the split line boxes and a pre-split wrap, the thread crossed the paragraph start, an empty grid gap above the link, and phone routing through the text.

## "Why" section: blue lines removed, copy rewritten (2026-10-26)

- **Client feedback:** the client does not like the blue lines. Removed the scroll-drawn thread (SVG and its script), the underlines on the three family moments and the caveat's side rule. The moments keep their ink/semibold emphasis; the caveat stays a display-face pull statement; the layout is unchanged.
- **Copy (client-directed; Part 4 updated):** heading lead-in "One factor researchers study is" → "One thing researchers are looking at:" (plainer, less causal). The paragraph is split into three shorter sentences with the same claim scope and hedges ("linked", "associated", Alzheimer's context, same source); "symptoms families notice first" → "changes families often notice first" (calmer, less clinical, more cautious). The caveat sentence, link label and DOI are unchanged.
- **Verification:** both builds and content checks passed; desktop 1440 and phone 390 rendered without overflow or browser errors.
- **Accent colour (follow-up):** "inflammation" changes from royal blue to a dark tone of the hero cyan. `--cyan-ink` (#00707f) read as green, so a new token `--cyan-deep` (#0c78a8, hue 198°) is used: blue-cyan, continuous with the hero, 4.56:1 on the ice background (hero cyan would be 1.7:1 there).

## Typeface change: IBM Plex Sans (2026-10-26)

- **Client feedback:** the headline typeface read as "fantasy". It was Bricolage Grotesque (all headings); body/UI was Plus Jakarta Sans.
- **Candidates compared on the real hero and "Why" headings, on dark and light grounds:** IBM Plex Sans; Plus Jakarta Sans for everything; Source Serif 4 headings; Inter Tight. Client chose IBM Plex Sans.
- **Why IBM Plex Sans:**
  1. **Serious, scientific character without coldness.** Plex was drawn for technical and research contexts. Its plain, engineered shapes suit a pharmaceutical brand presenting published research, and it has none of the decorative swing that read as "fantasy".
  2. **Readable for older readers and people with memory difficulties.** Easily confused characters (I, l, 1; 0 and O) are clearly distinct, counters are open and spacing is generous. This serves the brief's first priority: readability for older people and their caregivers.
  3. **One visual voice across EN, FR and AR.** The Arabic version already uses IBM Plex Sans Arabic, the sister of this family. Latin and Arabic pages now share proportions and tone instead of mixing three unrelated families.
  4. **One family for every role.** Headings, body and interface use the same family at different weights, which keeps hierarchy consistent and removes one font download.
  5. **Open licence, self-hosted.** OFL, installed from npm (`@fontsource-variable/ibm-plex-sans` 5.3.0, variable weight 100–700 with italics) like the previous fonts; no third-party font requests.
- **Implementation:** `--font-display` and `--font-body` both point to IBM Plex Sans; headings move from 700 to 600; negative tracking tuned for the tighter Bricolage is eased everywhere (for example −0.04em → −0.025em, −0.045em → −0.028em). The Bricolage and Jakarta packages stay installed only because `scripts/build-summary-pdf.mjs` (the draft doctor summary PDF) still embeds them; the site no longer loads them.
- **Verification:** production and preview builds and both content checks passed. Inspected the home page full-length at 1440 and 390, the hero at 1280×720, `/memowell` at 1440 and `/science` at 390. No page among the ten main routes scrolls horizontally at 320 or 390 (the overflow script lists only the decorative header rings, which are clipped and do not make the page scroll).

## Formulation story v6: K-Vie™ → AKBA → capsule (2026-10-26)

- **Client direction:** remove the first step ("Resin of Boswellia trees — frankincense"); the manufacturing story starts at the K-Vie™ step, so that step needs a new opening motion; after K-Vie™ comes AKBA (acetyl-11-keto-β-boswellic acid), shown by its molecular structure; the steps then lead from K-Vie™ to the capsule. The client supplied a skeletal-formula image of the boswellic acid scaffold (R–O at C3, 11-keto, COOH at C4).
- **Molecule source:** PubChem CID 11168203, "Acetyl-11-Keto-Beta-Boswellic Acid" (C32H48O5; all 11 stereocentres defined; InChIKey HMMGKOVEOFBCAU-BCDBGHSCSA-N, which matches the NCATS record). Its 3D conformer's 37 heavy atoms and 41 bonds (4 double: 11-C=O, C12=C13, ester C=O, acid C=O) are stored in `src/scripts/akba.js`; hydrogens omitted. CID 6918115 carries the same formula with incomplete stereochemistry and was not used. PubChem data is public domain.
- **Chapters and stages** (one scrubbed value; each chapter plays its stage in ~70% of its scroll range, then holds):

| # | Chapter | Scene (state.p) |
|---|---|---|
| 1 | Micronized (+ the K-Vie™ sentence) | New opening: a loose cluster of coarse, faceted golden granules; they break up from the base into fine dust that joins a slow vortex (0–0.2) |
| 2 | Microcrystalline | The dust snaps into the rotating crystal lattice with unit-cell lines (0.2–0.4) |
| 3 | K-Vie™ · standardised to 40% boswellic acids | Exactly 40% of the 64 crystals (26) and two in five dust grains turn gold; the rest dim; the glow warms (0.4–0.56) |
| 4 | AKBA · acetyl-11-keto-β-boswellic acid ("AKBA is one of the boswellic acids.") | The lattice clears; the dust gathers into a halo on the molecule's atoms and bonds; atoms appear along the chain from the E-ring and each bond grows from its first atom; carbon ice-white, oxygen gold; the molecule turns slowly (0.56–0.78) |
| 5 | Vegetarian and gluten-free | The molecule recedes; its dust condenses into the capsule volume; the halves close with a rim pulse and the capsule turns under a sweeping glint (0.78–1) |

- **Claims:** the only new public text is the AKBA label and the sentence "AKBA is one of the boswellic acids." (a chemistry fact carried by the compound's name). AKBA is not named in the supplied product documents; its inclusion is the client's direction. The 40% highlight visualises the approved "standardised to 40% boswellic acids"; no mechanism, absorption or body imagery is drawn. The resin sentence is removed from Part 4 §3; `/memowell` still explains the resin origin.
- **Unchanged:** section heading, rail, chapter/keyboard logic, pin lengths, the static SVG capsule poster and reduced-motion composition (closed capsule beside the listed chapters), deferred 3D loading.
- **Verification:** production and preview builds and both content checks passed. Inspected all five chapters and their transitions at 1440×900 (stops 0, 0.07, 0.14, 0.34, 0.5, 0.62, 0.66, 0.69, 0.74, 0.9, 0.99 of the pin) and at 390×844 with real WebGL (SwiftShader), with no browser errors. Direct jumps and reverse scroll settle text and scene on the same chapter. In software WebGL the first frame after a long jump can show the previous chapter's text for a moment while the renderer blocks; it settles on the next frame.

## Chapter 4 reframed: a look inside K-Vie™ (2026-10-27)

- **Why:** AKBA is not made from K-Vie™. It is one of the boswellic acids that occur naturally in *Boswellia* resin (raw *B. serrata* gum resin ≈ 0.7% AKBA by dry weight in one HPLC study, PMC6273064); K-Vie™ concentrates the boswellic acids to 40%. A sequence "K-Vie™ → AKBA → capsule" read as a manufacturing step, so the client chose to show AKBA as a look inside K-Vie™ instead.
- **Motion:** in chapter 4 the lattice scales up about one gold crystal near its centre (always among the 40% lit) and brings it to the middle of the frame, so the camera seems to fly into K-Vie™ while the other crystals stream past and fade; that crystal then shrinks as AKBA unfolds inside it (the molecule scales up from crystal size while its bonds build). Chapters 1–3 and 5 are unchanged.
- **Copy:** label "Inside K-Vie™ · AKBA"; body "AKBA (acetyl-11-keto-β-boswellic acid) is one of the boswellic acids." Part 4 §3 updated.
- **Open point:** the label implies that K-Vie™ contains AKBA. That, and its share, is not in the supplied product documents and no public specification was found; Kondor's specification or certificate of analysis should confirm it.
- **Verification:** production build and content check passed; inspected the transition at 1440×900 (stops 0.5–0.9) and 390×844 (0.6–0.74) with real WebGL, no browser errors.

## Chapter 4: AKBA comes out of an incoming crystal (2026-10-27)

- **Client feedback (screenshot at the chapter-4 midpoint):** the molecule should come out of one of the crystals while that crystal is entering the scene from somewhere in space; before, it appeared small and late inside a crystal that had been brought to the centre.
- **Motion:** the camera still flies through the lattice and its crystals stream past, now clearing sooner (0.58–0.64). A separate gold crystal with a warm glow travels from deep space (behind and above the lattice, right) along a curved path to the centre, turning and slowing as it arrives (0.59–0.75). From 0.64 it opens with a brief flare and shrinks away while AKBA grows out of it, riding the same path from 4% to full size and building bond by bond; the dust gathers onto it. The molecule is complete at the centre by 0.77 and holds there through the chapter.
- **Verification:** production build passed; inspected 0.62–0.8 at 1440×900 and 0.64–0.72 at 390×844 with real WebGL, no browser errors.

## Chapter 5: AKBA goes into the capsule; halves telescope (2026-10-27)

- **Client feedback (screenshot mid-chapter 5):** the continuity of AKBA entering the capsule, or the shells coming to take the molecule inside, was missing; and the two halves faded into each other instead of one sliding into the other.
- **Cause:** the molecule shrank away (0.79–0.87) before the halves arrived, and the halves flew in from opposite diagonals while rotating, so their shells crossed.
- **Motion now:** the finished molecule stays; it turns to the capsule's long axis and shrinks to 0.52 so it fits inside the 0.5 shell radius (measured: 0.42 radial, 0.67 half-length) (0.78–0.84). Both halves move only along that axis: the body slides in from one side with its open end towards the molecule and takes it in (0.79–0.88); the cap arrives from the other side and, being wider (0.52), slides over the body's open end until the seam sits at the centre (0.83–0.92). The dust travels in with the molecule; a rim pulse marks the seal; the molecule is hidden once closed; the capsule then turns under the sweeping glint as before.
- **Verification:** production build passed; inspected 0.8–0.99 at 1440×900 and 0.83–0.95 at 390×844 with real WebGL, no browser errors. Reduced-motion/static frame remains the closed capsule.
- **Follow-up (same day): a full turn before entering.** The client asked for AKBA to turn a little more with the scroll before going into the capsule. In chapter 4 the molecule now eases round while it builds and rests broadside for reading (a first try with a full turn there ended end-on at the reading pause and was rejected during review). Chapter 5 opens with one full scroll-driven turn of the finished molecule (0.78–0.87), with a slight tilt so its depth reads; the capsule beats move later to make room: line up and shrink 0.86–0.9, body 0.87–0.93, cap 0.9–0.96, sealed 0.96–0.97, glint 0.96–1. Inspected 0.77–0.9 at 1440×900 and 0.83–0.95 at 390×844.

## "Why" photograph: the doctor character in the lab (2026-10-27)

- **Client direction:** use the client's doctor character (Higgsfield element `dr`, "Dr- 01") on the site, starting with the `#why` photograph; the picture must carry the meaning of the section's copy.
- **Meaning:** the copy says researchers are looking at inflammation in the nervous system and closes on "This is an area of active research, not a settled answer." The photograph shows that moment: the doctor talks a colleague through a hand-drawn result and a printed paper at a daylight research bench; he weighs it. Researchers, plural, at an open question. No brain, neuron, scan, screen or mechanism imagery (FIND-03); no readable text.
- **Production:** Nano Banana Pro (served as Nano Banana 2 by Higgsfield), 4:5, element bound by id; three concepts compared (pipetting alone; pausing over notes alone; discussion with a colleague). The discussion was chosen; the bottom 7% was cropped to remove an off-palette green box. Files `public/img/photos/researcher-lab-{640,1024,1600}.webp`; `caregiver-planner` is kept but no longer used. AI-generated people still need Kondor sign-off.
- **Verification:** production build and content check passed; inspected the section at 1440×900 and 390×844.

## Professional band: Kondor's frosted glass panel (2026-10-27)

- **Client direction:** rebuild the homepage professional band (`#professionals`) with the doctor character and introduce Kondor's frosted, freeform translucent panel carrying text, with motion (reference: the client's Kondor landing hero; that deployment and its repository were not reachable from this session, so the panel follows the Kondor Brain panel grammar and its eight canonical panel images).
- **Photograph:** the doctor (`dr` element) reads a printed paper with a results table and chart in a daylight consulting room, in the right third; the left half stays quiet for the panel. It answers the band's copy ("study designs, full results tables…"). `pro-reading-{640…2400}.webp`, 16:9.
- **Panel:** one flat, neutral, softly frosted, asymmetric open shape (SVG clip path in bounding-box units, `backdrop-filter` blur 22px, 40% white), no rim, outline or colour fill, over the quiet window side; lead, body and link sit fully inside it with generous padding. Copy unchanged. Phones: square photo cropped to the doctor, the panel rising over its lower edge (the desk, never the face). RTL mirrors the photograph so the panel stays on the quiet side.
- **Motion (GSAP, existing engine):** as the band arrives the panel opens from a small seed into its shape while blur and milkiness come up, then the three lines rise inside it (~1.5 s, replays after leaving the viewport, focus completes it); while the band scrolls the outline drifts slowly between two shapes of the same family and the photograph settles from 1.08 to 1. One writer owns the clip path. Reduced motion and no-JS show the resting shape and settled text.
- **Verification:** both builds and content checks passed; inspected entrance and settled frames at 1440×900 and 390×844, reduced motion, and Arabic preview at 1440; no horizontal overflow.

## Every doctor is the doctor character (2026-10-27)

- **Client instruction:** wherever the site shows a doctor, it is the client's doctor character (Higgsfield element `dr`).
- **Remade with the same compositions and briefs:** `patient-routine` (`/who-its-for` head and the homepage audience gallery: follow-up appointment, he explains his own planner while she listens) and `hcp-evidence` (`/science/professionals` band: she and a younger colleague review a printed paper in a Dubai clinic office). Follow-up (client): the pharmacists are the same character too — `where-pharmacy` (Home, Where to find) and `partners-counter` (`/about/partners`) remade with the same compositions; scenes generated without the bottle, the official cutout composited at about 5% of frame height on the counter (`BOTTLE=990,1505,115` and `900,1850,120` on the 1792×2400 sources).
- **Fix:** the homepage "Who it was studied in" gallery took its third photo from the Why section, so the new research photograph appeared twice. The gallery now has its own picture again (`caregiver-planner`, "Brain fog and delirium"); no photograph repeats on the homepage.
- **Verification:** both builds and content checks passed; inspected both pages at 1440 and 390.

## Site-wide text motion (2026-10-27)

- **Client direction:** text motion across the whole site.
- **System (one place, `src/scripts/motion.js`, GSAP SplitText already in the stack):**
  1. Every `h1`/`h2` in `main` (and anything `data-split`): masked line rise; `.accent` strokes then draw in under the key word. Page heads play on load, the rest once on entering.
  2. `h3` titles (cards, lists): quicker word rise.
  3. Page-head introductions (and `data-text-lines`): line-by-line fade-rise; paragraphs with links stay whole and fade.
  4. Display statements (`data-text-emphasis`, e.g. the Why caveat; blog blockquotes): words brighten from 30% as they are read (scrubbed).
  5. Buttons: rolling label on hover/focus; the second line is a text-shadow, so nothing is announced twice.
- **Rules:** lines and words only, never letters (Arabic shaping and joins kept); text with links or controls is never split; headings keep their full accessible name; scenes with their own text performance opt out with `data-text-motion="off"` (hero, 3D story chapters, Who story list, professional band, closing). Headings with `data-reveal` are animated only by the split. Reduced motion and no-JS show the settled text.
- **Verification:** both builds and content checks passed. Scrolled all ten main routes at 1440×900: no browser errors, no horizontal overflow, no text left hidden after its entrance (only the 3D story's inactive chapters, by design), heading names complete. Inspected mid and settled frames on `/science`, the Arabic home and the button hover.

## Homepage Evidence → Closing: Kondor glass system, day scene, new copy (2026-10-27)

- **Client direction:** redesign the homepage from "What the research found" onward with Bex Web Design, using the Kondor frosted panel for a more stylish look; rewrite the copy as a senior UX writer; redesign "How to take it" with better motion; make the glass clearer and its entrance slower and smoother.
- **Copy (Part 4, HOME §5–9 updated, client-directed):** the point first, short sentences, labels that name the destination ("Check your country", "Open the professional section"). Facts, numbers with population and source, past tense, claim scope and the closing doctor/pharmacist conversation are unchanged; nothing new is claimed. Evidence gains a fact list (85 people · 6 months · Randomised · Published) so the large "3.11" keeps its population, duration, comparison and source in the same panel. "How to take it" is now headed by the dose and labelled by meal.
- **Glass system:** `components/Glass.astro` + `lib/glass-shapes.js` (three silhouettes of the Kondor panel family, each with a resting and a drift outline). Flat, neutral, no rim or fill colour: a light-to-clear white veil plus backdrop blur over photographs; over the soft Memowell colour fields (indigo / blue / cyan gradients, no filter) the veil alone, because Chromium shows a clipped backdrop blur's rectangular box inside clipped, rounded sections. One controller in `motion.js` opens every panel from a small seed (~2.6 s, power3.inOut), brings the frost up (`--m`), raises its parts, and drifts the outline with scroll; it replays after leaving the viewport, focus completes it, reduced motion shows the settled panel.
- **Sections:** Evidence — dark ground, colour fields, result panel (kicker, 3.11 figure, result sentence, MMSE explainer, facts, DOI). How to take it — one day: a sun crosses the arc from morning to evening (RTL right to left), each capsule lands on its plate as the sun reaches that meal and the label comes up; desktop pins the scene below the header (+=140%), phones scrub in place; then the "Give it eight weeks" panel opens and its eight segments fill with scroll. Professional band — moved onto the shared component; a soft cool shade on the window side makes the clear glass readable. Where to find it — the panel rests over the photograph's shelf edge with two colour fields behind it. Closing — the bottle stands in front of a dark glass panel and rises as it opens.
- **Fixes found while building:** text-motion triggers were recreated on every re-split, which broke ScrollTrigger when a re-split landed during a pinned scene's refresh ("reading 'end'"); each text element now has one trigger created once, and a re-split only rebuilds its paused animation. Colour fields made filter-free (a blur filter was clipped into a visible edge). Sections with fields clip horizontally (no page overflow).
- **Verification:** production and preview builds and both content checks passed (250 copy sentences). Desktop 1440×900 and phone 390×844: every glass panel fully open while in view, including those after the two pinned scenes; no browser errors on full scroll or direct jumps (EN and AR); no horizontal overflow; settled (reduced-motion) states of all five sections; day-scene frames across the pin; closing entrance frames; Arabic RTL at 1440.

## How to take it in one view; glass panels open sooner (2026-10-27)

- **Client feedback:** the "Give it eight weeks" panel appeared late; it and the day motion should share one section and one viewport, side by side. Glass panels in every section should appear with less delay.
- **Layout:** desktop puts the day (heading, dose line, arc and three smaller plates, food sentence; 7 of 12 columns) beside the eight-week panel (5 columns) in one pinned view (+=170%). The day plays over the first 60% of the pin, then the eight weeks fill. Phones stack them and scrub in place; the weeks fill as the panel scrolls up.
- **Glass timing:** every panel now starts to open as soon as it enters the view (top at 92%), unfolds over ~2 s with a soft ease-out, the frost comes up at once and the text follows after 0.25 s; it opens once and stays open (no replay on re-entry, which had also reset the panel inside the pinned view). The closing bottle rises with it.
- **Verification:** production build and content check passed; every panel fully open while in view at 1440×900 and 390×844; no hidden text after a full scroll; no browser errors on full scroll or direct jumps; no horizontal overflow; frames across the pinned view show the day, then the weeks filling.

## Glass motion seen on screen; evidence intro entrance; closing padding (2026-10-27)

- **Client feedback:** the glass panels looked static; the evidence text on the left needs an entrance; the closing panel's inline padding was uneven.
- **Cause (measured at reading pace):** panels started opening with their top at 92% of the view, and with a fast ease-out most of the growth happened below the fold; they also played only once.
- **Glass now:** opens once its top is at 80% of the view, outline over ~1.8 s with an even ease-out (power1.out), frost over 1.4 s, text after 0.3 s; replays after leaving the view (the panel inside the pinned How-to-take-it view opens once and stays); while scrolling, the outline keeps morphing (drift amplified 1.6×) and the panel drifts ±40px against the page.
- **Evidence intro (`[data-intro]` in motion.js):** when the block's top reaches 75% of the view, the heading rises line by line from a mask, the lead follows line by line, the divider draws in, the further-studies sentence and actions rise; replays after leaving the view; focus completes it; reduced motion shows it settled.
- **Fix found while building:** re-splitting text rebuilt timelines with `kill()`, which left elements frozen in their hidden from-state, so a new `from()` took the hidden state as its end; timelines are now `revert()`ed before rebuilding (intro and the shared text-motion helper).
- **Closing:** even inline padding; the start side adds the width of the bottle's overlap, so the text sits as far from the bottle as from the panel's end (checked at 1440 and 1920).
- **Verification:** production build and content check passed; entrance frames at reading pace; every panel fully open in view; no hidden text on inner pages; no browser errors on full scroll or direct jumps.

## Last three sections differentiated (2026-10-27)

- **Client feedback:** the last three sections (professional band, where to find it, closing) looked alike: each was a glass panel opening.
- **Now one signature per section:** the glass panel stays only where it began, over the professional photograph. Where to find it has no panel: the copy enters line by line (heading from a mask, text, then the action), and the pharmacy photograph sits in an arched frame revealed from the bottom like a curtain while the image settles from a slight zoom. The closing is a typographic invitation on a dark stage: a large heading with two cyan strokes under "Talk it through", and the bottle on a soft light inside four concentric rings that open outward as it rises; the two dashed rings turn slowly in opposite directions as the section scrolls. Copy is unchanged.
- **Behaviour:** both entrances replay when the section comes back into view; reduced motion shows them settled (no clip, no offset). Arabic mirrors the columns.
- **Verification:** production and preview builds and both content checks passed. Screenshots at 1440×900 (EN, AR) and 390×844; rings concentric after the entrance; no browser errors on full scroll or direct jumps (EN, AR); no horizontal overflow; nothing left hidden under reduced motion.

## Formulation scene: steps flow into each other (2026-10-27)

- **Client feedback:** the 3D formulation steps (01–05) did not join smoothly.
- **Cause (frames sampled across the pin):** each chapter played its stage over 70% of its scroll, eased to a full stop, and held still for the rest; the idle life also stopped because it only ran while the stage moved. So every step ended in a frozen frame, the text cut over while nothing moved, and the next stage started from rest. The two chapter cards also cross-faded in the same place with blur, and the fly-through into the lattice had only ~170px of scroll.
- **Now:** one smooth monotone curve (`lib/monotone.js`) turns scroll into scene progress. Each chapter plays its stage, then keeps drifting slowly through the stage's quiet tail while it is read (never below ~17% of the playing speed), so the next text arrives on a moving scene that gathers speed into its stage. The fly-through and the capsule closing get more scroll. The camera path uses the same curve, so it no longer changes speed at its keys. Idle life runs whenever the visitor scrolls through the pin. Text handoff: the outgoing card lifts away in ~0.26s (down when scrolling back), the incoming one follows with number, title, text and actions rising in turn (~0.9s in all); the two never overlap, no blur. Scrub smoothing 1.1s.
- **Verification:** production and preview builds and both content checks passed. 41 frames across the pin at 1440×900 (no frozen frames at any step boundary); per-frame text opacity/offset forwards and backwards; phone 390×844 frames; no browser errors (EN, AR, direct jumps); reduced motion unchanged (no pin, settled scene).
- **Slower (client follow-up, same day):** about a third more scroll per step (desktop pin 420% → 560% of the view, phones 400% → 520%), softer scrub (1.4s), and a calmer text handoff (out ~0.36s, in ~1.2s with number, title, text and actions in turn). Checked: pin lengths, per-frame text handoff (no overlap), no browser errors (EN, AR, direct jumps), both content checks.
