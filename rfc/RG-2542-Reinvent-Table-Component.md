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

#### Treegrid and Grid Patterns

The current table behavior expected by clients is largely incompatible with both [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) and [Treegrid](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/) patterns. The main differences are:

- Tab navigation
  - In our table, the Tab sequence remains native: Tab goes through all focusable controls in document order.
  - In Grid, the whole widget is a single Tab stop: Tab enters it once, focus lands on the active cell, and the next Tab leaves the widget.
  - In Treegrid, Tab navigation is possible between focusable elements in the current row, but once the focus reaches the last control in the row, the next Tab leaves the widget.
- Which elements are focusable
  - In our table, focus is on real controls inside cells; cells themselves are not focusable.
    - Additionally, we have a custom "row focus" reachable with up/down arrow keys.
  - In Grid, cells are arrow-focusable, and nested controls are initially not focusable. To reach them, the user needs to "enter" the cell with Enter/F2. Rows are not focusable.
  - Treegrid is similar to Grid, yet rows may also be focusable, and controls in the current row are also Tab-focusable.
- Arrow keys
  - In our table, Up/Down arrow keys implement custom row-to-row navigation. Left/Right arrows are not used for navigation.
  - In Grid, all arrow keys move between cells.
  - Treegrid is similar to Grid, plus there are additional row focus and expansion actions achievable with Left/Right arrows from the leftmost and rightmost cells, respectively.

While Treegrid behavior is closer to our current table, it is still not compatible, mainly because of the fundamentally different focus interpretation for cells and controls. This suggests we should keep the default table semantics.

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

#### Discoverability of Row Focusability, Selection, and Expansion

Because we do not implement Grid/Treegrid patterns, the applicability of ARIA attributes is limited, so we need to fall back to workarounds.

- To suggest focusability on up/down arrows, we may provide brief instructions via a hidden `table/caption` and/or `aria-describedby` that points to instructional text.
- Selection should be controlled by explicit UI elements (e.g. checkboxes) by the client.
- Expansion should be controlled by an explicit button in the row having the `aria-expanded` attribute set. Additionally, we will use `aria-controls` and/or `aria-owns` to indicate the nested rows relationships. Whether this should be implemented in the table or left to the client is still to be clarified. See also: `collapse/collapse-control.tsx`.

### Performance

The table should handle thousands of rows without issues, so rows must be virtualized from the very beginning. Column virtualization is not required.

## Proposed Design

### New utils in `src/global`

- `focus-with-temporary-tabindex.ts` — focuses an element by temporarily assigning it `tabIndex=0`, used for programmatic focus after row clicks.
- `intersection-observer-context.ts` — provides a React context for sharing an `IntersectionObserver` instance among descendants. Previously an internal utility in Date Picker; now promoted to a shared utility.
- `is-within-interactive-element.ts` — checks whether a DOM node is inside an interactive element (link, button, input, etc.), used to distinguish row-level clicks from control clicks.
- `is-within-navigable-element.ts` — similar to the above, but targets navigable elements specifically.
- `parse-css-duration.ts` — parses CSS duration strings (e.g. `'200ms'`) into milliseconds.
- `schedule-with-cleanups.ts` — schedules callbacks together with their cleanup functions.
- `table-selection.ts` — moved from `table/selection.ts` in the legacy table package and renamed. An optional utility class for tracking selection state on the client; the new `Table` component does not require it.

### API Design

The table doesn't have any data-related state. It works like a React "controlled component":

- The client owns and provides the state, including data, selection, sorting, and column order.
- The client registers callbacks to react to user interactions, such as selecting rows or sorting columns. These callbacks are expected to update the `data`, e.g., by actually reordering or selecting rows.

The `TableProps` and `DefaultItemRendererProps` list only component-specific props; the actual components also accept native `table` and `tr` props (including `ref`) via intersection types:

