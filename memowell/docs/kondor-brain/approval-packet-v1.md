# Memowell website — Kondor Brain approval packet v1

Prepared with the Kondor Brain plugin (v2.8.0) production orchestrator, in its stage order:
`kondor-copywriter` → `scientific-clarity-writer` → `kondor-copywriter` (COPY-LOCK) → `kondor-visual-brief-director` (VIDEO-SCENARIO + static briefs).
Nothing has been generated. `kondor-video-director` (film direction + Seedance prompt) and `kondor-brand-creative` (image prompts + renders) run only after this packet is approved.

---

## 1. COPY-LOCK `ML-WEB-01` (kondor-copywriter, final check after clarity review)

| Field | Value |
|---|---|
| Product | Memowell® |
| Market | UAE/Dubai, then GCC (plugin default); site copy is the agency-approved English deck |
| Visible copy in film and photos | **None — text-free.** All words stay in the HTML page, already approved (brief Part 4). Needs your explicit text-free authorisation (orchestrator rule). |
| Copy the film sits behind (unchanged, not re-written) | Eyebrow "Memory health" · H1 "Searching for names a little more often lately?" · approved lead paragraph · two approved buttons |
| Communication job of the film | Make an everyday name-retrieval moment legible, without fear, in a capable life (Memowell register: *quiet continuity*; persona M1 trigger: *forgetting a name*) |
| Story premise (copywriter) | A capable older adult has a brief, ordinary pause over a name, resolves it by her own action, and carries on with the people she cares about. |
| Prohibited meanings | product causes recall or any outcome · before/after · decline, dementia, MCI, Alzheimer or diagnosis cues · fear, embarrassment, pity, caregiver taking over · instant focus / stimulant / exam performance · brain, scan or lab imagery · dark→light "clarity" tied to memory · dosing on screen · any health claim in picture |
| Scientific-clarity review | **No change** — the film and photos carry no scientific statement; nothing to simplify (Tier 1, recorded per orchestrator rule). |
| Flags | AI-generated people in a memory-health context need Kondor sign-off (existing README flag, brief Part 6) · `[LOCAL REGULATORY REVIEW REQUIRED]` on the Patients photo (Memowell has no patient persona) |

---

## 2. Hero film — VIDEO-SCENARIO-v1 (proposed)

**Intake:** product Memowell · format 16:9 web hero (mobile = crop of the same film) · output film, silent, ~12 s, plays once and holds its last frame · audience **to confirm — recommended: Healthy & Wellness Individuals (persona M1, active independent ager 60–75)**.

### Three routes (different mechanisms)

| Route | Mechanism | Verdict |
|---|---|---|
| A. *The name arrives* — a friend greets her at a morning market; she pauses, then the name comes to her | spontaneous recall | Strong emotion, but recall "arriving" on a Memowell page can read as an improved-memory outcome |
| **B. *The place card* (recommended)** — she sets a long daylight table for family; pauses over one name card, checks her own blue notebook, writes, welcomes the guests | **self-directed clarification** — the plugin's preferred continuation | Same human truth, no implied outcome; ends on connection |
| C. *The photo box* — grandparent and grandchild label old family photos together | connection and continuity | Warm, but a caregiver/child guiding risks "taking over" |

### Recommended route B — scene sequence

| # | Purpose | Human action and setting | Emotional beat | Visible objects | Product |
|---|---|---|---|---|---|
| 1 | Routine | Late-morning daylight, a garden terrace. A woman of about 65, in a navy linen shirt, walks along a long table laid in white linen, placing handwritten name cards at each setting | capable, unhurried, looking forward to the day | long table, white linen, glasses, a bowl of lemons, handwritten (illegible) name cards, blue ceramic jug | none |
| 2 | Clue → suspended action | At one setting her hand stops with the last blank card; pen above it | a small, ordinary pause — curious, not anxious | blank card, pen | none |
| 3 | Searching eyeline → retained agency | She glances up and aside, half-smiles, then takes her own blue notebook from the table and runs a finger down a handwritten list | self-possessed; she has a system | blue notebook (her seating list, illegible) | none |
| 4 | Continuation | She writes the name on the card, sets it down, and looks up as family voices arrive from the garden path (a grown son and a grandchild come into soft focus) | warm, connected | card set in place | none |
| 5 | Landing frame | She steps toward them; the table holds in the foreground, the left third of the frame stays calm (sky, pale wall) for the HTML headline | quiet continuity | the laid table | none |

