# Memowell® website

The Memowell site for Kondor Pharma, built from `brief/BRIEF.md` (the agency-approved brief) with the `bex-web-design` skill.

- Design rationale, concept and the signature-scene contract: [`docs/design-brief.md`](docs/design-brief.md)
- Draft one-page doctor summary: [`deliverables/memowell-doctor-summary-DRAFT.pdf`](deliverables/memowell-doctor-summary-DRAFT.pdf). It is **not linked** from the site until approved.

## Stack

| Part | Choice | Why |
|---|---|---|
| Site | Astro 5 (static HTML, no client framework) | Fast, accessible pages that any host can serve. Correct URLs, titles and meta for SEO, which matters because the blog is the main search entry |
| CMS | Decap CMS 3.16.3 at `/admin` | Git-based, so content lives in this repo. Editorial workflow (**Draft → In review → Ready**) and side-by-side EN/FR/AR editing from day one |
| Type | IBM Plex Sans (all Latin text), IBM Plex Sans Arabic (AR) | All OFL, self-hosted via npm. One family across EN/FR/AR; reasons in `docs/design-brief.md` ("Typeface change") |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText, Flip; standard no-charge licence) + Lenis 1.3.26 smooth scroll | One GSAP-ticker clock. `gsap.matchMedia` handles desktop, mobile and reduced motion. HTML renders complete content; JS enhances it |
| 3D (v3, in the hero since v4) | Three.js r186 (WebGL), only in the home hero scene (`src/scripts/formulation-3d.js`) | Loaded as a separate chunk once the browser is idle after first paint, so the page never waits for it. All geometry is procedural (no external models or textures). Without WebGL the static SVG capsule poster stays |

## Commands

```bash
npm install
npm run dev              # local development at http://localhost:4321
npm run build            # production build → dist/ (EN only, approved content only)
npm run build:preview    # review build → dist-preview/ (EN/FR/AR, drafts, muted pending notes, noindex)
npm run check:content    # verifies the copy deck verbatim, banned words, disclaimers and internal links (run after build)
npm run cms              # local CMS backend; then open http://localhost:4321/admin/
node scripts/a11y-check.mjs http://localhost:4321 / /memowell/   # axe-core WCAG A/AA scan of a running build
node scripts/build-summary-pdf.mjs                                  # rebuild the draft summary PDF from site copy
```

**Review preview.** Every push to `claude/happy-volta-7wdu1t` that touches `memowell/` runs `.github/workflows/memowell-preview.yml`: it builds `dist-preview`, runs `check:preview`, and deploys to production of the Vercel project `memowell-preview-site` (team Bextudio), so the review URL stays the same. It needs the repository secret `VERCEL_TOKEN`; without it the deploy is skipped.

## How content works

- `content/pages/<lang>/<page>.yml` holds the page copy, `content/site/<lang>/strings.yml` the navigation, footer, disclaimers and UI text, and `content/articles/<lang>/*.md` the blog. `content/settings/*.yml` holds downloads, form endpoints, contact details and published languages.
- **Publishing gate.** The production build shows only entries whose `status` is `approved`. Drafts appear only in the preview build. The client removed the global preview banner; local pending states and `noindex` remain.
- **Languages.** EN is the default at `/`; FR is at `/fr/` and AR at `/ar/`, with a full RTL layout. In the production build they stay unpublished until `published_locales` in Settings includes them. Until a translation exists, the preview shows the English original inside the mirrored layout with English language semantics. Nothing is machine-translated for publication.
- **Honest states.**
  - Forms stay disabled with the notice "This form will open soon." until an endpoint is set in Settings.
  - The summary and catalogue buttons show "This file will be available soon." until a file is approved.
  - Unpublished pages are never linked.

## Visual direction (v2): "clinical-cosmic product stage"

- Midnight/cobalt aurora stages alternate with bright ice-white reading sections.
- v4: the hero is the formulation story (resin → capsule) in real-time 3D; the official bottle appears in the closing panel.
- Large IBM Plex Sans display type with one colour accent word.
- Bento cards, 32–44px radii, and a floating glass pill navigation.

Full record: `docs/design-brief.md` → "Version 2".

### Homepage signature scenes