```typescript
declare function Table<T>(props: TableProps<T> & ComponentPropsWithRef<'table'>);

declare function DefaultItemRenderer<T>(props: DefaultItemRendererProps & ComponentPropsWithRef<'tr'>);

interface TableProps<T> {
  data: readonly T[]
  columns: readonly Column<T>[]
  getKey: (item: T, index: number, items: readonly T[]) => React.Key

  noHeader?: boolean
  stickyHeader?: boolean

  /**
   * Customizes how an item is rendered.
   *
   * Return `DefaultItemRenderer` to configure row-specific behavior such as
   * `clickable`, `keyboardFocusable`, event handlers, `className`, or `ref`.
   *
   * You can also return custom row(s) instead. Use `TableRow` and `TableCell`
   * components to apply standard classnames. Beware that `tdClassName`, if
   * specified as a function, will not be applied; the client is expected to
   * add it explicitly.
   *
   * The implementation may use `DefaultItemRenderer` to fall back to default behavior.
   * It's also okay to render several rows, one of which uses `DefaultItemRenderer`,
   * others being custom.
   *
   * @see DefaultItemRendererProps
   */
  renderItem?: (item: T, index: number, items: readonly T[]) => React.ReactNode

  /**
   * Called when the user clicks the sort button in a column header.
   * The client is expected to update `columns[i].sortOrder` and sort `data`.
   */
  onSort?: (columnIndex: number, newOrder: SortOrder, columns: readonly Column<T>[]) => void

  /**
   * Called when the user clicks on a column delete button in the header.
   * The client is expected to update `columns`.
   */
  onColumnDelete?: (column: Column<T>, columnIndex: number, columns: readonly Column<T>[]) => void

  /**
   * Called when the user reorders columns by dragging a column.
   * The `insertionIndex` parameter represents an insertion position in the original,
   * unchanged `columns` array before the column is removed.
   *
   * One possible implementation is:
   *
   * columns.splice(fromIndex, 1);
   * columns.splice(fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex, 0, columnBeingReordered);
   *
   * The client is expected to update `columns`.
   */
  onColumnReorder?: (
    columnBeingReordered: Column<T>,
    fromIndex: number,
    insertionIndex: number,
    columns: readonly Column<T>[]
  ) => void

  /**
   * By default, when a column is reordered, the moved column is highlighted
   * with a temporary background color. Set `true` to disable this animation.
   */
  noColumnReorderAnimation?: boolean

  /**
   * If defined, determines whether an item may be reordered to a specific insertion position.
   * If not defined, any item may be reordered to any position.
   */
  canReorderItem?: (
    itemBeingReordered: T,
    fromIndex: number,
    insertionIndex: number,
    items: readonly T[]
  ) => boolean

  /**
   * Called when the user reorders items by dragging a handle.
   * The `insertionIndex` parameter represents an insertion position in the original,
   * unchanged `data` array before the item is removed.
   */
  onItemReorder?: (
    itemBeingReordered: T,
    fromIndex: number,
    insertionIndex: number,
    items: readonly T[]
  ) => void

  /**
   * By default, when an item is reordered, the moved item is highlighted
   * with a temporary background color. Set `true` to disable this animation.
   */
  noItemReorderAnimation?: boolean

  /**
   * Only renders rows near the viewport.
   */
  virtualizeRows?: boolean

  /**
   * Used with `virtualizeRows` as the source of scroll events, the target of
   * `ResizeObserver`, and the root of `IntersectionObserver`. Required when
   * the scrollable container is not the whole document.
   */
  scrollerRef?: RefObject<HTMLElement | null>

  /**
   * Used with `virtualizeRows` to estimate the height of items that have not
   * been rendered yet. Once a row is rendered, its actual height is used instead.
   *
   * Default: 37px.
   */
  estimateHeight?: (item: T, index: number, items: readonly T[]) => number

  lookaheadPx?: number
  retentionMarginPx?: number
  minScrollAndResizeDeltaPx?: number

  /**
   * "Column editing mode" reveals controls normally hidden, such as reorder and delete buttons.
   * When `undefined`, the component manages the mode internally.
   * Alternatively, pass `true` or `false` to control the mode externally.
   */
  columnEditing?: boolean

  /**
   * Called when the user requests to enter or leave column editing mode.
   * The `source` parameter indicates what triggered the request.
   */
  onColumnEditingRequest?: (editing: boolean, source: 'header' | 'edit-button') => void

  /**
   * Whether to show a small gear button in the top-right corner that
   * toggles column editing mode.
   * See the "Column Controls Discoverability" section above.
   */
  columnEditButton?: boolean

  theadClassName?: string
  theadTrClassName?: string
  tbodyClassName?: string
}

type SortOrder = 'none' | 'ascending' | 'descending'

interface Column<T> {
  key: React.Key

  /**
   * Used in `aria-label`s of column controls which do not contain text,
   * such as the delete column button. Default: String(key).
   */
  name?: string

  /**
   * Default: name ?? String(key)
   */
  renderHeader?: () => React.ReactNode

  /**
   * Renders a single cell value for a column.
   * Default: String((item as unknown[])[columnIndex]) for arrays,
   * String(item[String(key)]) for objects.
   */
  renderCell?: (item: T, index: number, items: readonly T[]) => React.ReactNode

  /**
   * If the column gets an indent when `DefaultItemRendererProps.level` is positive.
   */
  indent?: boolean

  /**
   * If set, displays sort button and includes `aria-sort` in the column header.
   * Handle clicks with TableProps.onSort.
   */
  sortOrder?: SortOrder

  /**
   * Whether to display a delete button in the column header.
   * Handle delete requests with TableProps.onColumnDelete.
   */
  deletable?: boolean

  /**
   * Displays a reorder handle in the column header.
   * Handle reorder requests with TableProps.onColumnReorder.
   * If a function is provided, it determines whether the column may be moved
   * to the specified insertion position.
   */
  canReorder?:
    | boolean
    | ((
        columnBeingReordered: Column<T>,
        fromIndex: number,
        insertionIndex: number,
        columns: readonly Column<T>[]
      ) => boolean)

  thClassName?: string
  tdClassName?: string | ((item: T, index: number, items: readonly T[]) => string | undefined)
}

/**
 * Standard component for rendering a table row.
 *
 * Renders an item using the table's column definitions and lets you
 * configure item-scoped behavior such as selection, keyboard navigation,
 * event handlers, `className`, and `ref`.
 *
 * The props are item-scoped. Table-scoped props are passed via React context.
 * Additional `<tr>` props (e.g. `onClick`, `onKeyDown`, `className`, `ref`) can be provided.
 *
 * @see TableRow
 * @see TableCell
 */
interface DefaultItemRendererProps {
  /**
   * Index of the `data` item to render.
   */
  index: number

  /**
   * If `true`, the row can be focused with up/down arrows
   * using the roving `tabindex` pattern.
   */
  keyboardFocusable?: boolean

  /**
   * Applies hover background and pointer cursor.
   */
  clickable?: boolean

  /**
   * If `true`, the row is shown as selected.
   */
  selected?: boolean

  /**
   * The nesting level. Applies an indent for columns with `Column.indent` set to `true`.
   * `0`, negative values, and an unset value mean no indent.
   */
  level?: number

  /**
   * If `true`, disables built-in item virtualization control. Useful when
    * `DefaultItemRenderer` is part of a custom item renderer that controls
   * the virtualization itself.
   */
  noItemVirtualization?: boolean

  /**
   * If `true`, disables built-in reorder layout registration
   * for this rendered item. Useful when `DefaultItemRenderer` is part
   * of a custom item renderer that controls the layout itself.
   */
  noReorderLayout?: boolean
}
```

