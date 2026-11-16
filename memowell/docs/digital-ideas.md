# Memowell — digital ideas register

Working record of the digital features and content ideas proposed for Memowell, sorted by where each one belongs: the website, a community or social channel, or a separate app. Started 2026-11-16 from the designer's brand-strategy matrix (Planning · Memorabilia · Meaningful connection · Patience · Reminder × Affordance · Overall health · Challenge-oriented · Concentration · Active facing) and the discussion that followed. Nothing here is built unless the design brief says so.

**Rules that apply to every idea**

- **Claims.** Games, plans, puzzles and content are presented as enjoyment, routine and time together, never as "improves memory". Brief Part 5 forbids prevention and progression claims and counts visuals and implication as claims. Nothing ties an activity to the effect of Memowell.
- **Data.** The site keeps no accounts and stores no personal or health data. Anything a visitor enters stays in their browser. Family photos, daily status and caregiver notes belong only in an app with its own privacy policy and consent.
- **Adverse events.** A Q&A form, a community or a booking page is a channel through which side-effect reports arrive. Kondor Pharma, as the Health Canada licence holder, needs a follow-up process before any of them opens. Legal to confirm.
- **Measurement tools.** No cognitive test or symptom chart on the site without a legal review (software that assesses a condition may count as a medical device in Canada) and the rights holder's written permission. See `docs/` → "Memowell-self-tests-feasibility" (sent to the client 2026-11-16).
- **Every piece ends with "talk to your doctor or pharmacist", not with the product.**

---

## 1. Site phase

Ideas that run on the current static Astro site without accounts or stored data. Ordered by priority.

### 1.1 Ask the pharmacist (Q&A) — priority 1

- **Form, no login:** a question, plus an optional email only if the visitor wants a private reply. No account is created. Same pattern as the existing contact forms.
- **Answering:** a Kondor pharmacist or specialist answers from the CMS. Scope is the product and how to take it, not diagnosis; the form says so, and answers never become personal medical advice.
- **Public Q&A page:** selected questions, anonymised, published with their answers. This page is the social destination: one question a week becomes a social card.
- **Open points:** who answers, within how many days (README open question 3, unanswered); the adverse-event process.
- *Replaces the earlier "5 questions for your doctor" idea (client direction 2026-11-16).*

### 1.2 Today's puzzle (sudoku as a social hook) — priority 2

- **Role:** an acquisition hook, not a feature of the product. Daily social posts bring people to the site; the puzzle keeps them coming back.
- **On the site (`/puzzle`):** one puzzle a day in easy (4×4 or 6×6), medium and hard; no sign-up; streak kept in the visitor's browser only; hints without penalty; no timer, no ranking. After solving: one sentence from the Memory health blog and its link — not a buy button. Not linked from the header or home; entry is from social and the newsletter.
- **Social loop:** daily post with 3–4 key cells blank ("full solve on the site"); story question "what number goes in the red cell?"; Friday hard puzzle; Sunday one-step technique video; "solve this one with your mum or dad".
- **What makes it Memowell's, not a newspaper's:** the calm puzzle (small grids, large type, no clock) designed for a slower mind; later, the two-player puzzle (one link, two phones, one grid, two generations) and the weekend puzzle with family photos instead of numbers — both need a small service or the app (phase 2).
- **Language:** "today's puzzle", "five minutes for your mind", "a small daily habit". Never "memory training" — Lumosity's FTC settlement is the precedent, and for a memory supplement the game claim and the product claim would fuse.
- **Evidence note:** number-puzzle use correlates with better cognitive scores in adults 50+ (PROTECT, n≈19,000, cross-sectional), but trials of brain games show little far transfer; the 2021 meta-analysis in older adults with impairment found none. So the puzzle is a hook and a habit, not a health claim.
- **Build:** puzzles pre-generated into a JSON file, rendered client-side. Expect return visits and blog clicks, not sales; the first months need ad budget or a partner page.

### 1.3 "A study in 60 seconds" (from the blog) — priority 3

- **Social:** short reels retelling one recent study in plain language, ending on an open question. **Site:** the matching note in a new blog category, **Research notes**, with the source and "what is still unknown".
- **Note format:** what they asked / who and how many / what they found / what it means for you / what is still unknown.
- **Rules:** systematic reviews, large trials and clinical guidelines only — no single small or animal study as a headline; no bridge to Memowell's effect; two notes a month, AI-drafted and reviewed by Kondor's scientific officer; FR and AR reviewed separately.
- **Prerequisite:** the blog's first eight articles exist only as titles and need to be written and approved first (BRIEF.md, Memory health).

