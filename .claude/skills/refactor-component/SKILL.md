---
name: refactor-component
description: Refactor React Class Components to TypeScript Functional Components following Ring UI standards. Converts component, updates stories to CSF3, adds tests, and creates MDX documentation.
example: refactor-component src/components/Button/Button.tsx
---

# Refactor React Component

This skill guides you through refactoring React Class Components to TypeScript Functional Components following Ring UI's established standards.

## When to Use
Use this skill when:
- Converting a Class Component to a Functional Component
- Modernizing component structure
- A user requests: "refactor [component]" or mentions following guidelines

## Refactoring Standards

**Component Structure**
- Zero-diff: preserve API, behavior, DOM, CSS, and a11y exactly - no visual or runtime regressions.
- Convert Class → Function (`const` arrow function)
- Use `forwardRef` only if the original supported `ref`
- Do not use `React.memo` — React 19’s Compiler automatically handles component memoization.
- Avoid manual `useMemo` or `useCallback` unless performance testing reveals regressions.
- Move `defaultProps` to parameter defaults
- Extract pure helpers to name-of-the-component.utils.ts
- Keep CSS Modules and `@value` imports unchanged
- Keep the same export style (`default export` if it was default)

**TypeScript**
- Preserve `| null | undefined` unions (for JS consumers)
- Export interface as `ComponentNameProps`

**Stories**
- Use CSF3 format with `Meta<typeof Component>` and `StoryObj` types
- Add concise `argTypes` and descriptions
- Include `parameters.docs` with `importSubpath` and `exportName`
- Create stories for key states
- Follow ESLint `jsx-no-literals` (wrap strings in `{'text'}`)

**Documentation**
- Create a concise MDX file following the shared template:
  - Meta, Title, Description, Primary, Import, Props (### header)
- Focus on purpose and usage, not implementation
- Base new docs on the shared template: [storybook/template/template.mdx](./../../../.storybook/template/template.mdx)

**Testing**
- Write Jest + RTL tests
- Test behavior, not implementation
- Cover: basic rendering, prop variations, and edge cases
- Follow existing Ring UI testing conventions

## Workflow

1. **Analyze** — review refs, defaults, and helper logic
2. **Refactor** — convert class to const arrow function
3. **Adjust defaults** — move `defaultProps` and extract helpers
4. **Update stories** — migrate to CSF3 and ensure proper controls
5. **Test** — add/update tests for behavior and a11y
6. **Document** — create or update concise MDX docs
7. **Validate** — ensure zero-diff behavior and polish descriptions
8. **Track migration** — add component name to `migrated-components.json`

### Step 8 Details: Track Migration

After completing the refactoring, update the migration tracker:
- Read `migrated-components.json`
- Add the component name to the array (if not already present)
- Sort the array alphabetically
- Write back to the file

## Refactored examples
- `src/markdown/`
- `src/breadcrumbs/`
- `src/progress-bar/`

## Tips
- Always read the component first to understand it
- Ask for clarification if requirements are unclear
- Use TodoWrite to track progress on multi-step refactorings
- Reference example components when uncertain
- Keep changes minimal - only what's required by the standards