- **Product role:** none. The film never shows the bottle or a capsule; the product appears elsewhere on the page.
- **Memowell colour carriers (3–5 zones):** navy shirt (anchor), blue notebook and blue jug (support), pale cyan glassware reflections (echo); white/mineral field dominant.
- **Web treatment (for the video director and site build):** subject in the right two-thirds; left third quiet for the headline; plays once, holds the last frame; pause/play control; reduced motion shows the last frame as a still.
- **Required assets:** none registered needed (no product, no logo, no text). No upload.
- **Risks to watch in direction:** the pause must not read as distress; no close-up of a worried face; the notebook must read as her own system, not a carer's checklist.

---

## 3. Site photos — static briefs (text-free, non-promotional)

Shared rules for all eight: text-free (no headline, panel or logo — the page carries copy and logo); white/mineral daylight field; Memowell indigo/blue/cyan in 3–5 restrained zones; real actions, equal agency, no stock smiles; no water glass by default. **Where a bottle appears it is not generated:** the scene is generated without it (plugin "four-pass" pass 1) and the official `memowell-front.png` (identical file to the brief's official cutout) is composited at true hand scale, ~4–6% of frame height, with contact shadow (pass 2, `scripts/prepare-photo.mjs`).

| Photo · page · ratio | Audience | Visual idea / human story | Product | Must avoid |
|---|---|---|---|---|
| `hcp-evidence` · /science/professionals band · 21:9 | Doctors & Specialists | Two clinicians (one 50s, one 30s) reviewing a printed paper together at a daylight desk; one points to a table, the other annotates — equal agency | none | lab-coat theatre, brain scans, screens with data |
| `patient-routine` · /who-its-for head · 4:5 | Patients `[LOCAL REGULATORY REVIEW REQUIRED]` | A man of about 70 at a bright follow-up appointment, holding his own weekly planner; a clinician sits beside him and listens while he explains — he leads | none | diagnosis cues, hospital bed, worried expression, clinician dominating |
| `caregiver-walk` · /memory-health head · 4:5 | Patient Caregivers | Adult daughter and her mother walking arm in arm on a sunny promenade; the mother points the way and talks, the daughter listens | none | daughter steering/holding up the mother, wheelchair reflex |
| `caregiver-planner` · Home "why" · 4:5 | Patient Caregivers | Father (70s) and adult son at a kitchen table filling in a wall-style weekly calendar; the father writes, the son holds the page | none | son writing for him, pill organiser, clutter |
| `wellness-lunch` · /memowell "How to take it" · 3:2 | Healthy & Wellness | An active couple in their 60s serving a bright home lunch; plates, salad, bread | official bottle composited on the table at true scale | capsule in hand, dosing gesture, bottle in foreground |
| `where-pharmacy` · Home "Where to find" · 3:4 | Healthy & Wellness | A woman of about 60 in conversation with a pharmacist across a bright, modern pharmacy counter | official bottle composited on the counter | product held to camera, shelf wall of bottles, price tags |
| `partners-counter` · /about/partners · 3:4 | Pharmacy & distribution (pharmacist = Doctors & Specialists group) | Two pharmacists reviewing a delivery checklist together at a back counter of a clean pharmacy | official bottle composited on the counter | fake brand boxes, legible labels, warehouse clutter |
| `capsule-resin` · /memowell "What is in it" · 2:3 | All (product-led close-up, category E) | One cream capsule resting beside a few frankincense resin tears on pale stone in soft daylight | capsule only — matched to the plugin's capsule reference photo, passed to the generator as an image input | bottle, pills spilling, "natural cure" styling |

**Engine (kondor-brand-creative production stage):** Higgsfield GPT Image 2.5 (high, 2k) for the scene pass; official bottle composited after; capsule reference passed as a real image input for `capsule-resin` (plugin rule — this replaces the earlier no-upload rule, by your choice of this plugin). Each render is inspected before it goes on the site; ~3 credits per image.

---

## 4. Decisions needed

1. Confirm text-free film and photos (copy stays in HTML).
2. Film audience: Healthy & Wellness (M1) — or another group.
3. Film route: **B** (recommended), A or C.
4. The eight photo briefs as written, or changes.
