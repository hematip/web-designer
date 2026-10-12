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
| DEC-03 | Production build = EN only, approved content. Preview build = all locales and drafts, with banners and noindex | P7 (FR/AR pending, AR unpublished) | Selected |
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
| Type | Bricolage Grotesque Variable (display, 700); Plus Jakarta Sans Variable (body/UI, 400–700; unslashed zero); Instrument Serif Italic (accent words only); IBM Plex Sans Arabic (AR). All OFL |
| Colour | midnight #060C33 / #0C1650; royal #2B3FD9; electric #4C63FF; cyan #19D3E2 (accents on dark only); ice #F4F6FF; cream capsule #F2DFC2. Text contrast stays ≥ 4.5:1, mostly ≥ 7:1 |
| Motion engine | GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3.26, on one GSAP ticker clock. `gsap.matchMedia` for desktop, mobile and reduced motion. HTML renders the final state; JS only animates from it. Three.js r186 renders the formulation scene (v3) from the same ticker |

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

- **Below 900px:** no pins, except the formulation stage, which pins full-screen after its copy so the 3D sequence has room; other scenes play as scrubbed sequences inside normal flow; the horizontal track becomes a vertical stack. Fewer particles on phones.
- **Formulation fallbacks:** reduced motion renders one still 3D frame of the closed capsule and lists all five labels; without WebGL (or on context loss) the SVG capsule poster stays.
- **Reduced motion and no JS:** final composed states only, with no Lenis.
- **Auto-moving content:** none runs beyond the load entrance (WCAG 2.2.2). The 3D scene's ambient motion advances only while the visitor scrolls and settles within about 1.5 s.

### Also replaced

The v1 "facts in hand" travelling note is retired. The summary returns as a glass "Taking this to your doctor" card in the closing section and on `/memowell`.