### 1.4 Newsletter "one thing a week" — priority 4

- The blog is its core, not its whole: each week one article or research note, one pharmacist Q&A, the week's puzzle, and one small step (a food, a family activity). Sign-up on the site, consent-based, unsubscribe link (the privacy policy already allows it). Social gives the pieces; the newsletter gives the week in one place.

### 1.5 Start page with a QR code on the pack (`/start`) — priority: cheapest, build first when the client approves

- **What the visitor sees:** three doses (after breakfast, lunch, dinner) with default times 8:30 / 13:30 / 20:30, editable; two dates counted from today or a chosen start date — week 8 ("talk to your doctor about how it has been") and week 24 (end of the recommended course); one button, **Add to calendar**.
- **How it works:** the button builds an `.ics` file in the browser (three daily recurring events for 24 weeks plus two one-off events) and the phone's own calendar takes over the reminders. Nothing is sent to a server; no app; every phone has a calendar. A Google Calendar link sits beside it for Android (one event per link, so three links). Fixed line underneath: "This reminder does not replace your doctor's instructions or the leaflet in the pack."
- **Limits:** it is a reminder, not a log — "taken / later" needs the app (app MVP). Many 70+ users will not scan; the caregiver does, usually on the user's phone, so: one big button, one step, no form.
- **Build:** one new Astro page with content in the CMS, ~80 lines of JS, no library; EN/FR/AR including event titles; the reminder sentences added to the copy deck for scientific review (8 and 24 weeks are already on the site). About **3 days** in all: 1–2 days page and calendar, half a day testing (iOS Safari, Android Chrome, Samsung Internet, desktop), half a day content, a few hours QR and print asset.
- **Client to confirm:** the default times; the two reminder texts (proposed: "Memowell: eight weeks. Talk to your doctor about how it has been." / "Memowell: 24 weeks, the recommended course. Talk to your doctor about what comes next."); whether a QR on the box is allowed under natural-health-product packaging rules — fallback is the leaflet or a sticker.

### 1.6 Podcast (caregiver stories + expert conversations, on the site and YouTube)

