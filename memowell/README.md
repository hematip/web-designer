# Memowell® website

The Memowell site for Kondor Pharma, built from `brief/BRIEF.md` (the agency-approved brief) with the `bex-web-design` skill.

- Design rationale, concept and the signature-scene contract: [`docs/design-brief.md`](docs/design-brief.md)
- Draft one-page doctor summary: [`deliverables/memowell-doctor-summary-DRAFT.pdf`](deliverables/memowell-doctor-summary-DRAFT.pdf). It is **not linked** from the site until approved.

## Stack

| Part | Choice | Why |
|---|---|---|
| Site | Astro 5 (static HTML, no client framework) | Fast, accessible pages that any host can serve. Pages have correct URLs, titles and meta for SEO, which matters because the blog is the main search entry |
| CMS | Decap CMS 3.16.3 at `/admin` | Git-based, so content lives in this repo. It has the editorial workflow (**Draft → In review → Ready**) and side-by-side EN/FR/AR editing from day one |
| Type | Source Serif 4, Atkinson Hyperlegible Next, Noto Naskh Arabic | All OFL and self-hosted from npm. Atkinson was designed for low-vision legibility (it draws zero with a slash on purpose) |
| Motion | Native scroll, ~100 lines of vanilla JS | One element writes the note's position; no smooth-scroll library. Respects `prefers-reduced-motion` |

## Commands

```bash
npm install
npm run dev              # local development at http://localhost:4321
npm run build            # production build → dist/ (EN only, approved content only)
npm run build:preview    # review build → dist-preview/ (EN/FR/AR, drafts, yellow pending markers, noindex)
npm run check:content    # verifies the copy deck verbatim, banned words, disclaimers and internal links (run after build)
npm run cms              # local CMS backend; then open http://localhost:4321/admin/
node scripts/a11y-check.mjs http://localhost:4321 / /memowell/   # axe-core WCAG A/AA scan of a running build
node scripts/build-summary-pdf.mjs                                  # rebuild the draft summary PDF from site copy
```

## How content works

- `content/pages/<lang>/<page>.yml` holds the page copy, `content/site/<lang>/strings.yml` the navigation, footer, disclaimers and UI text, and `content/articles/<lang>/*.md` the blog. `content/settings/*.yml` holds downloads, form endpoints, contact details and published languages.
- **Publishing gate.** The production build shows only entries whose `status` is `approved`. Drafts appear only in the preview build, clearly marked.
- **Languages.** EN is the default at `/`; FR is at `/fr/` and AR at `/ar/`, with a full RTL layout. In the production build they stay unpublished until `published_locales` in Settings includes them. Until a translation exists, the preview shows the English original inside the mirrored layout with a "translation pending" banner. Nothing is machine-translated for publication.
- **Honest states.**
  - Forms stay disabled with the notice "This form will open soon." until an endpoint is set in Settings.
  - The summary and catalogue buttons show "This file will be available soon." until a file is approved.
  - Unpublished pages are never linked.

## The signature scene (homepage)

**"Facts in hand."** A plain paper note titled *Taking this to your doctor*:

- starts tucked behind the official bottle;
- slides into a column beside the reading text;
- ticks off *What is in it*, *What the research found* and *How to take it* as each section is read;
- is carried past the professional band;
- lands complete beside "Download a one-page summary (PDF)".

It shows information being gathered for a conversation, which is the site's primary action (brief Part 2.1). It never shows a change in a person, a cure or a mechanism (brief Part 5).

- **Below 1100px:** the scene simplifies to a static note in the hero and a closing note whose rows tick into view.
- **Reduced motion and no JavaScript:** static notes with the same information.

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

Every item below is built around and never invented. In the preview build each one is marked in yellow on the page where it applies.

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
| 14 | One-page summary PDF | Header action target, home §9, `/memowell`, `/who-its-for`, `/science` | **Draft produced** (`deliverables/`). Buttons show "This file will be available soon." until it is approved and set in Settings → Downloads | Scientific officer |
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
| Homepage note (decorative, `aria-hidden`) | Title "Taking this to your doctor"; rows "What is in it", "What the research found", "How to take it", "Five questions worth asking" | Fragments of approved headings and the `/memowell` §6 sentence; also used as a heading in the draft PDF |
| Homepage §2 and §5 | "Source: DOI …" lines | Same format as the science page; satisfies "every number keeps its source" |
| Homepage §5 | The phrase "3.11 points higher on MMSE" is typographically highlighted inside its own sentence | No words changed; context (85 people, six months, placebo, source) stays in the same sentence |
| Pending states | "This form will open soon." (brief example) · "This file will be available soon." · "Coming soon" · "Articles will appear here after scientific review." | Honest states for missing destinations |
| Interface | "Skip to main content", "Menu", "Close", "Main", "Language", "Breadcrumb", "Home", "On this page", "Source:", "Sources:", "Sources", "required", "Send", "Published", "Last reviewed", "Author", "Category", "All articles", "Previous", "Next", "Page {n} of {total}", "Related", "Page not found", "This page does not exist. Use the menu, or go to the home page." | Needed for navigation and accessibility |
| Image alt text | Bottle, capsule and bottle-in-hand descriptions | Descriptive only, no claims |
| Language names | "English", "Français", "العربية" | Shown in the switcher |

### Visual and other decisions to confirm

- **Slashed zero.** Atkinson Hyperlegible draws zero with a slash (0 vs O). It was kept for legibility; confirm the client is comfortable with "40%" and "NPN 80107357" rendering this way.
- **No charts.** Only between-group differences were supplied; a chart would also need scientific-officer approval (brief Part 4).
- **No people photography** is used. The concept needs none.
- **FDA.** No FDA mark or mention exists anywhere; this is enforced by `npm run check:content`.

## Verification done in this build

**Copy and links.** `npm run check:content` passes on both builds:

- 232 copy-deck sentences and labels were found verbatim;
- no banned words or "FDA" appear;
- the general disclaimer is on every page, the product disclaimer on `/memowell` and `/who-its-for`, and the professional band on every content page;
- 580 internal links resolve in production and 3,766 in preview.

**Accessibility.** The axe-core scan (WCAG 2.0, 2.1 and 2.2 A/AA plus best practice) of 10 production pages at 1440px and 390px found no violations.

**Keyboard.**

- The skip link moves focus to `main`.
- The Science and About submenus open with Enter and close with Escape, returning focus to the button.
- The mobile menu is a modal: focus moves to Close and returns to Menu.

**Layout.**

- There is no horizontal scroll at 320px.
- At 200% text size the header wraps instead of overflowing.
- Rendering was checked at 1440, 1024, 390 and 320px, with reduced motion, and in the RTL Arabic preview.
- The note journey was inspected at the hero, column, held and arrival states, both forwards and on mid-page reload.

**Not verified.**

- Real-device performance and screen-reader output (VoiceOver or NVDA).
- Decap login against the production backend; only the local backend was tested.
- Form submission, because no endpoints exist.
