# UX copywriting for sections and interactions

Read when drafting/revising page content, headings, benefits, CTA labels, form copy, or state messages. For a narrow edit, apply only relevant checks and preserve unrelated text and design. Use [landing architecture](landing-architecture.md) for section selection; source IDs resolve in [research sources](research-sources.md).

## Separate persuasion from task guidance

Brand/marketing copy communicates relevance, meaning, differentiation, and credible value. UX microcopy helps someone choose, act, understand a state, or recover. Both use the brand's voice, but controls and errors must be precise rather than poetic. Plain language is not a requirement to erase personality from editorial headlines. [C1, C2]

Read the relevant findings in the [Brand, UX and Creative Design Brief](brand-document-synthesis.md). Use supplied brand/audience documents to shape vocabulary, voice, visitor questions, message hierarchy, and storytelling; trace important choices to their source or label them as authored interpretation. Develop the value proposition across the page through distinct useful messages and actual evidence. Preserve an approved slogan where used without making every section repeat it.

Extract a small voice contract from approved material: audience vocabulary, degree of formality, emotional character, and terms used consistently. State provisional defaults briefly when no voice is supplied. Adapt tone to context: expressive in a story, direct around price, calm in an error. Do not import a government or English-language brand voice wholesale into Persian brand work.

Keep exact approved slogans, names, testimonials, pricing and policy wording unchanged unless the user authorizes rewriting them. Add a plain explanatory line when an approved slogan does not explain the offer. If exact copy conflicts with supplied facts or behavior, flag the conflict and propose the smallest authorized correction; do not silently publish a misleading claim or replace protected text.

## Write each section to do a job

For each selected section identify **visitor question -> one main message -> supporting detail/evidence -> next step if needed**. Write final usable copy when full copy/page delivery is requested, not only a list of section labels. For a direction-only request, representative copy and named gaps may suffice. Do not add a button to every section or repeat the hero slogan everywhere.

| Section role | Copy should establish | Common failure to catch |
| --- | --- | --- |
| Opening | What the offer is, for whom, its meaningful value, and what the primary action does; pair with representative media | A poetic promise or “innovative solutions” without saying what is offered |
| Benefits / capabilities | A relevant benefit supported by the real mechanism, feature, or demonstration | Feature lists with no use context; quantified savings or guaranteed outcomes inferred from a feature |
| Product / plans / packages | Actual inclusions, differences, units, billing period, price and material conditions where known | Ambiguous units, confusing plans, hidden recurring charges, unsupported “free” |
| Process / how it works | User actions, provider responsibilities, prerequisites and known next steps | Vague “easy/fast” claims instead of explaining what happens |
| Proof / case study | Who/what the evidence concerns, its context, actual result, and scope | Anonymous invented quotes, client logos without authorization, decorative counters |
| About / expertise | Why this team's experience or method matters to the visitor | Long inward-looking biography unrelated to choosing the offer |
| Questions / objections | A direct answer first, followed by important qualifications or a real detail link | FAQ that repeats sales copy or becomes the only source of key costs/conditions |
| Final action | Concise recap of the value, actual next step and remaining commitment | Introducing a new offer, manufactured urgency, or repeating the entire page |

Front-load useful meaning in headings and paragraphs; group related details and remove duplication. Let a headings-only read explain the path. Benefits must be proportionate to evidence: a capability can support a qualitative explanation, not an invented statistic. Avoid arbitrary word/character quotas, keyword stuffing, and templated “premium/seamless/revolutionary” language that supplies no information. [C1, L8]

## Claims, gaps, and commitments

Separate supplied fact, approved claim, design inference, and missing evidence in the project record. Do not generate prices, ratings, testimonials, certifications, scarcity, response deadlines, privacy assurances, guarantees, or “no credit card” conditions. Preserve qualifiers and the source scope when paraphrasing evidence. A persuasive tone does not authorize fear, guilt, false urgency, or hiding a material condition.

Use internal gap markers in an explicitly unfinished draft, outside publishable copy where possible; do not release placeholder claims or present missing fields as final content. Omit unsupported optional claims, offer truthful process/product evidence if available, and ask for missing facts only when they affect completion. “Secure,” “free,” “cancel anytime,” and “we never share your data” are factual commitments, not filler reassurance.

Do not turn the evidence ledger into public sales copy: an absent optional testimonial does not require a section announcing that no customers exist. Disclose actual material product limitations and missing qualifications when they affect fit or procurement; keep unrelated editorial gaps in the handoff. An honest page neither invents reassuring proof nor mechanically publishes every internal uncertainty.

## Public content and internal production notes

Write for the site's visitor. Keep two explicit roles in the working content/asset record: **publishable content** and **internal production information**. Asset origin, generation prompts/tools, reference links, design reasoning, uncertainties, and implementation notes stay internal by default. They do not become public copy merely because they are true. Approved brand copy and useful newly authored visitor copy remain valid; this is not a requirement to seek approval for every sentence.

For each caption, eyebrow, badge, helper line, or image-adjacent label, identify its purpose: answer a visitor question, express a deliberate brand message, explain an action, supply required attribution, or correct a material misunderstanding. If its only purpose is to explain how the agent made the page, omit it from the public interface and keep any useful record in the handoff. Do not fill empty space under an image with process commentary.

