# Reinvent Table Component

## Summary

The new `Table` component will replace all legacy table components in Ring UI and will be used in TeamCity and YouTrack. It should provide a rich feature set and enough customization to cover our use cases.

## Motivation

The main Ring UI clients, TeamCity and YouTrack, rely heavily on tables. The table components currently available in Ring UI do not provide enough out-of-the-box functionality, so clients either build custom tables or implement heavy customization logic.

A new, powerful table component in Ring UI will reduce that burden and help provide a consistent table experience across applications.

## Goals

- Provide a modern table component with core features such as row selection, sorting, and column reordering.
- Support client-specific use cases such as row expansion and row reordering.

## Non-goals

- Implement features that are not required by current clients (for example, filtering).

## Requirements

The current design is available in [this Figma file](https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=11508-8730&p=f&m=dev).

### Column Controls Discoverability

Column interactions, such as column reordering, must be discoverable on both desktop and mobile devices.

- On desktop (where hover is available), a drag-and-drop handle must be shown on hover.
- On mobile (where hover is unavailable), there will be a gear button in the top-right corner, which will reveal the drag-and-drop handles for columns. However, column reordering must also be available without tapping the gear button. Showing the gear button must be configurable.

### Row Expansion

Nested rows are displayed by adding padding to the left of a column content. Which column receives the padding should be configurable, with a reasonable default such as the first semantic column, that is, the first column which is not a control or an icon.

### Breaking Changes

Breaking changes are allowed in both scenarios: when a client needs to keep using a legacy table and when the client migrates to the new one. However, where possible, the API should stay compatible with, or at least similar to, the previous one.

### Feature Parity with Legacy Tables

The new table should preserve all features currently used by clients. Below is a list of key client usages that showcases the required feature set:

1. [YouTrack Issues Table](https://github.com/JetBrains/youtrack/blob/7744317061c3c38a8dd32d8e72873cc79d973c38/frontend/simplified/src/pages/ticket-list/common/ticket-list-content-view/table-view/table-view.tsx#L243)
2. [YouTrack Apps Table](https://github.com/JetBrains/youtrack/blob/91870e3712aa00b8a2dbd0373a0c5d73d025fb67/frontend/simplified/src/pages/admin/apps/components/apps-table/table.tsx#L68)
3. [YouTrack People Table](https://github.com/JetBrains/youtrack/blob/7218885eef19b0ad6554540680d7abb97a06f4be/frontend/simplified/src/pages/project/people/components/people-table.tsx#L56)
4. [TeamCity Build List](https://github.com/JetBrains/TeamCity/blob/master/react-ui/src/components/common/Builds/Builds.module.css). Note: it's a grid, and it should migrate to the table.

This list is not necessarily final. The required features will be clarified during development and the early access phase.

### Custom Layouts

We may support custom layouts (grid or flex) for rows, cells, headers, or the entire table by providing custom renderers. Whether this is needed is still to be clarified.

### Accessibility

Clients are committed to full accessibility, which means the new table must comply with all relevant accessibility expectations from the very beginning. Additionally, for expandable rows, we should consider implementing the [TreeGrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/).

### Performance

The table should handle thousands of rows without issues, so rows must be virtualized from the very beginning. Column virtualization is not required.

## Proposed Design

### API Design

```typescript
// WIP
```

### Legacy Table Migration

We currently have four table components in the `src/table` folder:

- `Table` in `table.tsx`
- `Simple Table` in `simple-table.tsx`
- `Multitable` in `multitable.tsx`
- `Smart Table` in `smart-table.tsx`

The current `src/table` folder will be renamed to `src/legacy-table`. This is a breaking change. To keep using legacy tables, users will need to update imports to `... from '@jetbrains/ring-ui-built/components/legacy-table/...'`.

Storybook stories will also be regrouped.

Current structure:

- Components
  - Table
    - basic (Table)
    - multi table
    - ...
  - Simple Table
    - basic
    - ...

New structure:

- Components
  - Legacy Table
    - Table
      - basic (Table)
      - multi table
      - ...
    - Simple Table
      - basic
      - ...

The new table will be placed in `src/table` and exposed in the `Table` section in Storybook. In other words, it will replace old tables in both import structure and Storybook presentation.

### Code Reuse Strategy

During development, we should reuse existing logic where possible by extracting shared routines and hooks rather than copying code. This may require converting some legacy table code to functional components.

If extraction is too expensive for specific areas, code copying is acceptable as a last resort.

The new `Table` must not directly depend on legacy components (for example, by extending or wrapping them). Reusable parts should be extracted into shared utilities.

### Third-Party Libraries

The proposed libraries are:

- [TanStack Table (headless)](https://github.com/tanstack/table)
- [@dnd-kit/core](https://dndkit.com/) for column reordering, as [suggested in TanStack documentation](https://tanstack.com/table/latest/docs/guide/column-ordering#drag-and-drop-column-reordering-suggestions-react)

We may switch to an in-house implementation if these libraries require too much customization or have an unacceptable bundle-size impact.

## Branch, Versioning, and Early Access

Development will happen in a feature branch named `RG-2542-reinvent-table`, where the `version` in `package.json` will be set to `8.0.0-beta.0`. We will periodically publish work-in-progress versions from this branch using the TeamCity `Publish@next` configuration, which automatically increments the last version segment (for example, `8.0.0-beta.0` -> `8.0.0-beta.1`). As a result, early-access builds will be available on `npm` as `8.0.0-beta.x`. Clients are encouraged to try the new table and provide feedback during this phase.

The change is expected to be merged into `master` only when the full feature set is implemented and the component is production-ready. Partial implementations are not expected to be merged.

Before the merge, the version will be manually set to `8.0.0` so that the next `Publish@current` will publish the `8.0.1` version from `master`. Clients will need to update dependencies to `8.0.1` and may need to update table usage sites.