1. **K-Vie™ (and a look inside it at AKBA) → capsule, told while you scroll** (v6 story, 2026-10-26/27; v5 order: hero question → "why" → this story; real-time 3D, pinned on desktop, the scene pins on phones). Placing it in the hero (v4) was reverted: the hero question followed by a transformation ending on a capsule read as problem → product → solution.
   - the approved §3 heading and five chapters appear one at a time, each changing together with its stage of the scene:
     1. *Micronized*: coarse golden K-Vie™ granules break up from the base and the fine dust spins into a slow vortex;
     2. *Microcrystalline*: the dust snaps into a rotating 3D crystal lattice;
     3. *K-Vie™ · standardised to 40% boswellic acids*: two in five crystals (40%) turn gold;
     4. *Inside K-Vie™ · AKBA*: the camera flies through the lattice while its crystals stream past; a glowing gold crystal comes in from deep space, opens on its way, and the AKBA molecule grows out of it while travelling, arriving at the centre built bond by bond from its real 3D conformer (PubChem CID 11168203; `src/scripts/akba.js`);
     5. *Vegetarian and gluten-free*: the finished AKBA makes one full turn with the scroll, then turns to the capsule's axis and shrinks to fit; the body half slides over it from one side, the cap comes from the other and telescopes over the body's open end, closing the molecule and its dust inside; the capsule then turns under a sweeping light.
   - each chapter plays its stage in the first ~70% of its scroll range and holds the resolved frame while it is read; one scrubbed value drives text and scene, so reverse scroll and skips land on the same frame;
   - chapter texts are whole sentences of the copy deck (§3, including "AKBA (acetyl-11-keto-β-boswellic acid) is one of the boswellic acids.", and the `/memowell` sentence "One bottle holds 90 vegetarian capsules."), in order; a five-part rail shows progress;
   - keyboard: tabbing to a link in a chapter that is not on screen scrolls to that chapter;
   - phones: the scene takes the screen with the chapter text over its lower part;
   - reduced motion / no JavaScript: the five chapters listed beside the closed capsule; without WebGL the SVG capsule poster stays.

   It shows the "difference from ordinary frankincense" using only the copy's own words. No body, bloodstream, brain or mechanism appears, and nothing is tied to a memory outcome.
2. **Who it was studied in:** four large numbered reading stages beside an illustrative photo contact sheet. On wide, tall screens the gallery stays beside the text and re-composes to feature the current context. The client removed the photo number badges and the numbered navigation beneath the gallery. The text stays in native vertical flow. Phones show each photograph below its corresponding group; short screens and reduced motion use the static composition.
3. **Evidence:** study context and its source sit beside the result sentence, which lights up word by word. "3.11 points higher on MMSE" resolves in cyan inside its full sentence.
4. **One capsule with each of the three main meals:** a capsule drops in and splits onto three plates.
5. **Hero film (v7, Kondor Brain):** a silent 15-second Seedance 2.5 film behind the approved hero copy — "the wall of names": a grandmother shows her granddaughter the family photo wall, tells their stories, checks one name on the back of a frame, and they hang a new photo of the two of them (scenario and direction in `docs/kondor-brain/hero-film-direction-v3.md`, approved by the client; it replaced the v2 market film, which the client rejected). Concept: meaningful connection. No product, no text in frame, no headscarves (client instruction). It plays once and holds its last frame; a pause/play button sits in the hero corner (WCAG 2.2.2). Reduced motion never starts it; the poster is the last frame. Phones load a 720p file; WebM (VP9) first, MP4 (H.264) for Safari. `[LOCAL REGULATORY REVIEW REQUIRED]`: AI-generated people need Kondor sign-off. The two button labels ("Pause video", "Play video") are new interface words in CMS → Shared site text.
6. **Supporting motion:**
   - hero load choreography (masked line reveal, the intro rising in);
   - pointer-following aurora on the remaining relevant stages; the homepage hero keeps its original family film on a calmer navy field;
   - closing-banner Appear replays on each full scroll re-entry from either direction: the heading, paragraph and contact action enter in order, followed by the bottle; reset waits until the section leaves the viewport, reduced motion stays static and keyboard focus completes the entrance;
   - batched reveals on inner pages.
7. **Below 900px:** the directions scene plays scrubbed in normal flow. The formulation scene keeps its existing phone pin and chapter system; the audience index has no pin at any width.
8. **Reduced motion and no JavaScript:** final composed states, with no Lenis.

## Domains (configure at the host; the hosting provider is still open)

