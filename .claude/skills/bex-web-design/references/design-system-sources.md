# Design-system and reusable-source evidence

Checked **2026-09-22** for version 1.7.0. These are first-party specifications, implementation documents, and asset/license pages, not evidence of conversion uplift. Access dates are not publication dates. The spacing starter scale, foundation contract, integration sequence, and quality gate are our synthesis adapted to cinematic marketing websites. No source establishes one spacing ratio, column count, icon size, material, or library for every business.

## Foundations used

| ID | Primary source | Narrow application and limits |
| --- | --- | --- |
| D1 | [Atlassian: Design tokens](https://atlassian.design/foundations/design-tokens) | Centralize repeatable decisions and semantic roles; Atlassian token names are examples, not mandatory project names. |
| D2 | [Atlassian: Spacing](https://atlassian.design/foundations/spacing) | Deliberate scale and spacing roles. Its 8px base includes fractional values; do not force all dimensions onto an 8px grid. |
| D3 | [Atlassian: Grid](https://atlassian.design/foundations/grid) | Align major content containers; local component spacing and floating overlays have different layout needs. App-specific defaults are not universal landing-page dimensions. |
| D4 | [Material 3: Layout overview](https://m3.material.io/foundations/layout/layout-overview/overview) | Read the rendered page in the browser after text retrieval returned little content. Consistent arrangement, hierarchy, adaptation, and bidirectionality. The page identifies May 2026 layout changes. Do not mechanically import app scaffold/navigation into a marketing site. |
| D5 | [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout) | Alignment, grouping, relative prominence, and adaptation. Public indexed text was readable; native platform dimensions and Liquid Glass are not imposed on web layouts. |
| D6 | [Atlassian: Iconography](https://atlassian.design/foundations/iconography) | Familiar metaphors, consistent visual treatment, and legibility. The system's 16px default and 1.5px stroke belong to Atlassian, not every website. Guidance does not itself license all assets. |
| D7 | [Salesforce: Tokens and styling hooks](https://developer.salesforce.com/docs/platform/aura-platform/guide/tokens-intro.html), [SLDS design tokens and migration](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-design-tokens) | Named reusable values and supported customization. Confirm SLDS version; old `--lwc-` design-token usage is not a universal SLDS 2 integration recipe. |
| D8 | [Google: Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) | Actual glyphs, optical size/weight/fill, SVG and font delivery, Apache 2.0. Verify axes and package/version details at implementation; avoid unneeded full-family downloads. |
| D9 | [Lucide: Accessibility](https://lucide.dev/how-to/accessibility), [React usage](https://lucide.dev/guide/react), [license](https://lucide.dev/license) | Import actual icons; label meaningful controls and avoid duplicate decoration announcements. License page includes ISC and Feather-derived MIT notices. |
| D10 | [Phosphor core](https://github.com/phosphor-icons/core), [license](https://github.com/phosphor-icons/core/blob/main/LICENSE) | Alternative actual icon assets; core license is MIT. A family's existence does not prove it fits the current brand. |
| D11 | [Atlassian: Elevation](https://atlassian.design/foundations/elevation) | Coordinate surfaces and shadows, use layering intentionally, and check dark-theme separation. Do not copy product-specific z-index numbers as a universal stack. |
| D12 | [Apple HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Foreground/background distinction and legibility. Public indexed guidance was read. Apple's native materials, icons, and design resources are not assumed to have an unrestricted web reuse license. |

## Implementations and kits

| ID | Source | What is actually reusable / boundary |
| --- | --- | --- |
| R1 | [shadcn/ui documentation](https://ui.shadcn.com/docs), [core license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) | Open component source and distribution approach; core MIT. Verify each external registry item independently. A design default is not the final brand direction. |
| R2 | [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction), [license](https://github.com/radix-ui/primitives/blob/main/LICENSE) | Unstyled React behavior primitives and focus/keyboard handling; MIT. Integration still needs correct labels, content, theming, and actual inspection. |
| R3 | [MUI Material UI overview](https://mui.com/material-ui/getting-started/), [core license](https://github.com/mui/material-ui/blob/master/LICENSE) | React implementation with theming, core MIT. At review, docs explicitly describe Material Design 2 support; do not claim complete M3 support. Paid templates and other products are not covered by a blanket core-license assumption. |
| R4 | [Material Web repository](https://github.com/material-components/material-web) | `@material/web` implements M3 using web components, Apache 2.0. README says maintenance mode pending new maintainers at review. Recheck before new adoption; no default migration. |
| R5 | [User-supplied TapTap Design System kit](https://www.figma.com/community/file/1044528985624992085/taptap-design-systemdevelopers) | Public community description read in the browser: components, examples, design guidance; CC BY 4.0 declared. Node-level internals were not inspected, no kit was installed, and no accompanying production-code package was verified. This is not the official M3 kit. |
| R6 | [Official M3 kit linked by Material](https://www.figma.com/community/file/1035203688168086460) | Discovered from the rendered Material homepage. Link identity verified there; kit contents and license were not independently audited in this review. Treat as a candidate design resource, not already installed code. |

License names here report publisher pages, not a blanket assessment of all versions, dependencies, logos, fonts, paid blocks, or derivative assets. At reuse, retain the notices/attribution applicable to the selected material. Do not require an extra approval just to use a compatible open-source dependency within an authorized build; respect actual tool permissions and any explicitly requested library.

## User-supplied entry points and access limits

- [Material 3](https://m3.material.io/) was read through the browser, including the rendered layout overview; the text-only fetch initially returned an empty shell. No claim to have read every component spec or all interactive states.
- [Designsystems.surf: Apple](https://designsystems.surf/design-systems/apple), [Atlassian](https://designsystems.surf/design-systems/atlassian), and [Salesforce](https://designsystems.surf/design-systems/salesforce) were used as directories to locate original publishers. Their summaries are not the authority for technical or reuse rules.
- The malformed combined input was interpreted as two links: [Material Tailwind's Bootstrap vs Material UI comparison](https://www.material-tailwind.com/blog/bootstrap-vs-material-ui) and the Apple directory above. The comparison describes frameworks; it does not supply a spacing system or justify installing either framework. Technical selection uses original documentation instead.
- The supplied [Salesforce visual-design URL](https://www.lightningdesignsystem.com/2e1ef8501/p/89a17e-visual-design) displayed the SLDS 2 home article in the browser. The live navigation exposes [Visual Language](https://www.lightningdesignsystem.com/2e1ef8501/p/67a7b2-visual-language). Do not claim the old page's original text was retrieved; developer documentation supplies the implementation evidence above.

The extension preserves the seven-step AI production scope: user-supplied business/audience research, embedded artifact quality checks, and delivery. It introduces no user study, analytics, A/B experiment, or business outcome measurement stage. Structure/link checks on this skill do not prove improved website quality; report observed rendering evidence separately when a website is actually built or repaired.
