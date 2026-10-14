# web-designer

For every website, landing page, UX copy, visual-system, or design-revision task in this repo, use the `bex-web-design` skill (`.claude/skills/bex-web-design/SKILL.md`) and follow its references before designing or building.

## Projects

- `memowell/` — Memowell® site for Kondor Pharma (Astro + Decap CMS). Start with `memowell/README.md` (handoff list) and `memowell/docs/design-brief.md` (design record). Approved copy is verbatim — run `npm run build && npm run check:content` after any content change.
- `nutrition-tracker/` — نخودچی, Persian nutrition & activity PWA (private MVP). Brief: `nutrition-tracker/docs/product-ux-brief.md` (§18 = current decisions). App: `nutrition-tracker/app/` — run `npm test && npm run build` after changes; `scripts/smoke.mjs` drives the full flow. Calculation rules (brief §9) and food values need clinical review before any public release.