| Domain | Action |
|---|---|
| `memowell.kondorpharma.com` | Primary host (all languages) |
| `memowell.ca` | 301 → `https://memowell.kondorpharma.com/` (or `/fr/` once French is published, if the client wants FR as default for .ca) |
| `memowell.ae` | 301 → `https://memowell.kondorpharma.com/` (switch to `/ar/` only after the Arabic version is approved and the UAE permit is obtained) |
| `memowell.ru` | 301 → `https://memowell.kondorpharma.com/`; target language is undecided (brief Part 9) |

Also on hosting:

- Set the Decap `backend` in `public/admin/config.yml`: the GitHub repository, or `git-gateway` on Netlify.
- Serve `dist/404.html` for unknown paths.

---

## Placeholders and pending items (single handoff list, brief Part 8.4)

Every item below is built around and never invented. Preview pages keep local pending markers where relevant. At the client's request the homepage closing panel no longer offers the unavailable PDF; other pages retain their truthful unavailable-file states.

### Open gaps from the brief (Part 9)

| # | Item | Where it shows | What the site does now | Owner |
|---|---|---|---|---|
| 1 | Contact details (address, phone, email, social handles) | `/contact` details block, footer Contact column | Hidden in production; marked placeholders in preview | Client |
| 2 | Scientific officer's email | Scientific-question form, feedback form (`/science/professionals`, `/contact`) | Forms built, disabled, "This form will open soon." | Client |
| 3 | Recipient and response time for the general form | `/contact` general form; availability enquiry routes here | Same | Client |
| 4 | Partnership form recipient | `/about/partners`, `/contact` | Same | Client |
| 5 | Updated logo with ® | Every page (header, note, footer) | Supplied ™ artwork used as is (not edited); product name in text uses ® | Client |
| 6 | Active ingredient amount per capsule | `/memowell` "What is in it", summary PDF | Field `per_capsule_amount` empty; marked placeholder in preview | Client |
| 7 | Mid-life dose (catalogue: 1 a day vs client: 3 a day) | `/who-its-for` "Approaching 65" | Approved line kept, attributed to the catalogue; flagged in preview | Client / scientific officer |
| 8 | Approval of the four "needs approval" claims: use with medication, K-Vie™ formulation, eight weeks, mednet.ca | Home §3 and §6, `/memowell`, `/science/professionals`, summary PDF | Copy deck wording used; **mednet.ca not shown anywhere**. The site must not go live before sign-off | Scientific officer |
| 9 | English text of the five case reports | `/science/professionals/case-reports` | Button plus empty target marked "Awaiting approved English text from the scientific officer". In production the button shows "Coming soon" and the page is not generated | Scientific officer |
| 10 | Registration status in the UAE, GCC, MENA and Russia | `/about/availability`, Arabic version | Only the Canada block is written; the page is ready for per-country blocks | Client |
| 11 | Is Iran / Persian in scope? (memowell.ir appears in the catalogue) | Project scope | Not built | Client |
| 12 | Which language `memowell.ru` opens in | Domain setup | See Domains above | Client |
| 13 | French and Arabic translations | `/fr/`, `/ar/` | Structure, switcher and RTL built; content falls back to English in preview only; unpublished in production | Client's translator + scientific officer |
| 14 | One-page summary PDF | `/memowell`, `/who-its-for`, `/science` | **Draft produced** (`deliverables/`). Buttons show "This file will be available soon." until it is approved and set in Settings → Downloads. The homepage PDF action was removed at the client's request | Scientific officer |
| 15 | Catalogue PDF for partners | `/about/partners` | Button disabled, "This file will be available soon." | Client |
| 16 | Amazon listing URL(s) | `/about/availability` | Approved sentence shown without a link; Settings → `amazon_urls` | Client |
| 17 | Terms of use text | `/terms` | Draft page, not generated in production; footer shows the label without a link | Client |
| 18 | Analytics tool, if any | Privacy policy | None installed; no cookies set | Client |
| 19 | Logo files for Health Canada, Alzheimer's Association, mednet.ca | Possible trust marks | None shown (not recreated). The Health Canada licence appears as text, NPN 80107357 | Client |
| 20 | "Essential content" question left unanswered | Possible extra section | Nothing added | Client |
| 21 | Hosting provider | Deployment, CMS backend | Static `dist/` works on any host; Decap backend to be set | Client |

### Items raised during the build

