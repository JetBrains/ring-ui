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

Clients are committed to full accessibility, which means the new table must comply with all relevant accessibility expectations from the very beginning.

#### Treegrid Pattern

For expandable rows, we should consider implementing the [Treegrid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/).

#### Focus for Controls and Rows

Currently, the table has two types of focus:

- The real, native focus, which navigates by Tab between active elements, such as links and inputs.
- The "row focus", where you navigate between rows using up/down arrow keys, which works in parallel with native focus. It is displayed similarly to hover. From the browser's perspective, it is not a real focus, just a visual state.

At any moment, a user may have two "focuses" at the same time: a real (native) focus on some control and a row focus somewhere else.

We are reimplementing this behavior in an accessible manner so there is only one focus at a time. We use the ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex) technique:

- Initially, all rows are not focusable (`tabindex="-1"`), and the user navigates between controls by Tab.
- When the user presses up/down arrow keys, the prev/next row becomes focusable (`tabindex="0"`), and focus is moved to it programmatically. The previously focused row, if any, becomes unfocusable (`tabindex="-1"`).
- When a user moves focus from a row to a control (link, input) by pressing Tab, that row becomes unfocusable (`tabindex="-1"`), which also means that all rows are now unfocusable, and Tab navigation continues between controls.

This behavior is demonstrated in [this example](https://codepen.io/editor/wvtyubnf-the-selector/pen/019e4efd-2b16-7c19-a58d-1b9eb08512d5).

### Performance

The table should handle thousands of rows without issues, so rows must be virtualized from the very beginning. Column virtualization is not required.

## Proposed Design

### API Design

The table doesn't have any data-related state. It works like a React "controlled component":

- The client owns and provides the state, including data, selection, sorting, and column order.
- The client registers callbacks to react to user interactions, such as selecting rows or sorting columns. These callbacks are expected to update the `data`, e.g., by actually reordering or selecting rows.

```typescript
type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
  getKey: (item: T, index: number) => React.Key

  getItemLevel?: (item: T, index: number) => number

  /**
   * Custom renderer for a data item.
   *
   * Expected to return one or more rows. If provided, completely
   * overrides standard column-based rendering.
   *
   * Use `TableRow` and `TableCell` components to apply standard classnames.
   * Beware that data-dependent classnames, namely `tbodyTrClassName` and `tdClassName`,
   * will not be applied; the client is expected to add them explicitly.
   *
   * The implementation may use `StandardRowRenderer` to fall back to default behavior.
   * It's also okay to render several rows, one of which uses `StandardRowRenderer`,
   * other being custom.
   *
   * @see StandardRowRendererProps
   */
  renderItem?: (item: T, index: number) => React.ReactNode

  /**
   * We reuse the existing `Selection` class. It is an isolated class,
   * not coupled to table props, and it clones itself on change.
   * It is intended to be stored on the client.
   * So it nicely fits the design.
   */
  selection?: Selection<T>

  /**
   * Called when the selection (including focus) changes.
   */
  onSelect?: (newSelection: Selection<T>) => void

  /**
   * Called when a `pointerup` event is handled at row level,
   * and the event target is not an active element, such as
   * `button`, `a`, `input`, or `select` elements.
   * The client may react by selecting or expanding the row.
   *
   * Open question: should the table component decide instead
   * whether a row should be selected or expanded and use,
   * for example, `selection` and `onSelect`?
   */
  onRowClick?: (e: PointerEvent, item: T, index: number) => void

  /**
   * The client is expected to update `items`
   */
  onRowMove?: (item: T, fromIndex: number, toIndex: number) => void

  /**
   * The client is expected to update `columns[i].sortDirection`
   * and sort `items`
   */
  onSort?: (columnIndex: number, direction: SortDirection) => void

  /**
   * The client is expected to update `columns`
   */
  onColumnDelete?: (columnIndex: number) => void

  /**
   * The client is expected to update `columns`
   */
  onColumnMove?: (fromIndex: number, toIndex: number) => void

  tableClassName?: string
  theadClassName?: string
  theadTrClassName?: string
  tbodyClassName?: string
  tbodyTrClassName?: string | ((item: T, index: number) => string)

  /**
   * Whether to show a small gear button at the top right corner.
   * See the "Column Controls Discoverability" section above.
   */
  columnEditButton?: 'everywhere' | 'mobileOnly'
}

type SortDirection = 'asc' | 'desc' | undefined

type Column<T> = {
  key: React.Key

  /**
   * Default: String(key)
   */
  renderHeader?: () => React.ReactNode

  /**
   * Renders a single cell value for a column.
   * Default: String((item as unknown[])[columnIndex])
   */
  renderCell?: (item: T, index: number) => React.ReactNode

  /**
   * If the column gets an indent when `TableProps.getItemLevel()` returns
   * a positive number.
   */
  indent?: boolean

  sortable?: boolean
  sortDirection?: SortDirection

  thClassName?: string
  tdClassName?: string | ((item: T, index: number) => string)
}

/**
 * Use it as a fallback in `renderItem`. It renders a single row with cells based on
 * `columns`, and applies all relevant classnames, including data-dependent ones,
 * namely `tbodyTrClassName` and `tdClassName`.
 *
 * The component props are only item-scoped. Table-scoped props are passed via
 * React context.
 */
type StandardRowRendererProps<T> = {
  item: T
  index: number
}
```

#### Example 1: Row Selection via Checkbox or Row Click

This example allows selecting a row either by a checkbox or by clicking on the row.

```tsx
const [data, setData] = useState(
  [
    'Amsterdam',
    'Berlin',
    'Limassol',
    'Prague',
  ]
)

const [selection, setSelection] = useState(() => new Selection<string>({data}))

return (
  <Table
    data={data}
    selection={selection}
    columns={[
      {
        key: 'Check',
        renderCell: item => (
          <input
            type="checkbox"
            checked={selection.isSelected(item)}
            onChange={e => setSelection(
              e.target.checked
                ? selection.select(item)
                : selection.deselect(item)
            )}
          />
        )
      },
      {
        key: 'City',
        renderCell: item => item,
      }
    ]}
    onRowClick={(e, item) => {
      setSelection(selection.toggleSelection(item))
    }}
  />
)
```

#### Example 2: Row Expansion

The data is provided as a flat list. The client is responsible for converting a tree or nested structure into a flat list.

```tsx
type Item = [level: number, place: string]

const [data, setData] = useState<Item[]>(
  [
    [0, 'Germany'],
    [0, 'Netherlands'],
  ]
)

function isExpanded(items: Item[], index: number): boolean {
  const currentLevel = items[index][0]
  const nextItem = items[index + 1]
  if (!nextItem) return false

  return nextItem[0] > currentLevel
}

function insertNested(items: Item[], index: number, places: string[]): Item[] {
  const currentLevel = items[index][0]
  const nestedItems = places.map(place => [currentLevel + 1, place])

  const beforeAndCurrent = items.slice(0, index + 1)
  const after = items.slice(index + 1)

  return [...beforeAndCurrent, ...nestedItems, ...after]
}

function removeNested(items: Item[], index: number): Item[] {
  const currentLevel = items[index][0]
  let firstNonNestedIndex = index + 1

  while (
    firstNonNestedIndex < items.length &&
    items[firstNonNestedIndex][0] > currentLevel
  ) {
    firstNonNestedIndex++
  }

  const beforeAndCurrent = items.slice(0, index + 1)
  const afterNested = items.slice(firstNonNestedIndex)

  return [...beforeAndCurrent, ...afterNested]
}

return (
  <Table
    data={data}
    getItemLevel={item => item[0]}
    columns={[
      {
        key: 'Place',
        renderCell: item => item[1],
        indent: true,
      }
    ]}
    onRowClick={(e, item, index) => {
      if (isExpanded(data, index)) {
        setData(removeNested(data, index))
      } else {
        const place = item[1]
        const nestedPlaces = place === 'Germany' ? ['Berlin', 'Munich']
          : place === 'Netherlands' ? ['Amsterdam', 'Hague']
          : place === 'Berlin' ? ['Mitte', 'Kreuzberg']
          : place === 'Munich' ? ['Altstadt', 'Schwabing']
          : place === 'Amsterdam' ? ['Centrum', 'Zuid']
          : place === 'Hague' ? ['Centrum', 'Scheveningen']
          : []
        setData(insertNested(data, index, nestedPlaces))
      }
    }}
  />
)
```

#### Example 3: Sorting

The Table component allows sorting by one or several columns. The "sorted" indicator is displayed based on `Column.sortDirection`, regardless of whether the `data` is actually sorted. When the user requests sorting by clicking a column header, the client decides whether the new sorting column is added to the sorting criteria or replaces the previous one.

```tsx
type Item = [issueId: string, votes: number]

const [data, setData] = useState<Item[]>([])
const [columns, setColumns] = useState<Column<Item>[]>([
  {
    key: 'Issue ID',
    sortable: true,
  },
  {
    key: 'Votes',
    sortable: true,
  }
])

useEffect(async () => {
  setData(await fetchIssues({
    orderBy: columns.map(column => ({
      key: column.key,
      direction: column.sortDirection
    }))
  }))
}, [columns])

return (
  <Table
    data={data}
    columns={columns}
    onSort={(columnIndex, direction) => {
      setColumns(columns.with(columnIndex, {
        ...columns[columnIndex],
        sortDirection: direction
      }))
    }}
  />
)
```

#### Example 4: Row Details Section

This is the TeamCity case: when a row is clicked (or a chevron button is used), a details section is shown below that row. From the table's perspective, it is the same `item` that renders two rows: one standard row and one extra row via the custom renderer.

```tsx
const [data, setData] = useState(
  [
    {id: 1624, status: 'Success', details: undefined},
    {id: 1625, status: 'Failed', details: undefined},
  ]
)

async function toggleDetails(index: number) {
  if (data[index].details) {
    setData(data.with(index, {
      ...data[index],
      details: undefined,
    }))
  } else {
    const details: string = await fetchDetails(data[index].id)
    setData(data.with(index, {
      ...data[index],
      details,
    }))
  }
}

return (
  <Table
    data={data}
    columns={[
      {
        key: 'ID',
        renderCell: item => item.id,
      },
      {
        key: 'Result',
        renderCell: item => item.status,
      },
    ]}
    renderItem={(item, index) => {
      const {details} = item
      return (
        <>
          <StandardRowRenderer item={item} index={index} />
          {details && (
            <TableRow className='build-details'>
              <TableCell colSpan={2}>{details}</TableCell>
            </TableRow>
          )}
        </>
      )
    }}
    onRowClick={(e, item, index) => {
      toggleDetails(index)
    }}
    tbodyTrClassName={item => item.details ? 'build-expanded' : undefined}
  />
)
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
