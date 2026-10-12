# Reuse components, icons, and design assets

Use real compatible source components and assets when they improve consistency or avoid rebuilding established behavior. Reuse the existing project first. A reference link alone does not make a component available to the implementation. This is part of direction selection and construction, not a new production phase.

## Distinguish what a source supplies

- **Design guidance:** principles and specifications, such as Material, Apple HIG, or Atlassian foundations. Apply relevant principles without importing a platform's entire visual identity.
- **Figma kit:** design assets, component variants, and constraints. Inspect the accessible file before claiming exact token extraction; a public preview does not expose every node. A design component is not automatically working HTML/React or a connected production integration.
- **Code library or open-code registry:** actual runtime primitives/components. Use its supported framework, version, and theming/customization APIs.
- **Icon/illustration library:** actual SVGs, components, or images. Keep an appropriate family and preserve the license/attribution that applies to the selected assets.

## Selection and integration sequence

1. **Inspect the project:** stack and package versions, existing component/icon families, theme tokens, wrappers, accepted styles, and rendering constraints. Do not switch frameworks or add a second whole UI system for a minor gap.
2. **List only needed roles:** for example button, field, navigation, dialog, accordion, and a small icon set. Native semantic elements are often enough for a simple static page; richer primitives help with complex behavior.
3. **Choose a compatible source:** match required behavior, customization freedom, RTL, keyboard/focus, SSR/client boundaries where relevant, maintenance, and delivery cost. Check current first-party docs and the selected package/file license. Public availability or "free" is not equivalent to permission to copy every asset or paid block.
4. **Bring in the actual implementation:** install through the project's package manager or add inspected source files as the library intends. Include only necessary components/dependencies, use the lockfile or a concrete source revision, and preserve required notices. Check registry changes before allowing a generator to overwrite local files. Never claim a library is in use if the page only imitates its appearance.
5. **Map it to the project system:** adapt color, spacing, typography, radius, shadow, size, and states through theme tokens, supported props, or local variants. Keep one coherent primitive layer. Preserve semantic markup, keyboard behavior, focus management, and labels during visual customization.
6. **Inspect the integrated result:** check the actual imports, representative states, icon rendering, responsive/RTL behavior, and the [foundation quality gate](layout-and-visual-foundations.md#foundation-quality-gate). Fix causes in shared tokens/primitives instead of accumulating local overrides.

If a source cannot be accessed, use a compatible already-available or verified alternative and state a material substitution. Do not fabricate an import, license, or exact component match. Unknown access to one optional library need not block the whole site. A user-mandated exact library is a constraint to resolve, not permission to silently substitute it.

## Practical starting choices

These are a shortlist checked **2026-09-22**, not automatic dependencies. Recheck maintenance, version compatibility, and licensing when selecting a package. Sources and evidence limits are in [design-system sources](design-system-sources.md).

| Need | Candidate and application | Boundary |
| --- | --- | --- |
| Custom React brand site | **shadcn/ui** source components, themed to the project, or **Radix Primitives** for unstyled behavior | Core sources are MIT. Use the chosen source's actual dependencies; do not assume every registry uses the same primitive engine. Default styling is not the final bex-web-design art direction. [R1, R2] |
| Existing React Material interface | **MUI Material UI** and its theme/component variants | Core is MIT; paid products/templates have separate terms. The docs reviewed describe Material Design 2 support, not complete M3 parity. Do not add MUI just for a few icons. [R3] |
| Framework-light/static site | Native HTML/CSS and compatible SVG icons; add a suitable primitive only for a concrete behavior gap | Do not introduce React solely to use a button. Preserve existing stack and no-JS baseline goals. |
| Explicit Material 3 web-components requirement | **@material/web**, after checking project compatibility and current maintenance status | Repository reports maintenance mode pending new maintainers at review. It is not the universal default for new sites. [R4] |
| General interface icon family | **Lucide**, **Phosphor**, or **Material Symbols**, selected for fit | Choose one main family. Lucide has ISC plus notices for Feather-derived icons; Phosphor core is MIT; Material Symbols is Apache 2.0. Preserve the actual package notices. [D8-D10] |
| Salesforce environment | Existing **SLDS** components and supported styling hooks | Use platform/version documentation; do not copy old SLDS 1 token syntax into SLDS 2 blindly. Check asset-specific terms. [D7] |
| Design exploration in Figma | An appropriate verified kit, including the user's **TapTap Design System** | Its community page declares CC BY 4.0. Inspect components when accessible, adapt to the brief, and follow attribution conditions for reused material. It is not a code library. [R5] |

For a custom cinematic marketing site, the practical default is **an existing or compatible lightweight component base + one icon family + brand-specific tokens and composition**. Native elements remain valid when they cover the need. Motion scenes, narrative layout, product staging, and art direction still require project-specific design; an imported dashboard template does not satisfy the brief.

## Other elements and assets

Reuse illustrations, patterns, meshes, textures, and decorative SVGs when the source permits the intended use and their style supports the direction. Inspect the actual file, not only the search thumbnail. Keep a compatible palette, perspective, visual weight, and material treatment. Logos, stock imagery, fonts, and paid packs may have terms different from the surrounding component code. Do not use a decorative asset as evidence of a product feature or invent an exact product rendering.

For supplied design references, extract only observed relationships. Do not describe an entire kit as audited after reading its landing page. No login, purchase, publication, or messaging is authorized just because a source suggests it.

## Keep a minimal source record

Record only reused items in the internal project record or handoff. Keep this ledger outside public/static deployment directories and visitor content models; it is not a caption source. Preserve any notices or public attribution the actual license requires in the appropriate place. See the [public-content boundary](ux-copywriting.md#public-content-and-internal-production-notes).

A compact internal record can use:

```text
Role / component or asset:
Actual package and version, source revision, or file URL:
License / notices or attribution retained:
Local import or asset path / themed variant:
Material adaptation / observed integration limits:
```

Keep this record proportional. Do not install a catalog of every possible library in the skill, duplicate large third-party source trees, or force a library migration on an unrelated edit. The skill stores selection and integration guidance; dependencies belong to the website project that actually uses them.