| # | Item | Detail |
|---|---|---|
| 22 | Privacy policy translations | EN, FR and AR translations of the client's Persian draft are written (`content/pages/*/privacy.yml`) with status **draft**. They need client and scientific-officer approval. The analytics tool and the access/deletion contact route still need adding. The draft mentions a newsletter; none is built. Until approved, the production footer shows "Privacy policy" without a link. |
| 23 | Study citation details | The client asked for full citation, publisher page and legally free full-text links per study. None were supplied; DOI links resolve meanwhile. The fields exist in the CMS (studies table rows). The link labels "Publisher" and "Full text" need approved wording. |
| 24 | Blog articles | The eight articles exist as **drafts**: title, category, sources, related page, internal "built from" note. Bodies, summaries, authors and dates are not written, as instructed. The production index shows "Articles will appear here after scientific review." |
| 25 | Missing meta descriptions | No meta description was supplied for `/about`, `/about/availability` or `/about/partners`, and no meta title for `/about/availability` (the build uses "Where to find Memowell® \| Memowell"). |
| 26 | Arabic footer line | The NPN only has meaning in Canada. The Arabic footer line must be worded so it does not read as a local licence (translator + scientific officer). |
| 27 | Testimonials | None in v1, as required. No placeholder is shown publicly; add a section later from consented feedback. |

### Words used on the site that are not in the copy deck (flagged for agency approval)

These are interface or structural words, and none of them is a claim. They are all editable in **CMS → Shared site text**.

| Where | Text | Note |
|---|---|---|
| Header action | "Taking this to your doctor" → `/memowell#summary` | The approved `/memowell` heading reused as the "doctor summary" action; avoids a dead PDF link |
| Summary card on `/memowell` (decorative, `aria-hidden`) | Title "Taking this to your doctor"; rows "What is in it", "What the research found", "How to take it", "Five questions worth asking" | Fragments of approved headings and the `/memowell` §6 sentence; also a heading in the draft PDF. The duplicate homepage card is retired |
| Hero (v2) | The word "names" is set in the italic accent face | Typography only; no words change |
| Retired scroll marquee (v2, decorative) | "90 vegetarian capsules", "Gluten-free", "NPN 80107357", "Memory health", "K-Vie™ boswellic acids", "Made by Kondor Pharma in Canada" | Removed from the homepage at the client's request. Historical CMS values remain available but are not rendered. |
| Formulation chapter titles (v6, visible `h3` headings) | "Micronized", "Microcrystalline", "K-Vie™ · standardised to 40% boswellic acids", "Inside K-Vie™ · AKBA", "Vegetarian and gluten-free" | Fragments of the approved §3 copy and the label ("90 vegetarian capsules … Gluten-free"). Chapter texts under them are whole approved sentences, unchanged. Editable in CMS → Pages → home → formulation → Story chapters. Chapters 2 and 4 depend on the pending K-Vie™ scientific-officer approval (item 8) |
| Footer (decorative) | Solid two-line "LIVE WELL, STAY WELL" beside the official Memowell logo | The catalogue slogan, unchanged and repeated from the footer line |
| Homepage §2 and §5 | "Source: DOI …" lines | Same format as the science page; satisfies "every number keeps its source" |
| Homepage §5 | The phrase "3.11 points higher on MMSE" is typographically highlighted inside its own sentence | No words changed; context (85 people, six months, placebo, source) remains alongside the result in the same study block |
| Pending states | "This form will open soon." (brief example) · "This file will be available soon." · "Coming soon" · "Articles will appear here after scientific review." | Honest states for missing destinations |
| Interface | "Skip to main content", "Menu", "Close", "Main", "Language", "Breadcrumb", "Home", "On this page", "Source:", "Sources:", "Sources", "required", "Send", "Published", "Last reviewed", "Author", "Category", "All articles", "Previous", "Next", "Page {n} of {total}", "Related", "Page not found", "This page does not exist. Use the menu, or go to the home page." | Needed for navigation and accessibility |
| Image alt text | Bottle, capsule and bottle-in-hand descriptions | Descriptive only, no claims |
| Language names | "English", "Français", "العربية" | Shown in the switcher |

### Visual and other decisions to confirm