### Main use case examples

#### Example 1: Row Selection via Checkbox or Row Click

This example allows selecting a row either by a checkbox or by clicking on the row.

This example uses `TableSelection` (see the new utils section above) for selection state management, but any approach works — including, for example, storing an `isSelected` flag directly on data items.

```tsx
const [data] = useState([
  'Amsterdam',
  'Berlin',
  'Limassol',
  'Prague',
])

const [selection, setSelection] = useState(() => new TableSelection<string>({data}))

return (
  <Table
    data={data}
    getKey={(_, i) => i}
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
    renderItem={(item, index, items) => (
      <DefaultItemRenderer
        index={index}
        clickable
        selected={selection.isSelected(item)}
        onClick={e => {
          if (!isWithinInteractiveElement(e.target)) {
            setSelection(selection.toggleSelection(item))
          }
        }}
      />
    )}
  />
)
```

#### Example 2: Row Expansion

The data is provided as a flat list. The client is responsible for converting a tree or nested structure into a flat list. The nesting level is passed to `DefaultItemRenderer` via the `level` prop.

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
    getKey={(_, i) => i}
    columns={[
      {
        key: 'Place',
        renderCell: item => item[1],
        indent: true,
      }
    ]}
    renderItem={(item, index, items) => (
      <DefaultItemRenderer
        index={index}
        clickable={!!item[0] || !isExpanded(items, index)}
        level={item[0]}
        onClick={() => {
          if (isExpanded(items, index)) {
            setData(removeNested(items, index))
          } else {
            const place = item[1]
            const nestedPlaces = place === 'Germany' ? ['Berlin', 'Munich']
              : place === 'Netherlands' ? ['Amsterdam', 'Hague']
              : place === 'Berlin' ? ['Mitte', 'Kreuzberg']
              : place === 'Munich' ? ['Altstadt', 'Schwabing']
              : place === 'Amsterdam' ? ['Centrum', 'Zuid']
              : place === 'Hague' ? ['Centrum', 'Scheveningen']
              : []
            setData(insertNested(items, index, nestedPlaces))
          }
        }}
      />
    )}
  />
)
```

#### Example 3: Sorting

The Table component allows sorting by one or several columns. The "sorted" indicator is displayed based on `Column.sortOrder`, regardless of whether the `data` is actually sorted. When the user requests sorting by clicking a column header, the client decides whether the new sorting column is added to the sorting criteria or replaces the previous one.

```tsx
type Item = [issueId: string, votes: number]

