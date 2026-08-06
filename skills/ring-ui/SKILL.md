---
name: ring-ui
description: Use when implementing, laying out, theming, validating, or troubleshooting React interfaces that use @jetbrains/ring-ui-built.
---

# Ring UI

Use Ring UI for controls, surfaces, and design tokens. Let semantic HTML and native CSS Flexbox/Grid own page structure and geometry.

## When to use

Use this skill for React pages, settings forms, dialogs, navigation, responsive composition, themes, loading/empty/error states, or accessibility work in a project that uses or is being set up to use `@jetbrains/ring-ui-built`.

Do not use it for non-React interfaces, projects that neither use nor are being set up to use Ring UI, or product-specific YouTrack infrastructure. Do not introduce Ring UI merely to solve generic page layout.

## Workflow

1. Before initializing or laying out an application, read [references/page-layouts.md](references/page-layouts.md) and follow its app setup, even if `@jetbrains/ring-ui-built` is not installed yet.
2. If the package is installed, inspect `package.json` and the lockfile for its exact version. Read its `README.md` and relevant `.d.ts` files before choosing imports or props.
3. Import components only from `@jetbrains/ring-ui-built`. Compose Ring controls and surfaces inside semantic landmarks, and use native CSS Flexbox/Grid for page geometry and CSS media/container queries for responsiveness.
4. Use `--ring-*` tokens for colors, typography, borders, and spacing based on `--ring-unit`. Do not copy their resolved values.
5. Model form draft, saved, validation, submission, and result state explicitly. Distinguish blocking loading, local loading, background work, first-use empty, filtered empty, success, warning, and retryable failure.

## Preferred patterns

- Use one semantic `h1`, clear landmarks, native anchors for navigation, and native/Ring buttons for actions. Do not make clickable `div` elements.
- Prefer `Input`'s own `label`. Give externally labelled controls stable IDs and connect `htmlFor`, `aria-describedby`, and errors explicitly.
- Keep `Select` controlled and explicitly generic: use `Select<T>` with `SelectItem<T>[]` data, selected item, and `onChange` argument—never `Select<SelectItem<T>>` or guessed primitive values.
- Wrap error `Banner` content in `role="alert"`, non-urgent status/success content in `role="status"`, blocking `LoaderScreen` content in a named status region, and local `LoaderInline` content in a named status region. Avoid announcing background work that does not affect the user.
- Use CSS Modules. Put `min-width: 0` on shrinking grid/flex children, `min-height: 0` where vertical flex children scroll, and assign each axis to one explicit scroll owner.
- Use CSS media queries for page-wide geometry and container queries for reusable components. Branch in React only when interaction or content structure must change.
- Never style Ring UI internal classes or `data-test` attributes. Treat test hooks as behavior selectors, not CSS APIs.

Do not add new uses of Ring UI's deprecated `Grid`/`Row`/`Col` or `ContentLayout`. Do not copy product-specific YouTrack wrappers such as `ButtonLegacy` or `IconLegacy`, page shells, portals, sticky stacks, form wrappers, or alert services into package consumers.

## Common tasks

- App setup, page shells, responsive navigation, sticky regions, and scroll ownership: read [references/page-layouts.md](references/page-layouts.md).
- Forms, validation, dirty state, async saving, and page feedback: read [references/forms-and-feedback.md](references/forms-and-feedback.md).

## Validation

Run the consuming repository's type-check, focused tests, lint, and production build equivalents. Interactively check near `1280x800` and `390x844`: accessible names and keyboard order, every state transition and action, page and popup overflow, heading hierarchy, theme behavior, and the browser console.