**Illustrative photography (needs Kondor sign-off before go-live).** At the agency's request every photo on the site is generated; the supplied bottle-in-hand and capsule-in-hand photos are no longer used. Eight AI-generated, text-free photos were made with the Kondor Brain brand-creative skill (Higgsfield, GPT Image 2.5) in the Memowell blue/indigo/cyan palette, one per audience:

| Photo | Audience | Where |
|---|---|---|
| `hcp-evidence` | Doctors & specialists | `/science/professionals`, wide band — the doctor character (element `dr`) and a younger colleague review a printed paper in a Dubai clinic office (remade 2026-10-27) |
| `patient-routine` | Patients `[LOCAL REGULATORY REVIEW REQUIRED]` | `/who-its-for`, page head — follow-up appointment, he explains his own planner; his doctor is the doctor character (element `dr`) (remade 2026-10-27) |
| `caregiver-walk` | Caregivers | `/memory-health`, page head — mother and daughter on a seaside promenade, the mother leads |
| `researcher-lab` | Doctors & Specialists | Home, "why" section — the client's doctor character (Higgsfield element `dr`) talking through a hand-drawn result and a printed paper with a colleague at a daylight research bench: researchers looking at an open question (2026-10-27) |
| `pro-reading` | Doctors & Specialists | Home, professional band — the doctor character (element `dr`) reading a printed results table in her consulting room, under the frosted panel (2026-10-27) |
| `caregiver-planner` | Caregivers | Not in use since 2026-10-27 (was Home, "why") — father writes on a wall calendar, his son beside him |
| `wellness-lunch` | Wellness | `/memowell`, "How to take it" — terrace lunch; official bottle composited at ~6% of frame height |
| `where-pharmacy` | Wellness | Home, "Where to find Memowell" — pharmacist conversation; official bottle composited on the counter |
| `partners-counter` | Pharmacy / distribution | `/about/partners` — two pharmacists check a delivery; official bottle composited on the counter |
| `capsule-resin` | All | `/memowell`, "What is in it" — one cream capsule beside frankincense resin tears |

v6 (2026-10-13): all eight regenerated through the **Kondor Brain plugin** (approval packet `docs/kondor-brain/approval-packet-v1.md`, site review findings): broader casting for the UAE/GCC market, no white trousers, fewer table scenes, restrained blue, bottle composited at ≤6% of frame height with the official `memowell-front.png` (scene generated without it). GPT Image 2.5 (high, 2k) on Higgsfield. The plugin's capsule reference photo could not be passed to the generator (upload blocked in this environment), so the capsule is matched by description only.

- **Conflict with brief Part 6:** the brief says no AI-generated people presented as patients or doctors. The agency asked for all four audiences, so the client must approve these, or remove them in the CMS (Pages → section → Photo).
- The client removed the visible "Illustrative image" labels. Provenance stays in the source comments and this handoff record; decorative photographs keep empty alt text next to the approved copy. This presentation change is not a certification of advertising compliance in every jurisdiction.

- **No charts.** Only between-group differences were supplied; a chart would also need scientific-officer approval (brief Part 4).
- **No people photography** is used. The concept needs none.
- **FDA.** No FDA mark or mention exists anywhere; this is enforced by `npm run check:content`.

## Verification done in this build (v2)

**Copy and links.** `npm run check:content` passes on both builds:

- every copy-deck sentence and label (232) is found verbatim;
- no banned words or "FDA" appear;
- the disclaimers and professional bands are where required;
- all internal links resolve.

**Accessibility.** The axe-core scan (WCAG 2.0, 2.1 and 2.2 A/AA plus best practice) of 10 production pages at 1440px and 390px found no violations.

**Keyboard.**

- The skip link moves focus to `main`.
- The submenus open with Enter and close with Escape, returning focus.
- The mobile menu is a modal: focus moves to Close and returns to Menu.

**Layout.** There is no horizontal scroll at 390px or 320px.

**Scenes inspected:**

- every hero chapter (intro + five) at 1440×900, the intro at 1366×768 and 1920×1080, and all chapters at 390×844; the card track, the evidence highlight and the plates;
- keyboard focus into an off-screen hero chapter (desktop and phone);
- motion-enabled mobile at 390×844;
- reduced motion as a full static page;
- the RTL Arabic preview, with IBM Plex Sans Arabic rendering.

**Not verified.**

- Real-device frame rate and touch-scroll feel (Lenis is set with `syncTouch: false`).
- Screen-reader output.
- Decap login against the production backend.
- Form submission (no endpoints exist).
