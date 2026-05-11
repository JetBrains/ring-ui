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

### Discoverability

Table interactions must be discoverable on both desktop and mobile devices. For example, for column reordering:

- On desktop (where hover is available), show a drag-and-drop handle on hover and change the column header background.
- On mobile (where hover is unavailable), show the drag-and-drop handle on tap.

### Feature Parity with Legacy Tables

The new table should preserve all features currently used by our clients. The exact required set will be finalized with input from the clients.

This initiative may introduce breaking changes, but clients must not lose functionality.

## Proposed Design

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

### Reuse Strategy

During development, we should reuse existing logic where possible by extracting shared routines and hooks rather than copying code. This may require converting some legacy table code to functional components.

If extraction is too expensive for specific areas, code copying is acceptable as a last resort.

The new `Table` must not directly depend on legacy components (for example, by extending or wrapping them). Reusable parts should be extracted into shared utilities.

### Third-Party Libraries

The proposed libraries are:

- [TanStack Table (headless)](https://github.com/tanstack/table)
- [@dnd-kit/core](https://dndkit.com/) for column reordering, as [suggested in TanStack documentation](https://tanstack.com/table/latest/docs/guide/column-ordering#drag-and-drop-column-reordering-suggestions-react)

We may switch to an in-house implementation if these libraries require too much customization or have an unacceptable bundle-size impact.

## Migration, Versioning, and Early Access

Development will happen in a separate branch with version `8.0.0-beta.0`. Publishing will use the TeamCity `Publish@next` configuration, which automatically increments the last version segment (for example, `8.0.0-beta.0` -> `8.0.0-beta.1`).

The change is expected to be merged into `master` only when the full feature set is implemented and the component is production-ready. Partial implementations are not expected to be merged.

Before the merge, the version will be manually set to `8.0.1`. Clients will need to update dependencies to `^8.0.1` and may need to update table usage sites.