- **Why it fits:** caregivers have time to listen (car, kitchen, evenings) more than to read; a pharmacist's or neurologist's calm voice builds the trust that text cannot; each episode yields 5–8 pieces for social, YouTube, the blog and the newsletter.
- **One programme, two formats in each episode:** a 3–5 minute **caregiver story** (one day, one problem, one small solution) opens the episode and its subject leads into a 20–30 minute **conversation with a professional** (pharmacist, neurologist, geriatric nurse, psychologist, dietitian). "This week: my mother wakes at night" → the caregiver tells it → the sleep specialist explains. Season 1: 8 episodes, one every two weeks.
- **Claims and consent:** the professional never discusses Memowell (a product endorsement by a clinician is advertising with professional endorsement — restricted for natural health products and dementia in Canada, and a problem for the guest's own regulator); the product appears only in a fixed 10-second sponsor line ("brought to you by Kondor Pharma, maker of Memowell"). Caregivers never speak about the product's effect (a testimonial is a claim under Part 5; cut in the edit). Written consent, right of withdrawal, anonymisation (no surname, no town) — the story concerns someone who may not be able to consent. Transcript reviewed by Kondor's scientific officer before release; every episode ends with the fixed "general information, not medical advice" line.
- **YouTube:** the conversations are recorded as video-podcast (two simple cameras); full episode on YouTube, audio on Spotify/Apple, both on the site. Captions in EN/FR/AR (recording is in one language). 3–5 Shorts per episode, reused as Reels. Caregiver stories on YouTube as audio over a still or a slow animation of the brand shapes — no faces, cheap to make.
- **On the site:** `/memory-health/podcast`, one page per episode: player, full transcript (accessibility, search, review), chapter list with timestamps, sources, link to the related article. The blog structure already does most of this; add audio/video fields to the CMS. Audio hosted on a podcast service (Transistor, Buzzsprout, ~USD 20/month) that also feeds Spotify and Apple; video from YouTube; the site only embeds. **Site effort: ~2 days.**
- **The real cost is production, not the site:** 1–2 days per conversation episode (guest, recording, edit, captions, clips), half a day per caregiver story; a fixed host (ideally Kondor's pharmacist or a warm health presenter), an editor, the scientific reviewer. Season 1 ≈ 12–16 production days plus review. A podcast that stops after three episodes is worse than none: have four episodes ready before the first goes out.
- **Simplest start:** three caregiver audio stories in the blog and on YouTube first — cheap, no expert guest, and they show whether the audience listens. If they do, start the conversations.

### 1.7 Later site ideas

- **Caregiver print pack:** the week plan, a brain-food menu, the generation-quiz cards (from the community campaign), puzzles. Paper suits the older audience better than an app.
- **Community question book:** "what did you wonder about memory this week?" on social; reviewed answers in the site FAQ. Needs moderation and scientific review — overlaps with 1.1.

---

## 2. Community and social

- **Caregiver group** with moderation and a professional present; a mentoring programme pairing new caregivers with experienced ones — preferably with a partner such as an Alzheimer society rather than built from scratch.
- **Periodic campaigns:** "the dish with a story" (family recipes with photos and voice; user-generated), "decade playlists", "generation quiz", a monthly family challenge with a shared goal and **no leaderboard** (ranking discourages someone whose memory is weaker).
- **"Try something new this week"** (photography, crafts, a new food) — newsletter and social, no app needed.
- **"The decade you grew up in":** decade playlists, period photos and music guessing by era on social; brings grandchildren in. Licensing makes music expensive in an app.

---

## 3. App (working title: Memowell Together)

Two roles (the person; the caregiver), large type, few notifications, no ranking and no "failure".

- **MVP:** three-dose reminders with "taken / later" and a dosing calendar; the 8-week count and the doctor-visit reminder; a morning and evening routine the user orders; a daily brain-food checklist inside the routine; the caregiver's daily note (events, repeated questions, the day's condition) with a PDF export for the doctor.
- **Phase 2:** the moments album (photo, voice or text each day; "this day last year" notification); games from the family's own photos (face–name matching, photo puzzles, "find the detail" in old photos — one module); the activities module (30-day programme with rising difficulty, a personal goal with milestones, a skill split into short sessions with a chosen next step, weekly review, a fixed-hour "your puzzle is ready" reminder that returns to where the user stopped — one module); saved walking routes with photos inside the album.
- **Phase 3:** the family circle (a shared dashboard — only with the person's own consent; monitoring without consent harms dignity and independence); the printed memory book via a print partner; in-app family challenges.

---

## 4. Set aside, and why

- **Pomodoro focus timer** — productivity register, not memory health; wrong audience.
- **20-second attention check twice a day** — reads as a diagnostic test, raises anxiety, too many notifications.
- **Monthly symptom check-in with a trend chart** — quasi-diagnostic; no replacement on the site.
- **8-week habit challenge** — dropped by the client (2026-11-16); it would also pair "8 weeks" with the product's effect.
- **Quick test → 30-day routine (lead magnet)** — dropped by the client (2026-11-16).
- **"5 questions for your doctor"** — replaced by Ask the pharmacist (1.1), client direction 2026-11-16.
- **Leaderboards anywhere** — see section 2.
- **Cognitive tests on the site (MMSE, NIH Toolbox DCCS, MoCA, MPOD)** — no self-administered version exists or is licensable for a commercial site (MoCA XpressO only by written agreement, link not embed); MPOD is an eye measurement, not a cognitive test. The only licensable exception is the PROMIS-10 quality-of-life questionnaire (HealthMeasures licence ~USD 750 / 3 years, legal review) — raised with the client as a decision, not planned. Full note in the feasibility PDF.
- **Doctor conversation sheet** and **"how memory is measured" guide** — dropped by the client (2026-11-16).

---

## 5. Decisions log

- **2026-11-16** — Matrix reviewed; ideas sorted into site / community / app. Sudoku first set aside, then kept as the social hook "Today's puzzle" after the designer's objection (good hook; "best game for memory" is not supported by evidence and is not said). "5 questions" replaced by Ask the pharmacist. 8-week challenge dropped. Start page with QR recorded with its effort estimate (~3 days). Self-test feasibility PDF produced for the client. Podcast (caregiver stories + expert conversations, site + YouTube) recorded with its claim and consent rules and a three-story pilot as the first step.
- **2026-11-16 (later)** — The mother-story frame and the "map of a day" idea (both designer-side proposals, not from the brand strategy) removed at the user's direction; the ideas stand on their own.
- **2026-11-16 (later)** — Quick test dropped; "the decade you grew up in" moved from the site list to community (its concept is social); the doctor conversation sheet and the measurement guide / PROMIS-10 rewritten as two distinct items after the client asked what exactly goes on the site.
- **2026-11-16 (later)** — Doctor conversation sheet, the measurement guide and the PROMIS-10 questionnaire removed from the site list; the tests question moved to the client approvals (tests need an administrator and a licence). Site list now seven ideas.