const [data, setData] = useState<Item[]>([])
const [columns, setColumns] = useState<Column<Item>[]>([
  {
    key: 'Issue ID',
    sortOrder: 'none',
  },
  {
    key: 'Votes',
    sortOrder: 'none',
  }
])

useEffect(async () => {
  setData(await fetchIssues({
    orderBy: columns.map(column => ({
      key: column.key,
      order: column.sortOrder
    }))
  }))
}, [columns])

return (
  <Table
    data={data}
    columns={columns}
    onSort={(columnIndex, newOrder) => {
      setColumns(columns.with(columnIndex, {
        ...columns[columnIndex],
        sortOrder: newOrder
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
    {id: 1624, status: 'Success', expanded: false},
    {id: 1625, status: 'Failed', expanded: false},
  ]
)

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
    renderItem={(item, index, items) => (
      <>
        <DefaultItemRenderer
          index={index}
          clickable
          selected={item.expanded}
          onClick={e => {
            if (!isWithinInteractiveElement(e.target)) {
              setData(items.with(index, {...item, expanded: !item.expanded}))
            }
          }}
        />
        {item.expanded && (
          <TableRow className='build-details'>
            <TableCell colSpan={2}>
              {/* Fetch details asynchronously and display them */}
            </TableCell>
          </TableRow>
        )}
      </>
    )}
  />
)
```

#### Example 5: Per-Row Reactivity with MobX

In complex tables such as the YouTrack issues table, a single row may contain over 200 components. Re-rendering all visible rows on each state change can be costly. That is why the table is compatible with MobX-like row-level reactivity.

To use this approach, wrap the data array in `observable()` and each row renderer in `observed()`. The client can then set items directly by index instead of calling `setState`, and only the affected row will re-render.

All other table features (virtualization, column editing, etc.) work normally alongside this.

```tsx
type Issue = {id: string; priority: string; selected: boolean}

const data = observable<Issue>([
  {id: 'TW-2469', priority: 'Normal', selected: false},
  {id: 'TW-2470', priority: 'Major', selected: false},
])

const IssueRow = observed(function IssueRow({index}: {index: number}) {
  const item = data[index]

  return (
    <DefaultItemRenderer
      index={index}
      clickable
      selected={item.selected}
      onClick={e => {
        if (!isWithinInteractiveElement(e.target)) {
          data[index] = {...item, selected: !item.selected}  // no setState
          e.preventDefault()
        }
      }}
    />
  )
})

return (
  <Table
    data={data}
    getKey={({id}) => id}
    columns={[
      {
        key: 'ID',
        renderCell: (item, index) => (
          <input
            type="checkbox"
            checked={item.selected}
            onChange={e => {
              data[index] = {...item, selected: e.target.checked}  // no setState
            }}
          />
        ),
      },
      {key: 'priority', name: 'Priority'},
    ]}
    renderItem={(_, index) => <IssueRow index={index} />}
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

Additionally, `table/selection.ts` has been moved and renamed to `global/table-selection.ts`. See the `TableSelection` note in the API Design section above.

### Code Reuse Strategy

During development, we should reuse existing logic where possible by extracting shared routines and hooks rather than copying code. This may require converting some legacy table code to functional components.

If extraction is too expensive for specific areas, code copying is acceptable as a last resort.

The new `Table` must not directly depend on legacy components (for example, by extending or wrapping them). Reusable parts should be extracted into shared utilities.

### Third-Party Libraries

The proposed libraries (TanStack Table and @dnd-kit/core) were evaluated but ultimately not used. An in-house implementation was chosen to avoid the overhead of heavy customization and to keep full control over bundle size and behavior.

## Branch, Versioning, and Early Access

The existing branch `develop-8.0`, containing refactorings and Storybook updates, was renamed to `develop-9.0`.

The new `develop-8.0` branch was created from the latest `master`.

Table development happens in the `develop-8.0` branch and in branches targeting it.

The TeamCity `Publish@next` configuration periodically publishes `8.0.0-beta.x` versions from `develop-8.0` or branches created from it, allowing clients to try the new table and provide feedback during this phase.

The `develop-8.0` branch will likely not be merged into `master`. Instead, `master` will be renamed to `release-7.0`, and `develop-8.0` will be renamed to `master`.