| Context | Correct treatment |
| --- | --- |
| Generated atmospheric hero image with no claim that it depicts an actual listing, delivered project, or identifiable place | No automatic “AI-generated,” “concept image,” «تصویر مفهومی», or “inspired by…” production caption; preserve origin in the internal asset record. Check surrounding copy and placement for implied factual claims. |
| Render used to show a proposed building or a specific product that could be mistaken for an existing one | Use verified real imagery, change the presentation so it does not imply false evidence, or retain a concise material clarification where needed. Removing a caption alone does not fix a misleading presentation. |
| Photographer/asset attribution required by the selected license, or a relevant disclosure requirement established for the project | Retain the required information in an appropriate compliant location; a cleaner composition is not a reason to suppress it. |
| Deliberate approved editorial caption or brand line, including wording about inspiration | Keep it when it belongs to the public message. The phrases above are context examples, not a global word blacklist. |
| Requested concept presentation or moodboard | Explain design choices in that deliverable; do not automatically carry its annotations into the implemented marketing site. |

Keep production metadata separate from content fields: an asset's source, generation method, internal description, filename, or design notes must not automatically populate its public caption, title, or tooltip. Make captions optional; no fallback from a missing caption to the source record. Decorative imagery can have empty alternative text where appropriate; informative imagery needs a useful description of its content/purpose. Do not move removed production notes into `alt`, `aria-label`, visually hidden text, metadata, or structured data to conceal them. Necessary accessible descriptions and material qualifications remain part of the public experience.

When correcting this failure, inspect the affected component and the shared caption/content mapping that produced it. Remove the unintended output at its source, rather than hiding it with CSS. Review other instances of that same mapping within scope; preserve the surrounding approved image, copy, layout, motion, and any genuinely required attribution or clarification.

## Action labels and microcopy

Choose labels from the actual next operation or destination, not the eventual commercial goal. A link that only opens options should not imply a paid order or confirmed reservation. One campaign can repeat its primary action; supporting links have distinct descriptive names. Use natural language grammar rather than mechanically forcing English verb-first ordering. [C2]

Examples are conditional patterns, not default promises:

| Observed destination/behavior | Suitable Persian label/message | Misleading alternative |
| --- | --- | --- |
| Scroll to a product list | «دیدن قهوه‌ها» | «ثبت سفارش» when no order is created |
| Open service-plan comparison | «مقایسهٔ پلن‌ها» | «شروع رایگان» when free access is unverified |
| Send an inquiry, not reserve time | «ارسال درخواست مشاوره» | «رزرو قطعی جلسه» |
| Confirmed receipt of that inquiry | «درخواست شما دریافت شد.» plus a known next step | «جلسهٔ شما رزرو شد» or an invented callback deadline |

Place a short helper note beside an action when cost, eligibility, data use, or the next step may be misunderstood. Use verified policy and actual workflow; do not invent reassuring text. For a prototype with no submission service, make its demo nature clear before commitment and in feedback; do not claim data was sent, stored, paid, or reserved.

For forms and interactive states that actually exist in scope:

- **Before input:** persistent descriptive labels, required/optional status, and necessary format/eligibility hints. A placeholder is not the sole label; avoid asking for data without a task need. [C5]
- **Validation error:** name the problem and an actionable correction using the field's visible name; do not blame the person or show only an error code. Example for a required email: «ایمیل را وارد کنید.» For invalid syntax: «یک ایمیل با قالب name@example.com وارد کنید.» Match the actual validation rule. [C3]
- **System failure:** distinguish a correct input from a network/service failure; do not demand changes to valid input. Preserve entered data where the implementation supports it. State what is known, not an unverified diagnosis. Use the visitor's task vocabulary rather than exposing “API,” “service,” or internal system components unless the audience needs that detail.
- **Pending:** describe the real operation while it runs. **Success:** confirm only the completed operation and supported next steps. **Uncertain result:** do not assert success or definite non-submission; for potentially paid/duplicate actions, direct the user to a safe status check rather than blindly retrying. [C4]
- **Unavailable/empty:** explain the state and provide a real alternative where one exists; no invented availability or delivery promise.

In implementation, associate errors/hints with fields and expose meaningful status notifications to assistive technology. Copy text alone cannot certify accessibility or whether a backend operation succeeded. [C4, C5]

## Persian and responsive editing

Use fluent Persian rather than literal English calques. Keep address/formality consistent; check نیم‌فاصله, punctuation, Persian letter forms, and readable mixed-script snippets. Match currency, units, dates, timezone and numerals to supplied facts and audience; do not infer locale from language alone. Preserve identifiers, brand spellings, email addresses, and approved wording.

Write with the actual layout: verify heading wraps, button widths, mobile reading order, and expanded error states when implementing. Do not truncate critical copy, remove qualifiers, shrink body text, or break Persian joining merely to fit a cinematic composition. Adapt layout and pacing around the information. Essential copy remains available without animation. Use the [UX/UI reference](ux-ui-design.md) for RTL and accessibility implementation.

## Copy-quality gate

Review the deliverable, not merely the existence of headings:

1. A reader can identify the offer and each section's distinct useful message; titles alone outline the journey.
2. Claims, terms, numbers, and proof are traceable; exact approved copy and important qualifications are preserved.
3. Labels predict the actual next step; hints and outcome messages match known behavior and uncertainty.
4. Wording is specific, concise without losing meaning, coherent with the brand voice, and natural in its actual language.
5. Public text, captions, accessible names, and content metadata contain intended visitor content; production/source notes and draft markers have not leaked into them. Keep required attribution and material clarifications.
6. No required answer is replaced by a slogan, hidden only in motion, or omitted to fit the design. In builds, inspect the real responsive and relevant form states; in copy-only work, report rendering/runtime checks as unverified.

Revise observed failures within the user's scope. A heuristic copy pass is not proof of comprehension, conversion uplift, accessibility conformance, or user approval; those require their own evidence.
