/* eslint-disable no-nested-ternary */
import {useMemo, useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import Table from './table';
import {DefaultItemRenderer} from './default-item-renderer';
import {ItemReorderHandle} from './table-primitives';

import type {Column} from './table-props';

interface CountryItem {
  id: number;
  country: string;
  capital: string;
  wikipedia: string;
}

const countries: CountryItem[] = [
  {id: 8421, country: 'Norway', capital: 'Oslo', wikipedia: 'https://en.wikipedia.org/wiki/Norway'},
  {id: 1735, country: 'Sweden', capital: 'Stockholm', wikipedia: 'https://en.wikipedia.org/wiki/Sweden'},
  {id: 6098, country: 'Ireland', capital: 'Dublin', wikipedia: 'https://en.wikipedia.org/wiki/Ireland'},
  {id: 2954, country: 'Netherlands', capital: 'Amsterdam', wikipedia: 'https://en.wikipedia.org/wiki/Netherlands'},
  {id: 7186, country: 'Germany', capital: 'Berlin', wikipedia: 'https://en.wikipedia.org/wiki/Germany'},
  {id: 3842, country: 'Belgium', capital: 'Brussels', wikipedia: 'https://en.wikipedia.org/wiki/Belgium'},
  {id: 9520, country: 'Austria', capital: 'Vienna', wikipedia: 'https://en.wikipedia.org/wiki/Austria'},
  {id: 4671, country: 'France', capital: 'Paris', wikipedia: 'https://en.wikipedia.org/wiki/France'},
  {id: 1207, country: 'Italy', capital: 'Rome', wikipedia: 'https://en.wikipedia.org/wiki/Italy'},
  {id: 5319, country: 'Spain', capital: 'Madrid', wikipedia: 'https://en.wikipedia.org/wiki/Spain'},
  {id: 8043, country: 'Portugal', capital: 'Lisbon', wikipedia: 'https://en.wikipedia.org/wiki/Portugal'},
];

const getKey = ({id}: CountryItem) => id;

const baseColumns: Column<CountryItem>[] = [
  {key: 'id', name: 'Id', sortOrder: 'none', deletable: true, canReorder: true},
  {key: 'country', name: 'Country', sortOrder: 'none', deletable: true, canReorder: true},
  {key: 'capital', name: 'Capital', sortOrder: 'none', deletable: true, canReorder: true},
  {
    key: 'wikipedia',
    name: 'Wikipedia',
    deletable: true,
    canReorder: true,
    renderCell: item => (
      <a href={item.wikipedia} target='_blank' rel='noreferrer'>
        {`${item.country} in Wikipedia`}
      </a>
    ),
  },
];

describe('Table basic scenarios', () => {
  it('has unique ids', () => {
    const ids = countries.map(getKey);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).to.equal(ids.length);
  });

  it('renders 10 rows', () => {
    const {container} = render(<Table data={countries} columns={baseColumns} getKey={getKey} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).to.have.length(countries.length);
    expect(rows[1].textContent).to.contain('Sweden');
    expect(rows[9].textContent).to.contain('Madrid');
  });

  it('supports multi-selection with checkboxes and selected-row className change', () => {
    function MultiselectTable() {
      interface SelectableCountryItem extends CountryItem {
        selected: boolean;
      }

      const [data, setData] = useState<SelectableCountryItem[]>(() =>
        countries.map(item => ({...item, selected: false})),
      );

      const columns = useMemo<Column<SelectableCountryItem>[]>(
        () => [
          {
            key: 'select',
            name: 'Select',
            renderCell: (item, index) => (
              <input
                type='checkbox'
                checked={item.selected}
                aria-label={`Select ${item.capital}`}
                onChange={e => {
                  setData(currentData => currentData.with(index, {...item, selected: e.target.checked}));
                }}
              />
            ),
          },
          ...(baseColumns as unknown as Column<SelectableCountryItem>[]),
        ],
        [],
      );

      return (
        <Table
          data={data}
          columns={columns}
          getKey={getKey}
          renderItem={(item, index) => <DefaultItemRenderer index={index} selected={item.selected} />}
        />
      );
    }

    render(<MultiselectTable />);

    fireEvent.click(screen.getByRole('checkbox', {name: 'Select Brussels'}));
    fireEvent.click(screen.getByRole('checkbox', {name: 'Select Madrid'}));

    expect((screen.getByRole('checkbox', {name: 'Select Brussels'}) as HTMLInputElement).checked).to.equal(true);
    expect((screen.getByRole('checkbox', {name: 'Select Madrid'}) as HTMLInputElement).checked).to.equal(true);

    const brusselsRow = screen.getByText('Brussels').closest('tr');
    const madridRow = screen.getByText('Madrid').closest('tr');
    const berlinRow = screen.getByText('Berlin').closest('tr');

    expect(brusselsRow).to.not.equal(null);
    expect(madridRow).to.not.equal(null);
    expect(berlinRow).to.not.equal(null);

    const brusselsClassName = brusselsRow!.className;
    const madridClassName = madridRow!.className;
    const berlinClassName = berlinRow!.className;

    expect(brusselsClassName).to.equal(madridClassName);
    expect(brusselsClassName).not.to.equal(berlinClassName);
  });

  it('renders a table without a header', () => {
    const {container} = render(<Table data={countries} columns={baseColumns} getKey={getKey} noHeader />);
    expect(container.querySelector('thead')).to.equal(null);
    expect(container.querySelectorAll('tbody tr')).to.have.length(countries.length);
  });

  it('moves focus to the previous row when ArrowUp is pressed on a link and keyboardFocusable is enabled', () => {
    render(
      <Table
        data={countries}
        columns={baseColumns}
        getKey={getKey}
        renderItem={(_item, index) => <DefaultItemRenderer index={index} keyboardFocusable />}
      />,
    );

    const franceLink = screen.getByRole('link', {name: 'France in Wikipedia'});
    franceLink.focus();
    fireEvent.keyDown(franceLink, {key: 'ArrowUp'});

    const viennaRow = screen.getByText('Vienna').closest('tr');
    expect(viennaRow).to.not.equal(null);
    expect(document.activeElement).to.equal(viennaRow);
  });

  it('does not move focus to the previous row when Arrow is pressed on an editable element', () => {
    const {container} = render(
      <Table
        data={countries}
        columns={[
          ...baseColumns,
          {
            key: 'input',
            renderCell: () => <input />,
          },
        ]}
        getKey={getKey}
        renderItem={(_item, index) => <DefaultItemRenderer index={index} keyboardFocusable />}
      />,
    );
    const someInput = container.querySelector('tr:nth-child(4) input');
    expect(someInput).to.not.equal(null);
    (someInput as HTMLElement).focus();
    fireEvent.keyDown(someInput as HTMLElement, {key: 'ArrowUp'});
    expect(document.activeElement).to.equal(someInput);
  });

  it('sorts by one column in descending order and then by another column', () => {
    function SortableTable() {
      const [data, setData] = useState(countries);
      const [columns, setColumns] = useState(baseColumns);

      return (
        <Table
          data={data}
          columns={columns}
          getKey={getKey}
          onSort={(columnIndex, sortOrder) => {
            setColumns(prevColumns =>
              prevColumns.map((column, i) => ({
                ...column,
                sortOrder: i === columnIndex ? sortOrder : column.sortOrder ? 'none' : undefined,
              })),
            );

            const columnKey = String(columns[columnIndex].key) as keyof CountryItem;
            setData(previousData =>
              [...previousData].sort((a, b) => {
                const aVal = a[columnKey];
                const bVal = b[columnKey];
                if (aVal < bVal) return sortOrder === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'ascending' ? 1 : -1;
                return 0;
              }),
            );
          }}
        />
      );
    }

    const {container} = render(<SortableTable />);

    fireEvent.click(screen.getByRole('button', {name: 'Country'}));
    fireEvent.click(screen.getByRole('button', {name: 'Country'}));

    function getColumnTexts(columnIndex: number) {
      const rows = [...container.querySelectorAll('tbody tr')];
      return rows.map(row => row.querySelector(`td:nth-child(${columnIndex + 1})`)?.textContent?.trim() ?? '');
    }

    expect(getColumnTexts(1)).to.deep.equal([
      'Sweden',
      'Spain',
      'Portugal',
      'Norway',
      'Netherlands',
      'Italy',
      'Ireland',
      'Germany',
      'France',
      'Belgium',
      'Austria',
    ]);

    const capitalSortButton = screen.getByRole('button', {name: 'Capital'});
    fireEvent.click(capitalSortButton);

    expect(getColumnTexts(2)).to.deep.equal([
      'Amsterdam',
      'Berlin',
      'Brussels',
      'Dublin',
      'Lisbon',
      'Madrid',
      'Oslo',
      'Paris',
      'Rome',
      'Stockholm',
      'Vienna',
    ]);
  });

  it('deletes a column from the header', () => {
    function DeletableColumnsTable() {
      const [columns, setColumns] = useState(baseColumns);
      return (
        <Table
          data={countries}
          columns={columns}
          getKey={getKey}
          columnEditing
          onColumnDelete={column => {
            setColumns(previousColumns => previousColumns.filter(c => c !== column));
          }}
        />
      );
    }

    const {container} = render(<DeletableColumnsTable />);

    fireEvent.click(screen.getByRole('button', {name: 'Delete column Capital.'}));

    const headers = [...container.querySelectorAll('thead th')].map(th => th.textContent?.trim());
    expect(headers).to.deep.equal(['Id', 'Country', 'Wikipedia']);
  });

  it('moves a column to the right with keyboard on reorder handle', () => {
    function ReorderableColumnsTable() {
      const [columns, setColumns] = useState(baseColumns);

      return (
        <Table
          data={countries}
          columns={columns}
          getKey={getKey}
          columnEditing
          onColumnReorder={(column, fromIndex, insertionIndex) => {
            setColumns(previousColumns => {
              const newColumns = [...previousColumns];
              newColumns.splice(fromIndex, 1);
              const nextIndex = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
              newColumns.splice(nextIndex, 0, column);
              return newColumns;
            });
          }}
        />
      );
    }

    const {container} = render(<ReorderableColumnsTable />);

    const countryReorderButton = screen.getByRole('button', {name: 'Reorder column Country.'});
    countryReorderButton.focus();
    fireEvent.keyDown(countryReorderButton, {key: 'ArrowRight'});

    const headers = [...container.querySelectorAll('thead th')].map(th => th.textContent?.trim());
    expect(headers).to.deep.equal(['Id', 'Capital', 'Country', 'Wikipedia']);
  });

  it('moves a row down with keyboard on reorder handle', () => {
    function ReorderableRowsTable() {
      const [data, setData] = useState(countries);
      const [columns] = useState(
        () =>
          [
            {
              ...baseColumns[0],
              renderCell: ({id, country}, index) => (
                <>
                  <ItemReorderHandle index={index} data-test={country} /> {id}
                </>
              ),
            },
            ...baseColumns.slice(1),
          ] satisfies Column<CountryItem>[],
      );

      return (
        <Table
          data={data}
          columns={columns}
          getKey={getKey}
          onItemReorder={(item, fromIndex, insertionIndex) => {
            setData(previousData => {
              const newData = [...previousData];
              newData.splice(fromIndex, 1);
              const nextIndex = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
              newData.splice(nextIndex, 0, item);
              return newData;
            });
          }}
        />
      );
    }

    const {container} = render(<ReorderableRowsTable />);

    const initialFirst4CapitalCities = ['Oslo', 'Stockholm', 'Dublin', 'Amsterdam'];
    function getActualFirst4CapitalCities() {
      return [...container.querySelectorAll('tbody tr td:nth-child(3)')].map(td => td.textContent?.trim()).slice(0, 4);
    }

    expect(getActualFirst4CapitalCities()).to.deep.equal(initialFirst4CapitalCities);

    const swedenReorderButton = screen.getByTestId('Sweden');
    swedenReorderButton.focus();
    fireEvent.keyDown(swedenReorderButton, {key: 'ArrowDown'});

    const capitalCitiesAfterMove = [
      initialFirst4CapitalCities[0],
      initialFirst4CapitalCities[2],
      initialFirst4CapitalCities[1],
      initialFirst4CapitalCities[3],
    ];
    expect(getActualFirst4CapitalCities()).to.deep.equal(capitalCitiesAfterMove);
  });

  it('changes thead className when columnEditing is controlled externally', () => {
    function ExternallyControlledColumnEditingTable() {
      const [columnEditing, setColumnEditing] = useState(false);

      return (
        <>
          <label>
            {'Toggle column editing'}
            <input
              type='checkbox'
              aria-label='Toggle column editing'
              checked={columnEditing}
              onChange={e => setColumnEditing(e.target.checked)}
            />
          </label>
          <Table data={countries} columns={baseColumns} getKey={getKey} columnEditing={columnEditing} />
        </>
      );
    }

    const {container} = render(<ExternallyControlledColumnEditingTable />);

    const thead = container.querySelector('thead');
    expect(thead).to.not.equal(null);

    const initialClassName = thead!.className;

    fireEvent.click(screen.getByRole('checkbox', {name: 'Toggle column editing'}));

    const updatedClassName = thead!.className;
    expect(updatedClassName).to.not.equal(initialClassName);
  });

  it('changes thead className when using embedded columnEditButton', () => {
    const {container} = render(<Table data={countries} columns={baseColumns} getKey={getKey} columnEditButton />);

    const thead = container.querySelector('thead');
    expect(thead).to.not.equal(null);

    const initialClassName = thead!.className;

    fireEvent.click(screen.getByRole('button', {name: 'Show column controls.'}));

    const updatedClassName = thead!.className;
    expect(updatedClassName).to.not.equal(initialClassName);
  });
});

describe('Table column resize', () => {
  const resizableColumns: Column<CountryItem>[] = [
    {key: 'country', name: 'Country', width: 100, resizable: true, minWidth: 50, maxWidth: 200, sortOrder: 'none'},
    {key: 'capital', name: 'Capital', width: 120},
  ];

  beforeEach(() => {
    // jsdom has no layout. The drag derives the width from the header cell position,
    // so every cell is 100px wide at x = 0, matching the "Country" column below.
    vi.spyOn(HTMLTableCellElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 20));
  });

  /**
   * jsdom has no `PointerEvent`, so pointer events are built from `MouseEvent`
   */
  function firePointer(type: string, target: Element, clientX: number) {
    const event = new MouseEvent(type, {bubbles: true, cancelable: true, button: 0, clientX});
    Object.defineProperties(event, {pointerId: {value: 1}, isPrimary: {value: true}});
    fireEvent(target, event);
  }

  function drag(handle: Element, fromX: number, toX: number) {
    firePointer('pointerdown', handle, fromX);
    firePointer('pointermove', handle, toX);
    firePointer('pointerup', handle, toX);
  }

  function getColWidths(container: HTMLElement) {
    return [...container.querySelectorAll('col')].map(col => col.style.width);
  }

  function ResizableTable({
    columns: initialColumns,
    onColumnResize,
    updateColumns = true,
  }: {
    columns: Column<CountryItem>[];
    onColumnResize?: () => void;
    updateColumns?: boolean;
  }) {
    const [columns, setColumns] = useState(initialColumns);
    return (
      <Table
        data={countries}
        columns={columns}
        getKey={getKey}
        onSort={() => {
          throw new Error('Resizing must not sort');
        }}
        onColumnResize={(column, columnIndex, width) => {
          onColumnResize?.();
          if (updateColumns) setColumns(columns.with(columnIndex, {...column, width}));
        }}
      />
    );
  }

  const getHandle = () => document.querySelector('th:first-child [data-test="ring-table-column-resize-handle"]')!;

  it('does not render a colgroup when no column is resizable or sized', () => {
    const {container} = render(<Table data={countries} columns={baseColumns} getKey={getKey} />);
    expect(container.querySelector('colgroup')).to.equal(null);
  });

  it('keeps the auto layout until the user resizes a column without width', () => {
    const columns = baseColumns.map(column => ({...column, resizable: true}));
    const {container} = render(<Table data={countries} columns={columns} getKey={getKey} />);

    expect(getColWidths(container)).to.deep.equal(['', '', '', '', '0px']);
    expect(container.querySelector('table')!.style.width).to.equal('');
  });

  it('renders the column widths and their sum as the table width', () => {
    const {container} = render(<ResizableTable columns={resizableColumns} />);

    // The last `<col>` is the filler used while shrinking
    expect(getColWidths(container)).to.deep.equal(['100px', '120px', '0px']);
    expect(container.querySelector('table')!.style.width).to.equal('220px');
  });

  it('commits the width once on pointer release, without sorting', () => {
    const onColumnResize = vi.fn();
    const {container} = render(<ResizableTable columns={resizableColumns} onColumnResize={onColumnResize} />);

    drag(getHandle(), 0, 30);
    fireEvent.click(getHandle());

    expect(onColumnResize).toHaveBeenCalledOnce();
    expect(getColWidths(container)).to.deep.equal(['130px', '120px', '0px']);
    expect(container.querySelector('table')!.style.width).to.equal('250px');
  });

  it('passes the column, its index, the new width and the columns to onColumnResize', () => {
    const onColumnResize = vi.fn();
    render(<Table data={countries} columns={resizableColumns} getKey={getKey} onColumnResize={onColumnResize} />);

    drag(getHandle(), 0, 30);

    expect(onColumnResize).toHaveBeenCalledWith(resizableColumns[0], 0, 130, resizableColumns);
  });

  it('clamps the width to minWidth and maxWidth', () => {
    const {container} = render(<ResizableTable columns={resizableColumns} />);

    drag(getHandle(), 0, 500);
    expect(getColWidths(container)[0]).to.equal('200px');

    drag(getHandle(), 0, -500);
    expect(getColWidths(container)[0]).to.equal('50px');
  });

  it('cancels the drag on Escape', () => {
    const onColumnResize = vi.fn();
    const {container} = render(<ResizableTable columns={resizableColumns} onColumnResize={onColumnResize} />);

    firePointer('pointerdown', getHandle(), 0);
    firePointer('pointermove', getHandle(), 50);
    expect(getColWidths(container)[0]).to.equal('150px');

    fireEvent.keyDown(window, {key: 'Escape'});
    firePointer('pointerup', getHandle(), 50);

    expect(onColumnResize).not.toHaveBeenCalled();
    expect(getColWidths(container)).to.deep.equal(['100px', '120px', '0px']);
  });

  it('keeps the table width while shrinking, using the filler column', () => {
    const {container} = render(<ResizableTable columns={resizableColumns} />);

    firePointer('pointerdown', getHandle(), 0);
    firePointer('pointermove', getHandle(), -30);

    expect(getColWidths(container)).to.deep.equal(['70px', '120px', '30px']);
    expect(container.querySelector('table')!.style.width).to.equal('220px');

    firePointer('pointerup', getHandle(), -30);
    expect(getColWidths(container)).to.deep.equal(['70px', '120px', '0px']);
  });

  it('returns a controlled column to its width when the client ignores onColumnResize', () => {
    const {container} = render(<ResizableTable columns={resizableColumns} updateColumns={false} />);

    drag(getHandle(), 0, 30);

    expect(getColWidths(container)[0]).to.equal('100px');
  });

  it('keeps the new width of a column without width', () => {
    const columns: Column<CountryItem>[] = [
      {key: 'country', name: 'Country', resizable: true},
      {key: 'capital', name: 'Capital', width: 120},
    ];
    const {container} = render(<ResizableTable columns={columns} updateColumns={false} />);

    // Measured as 100px, see `beforeEach`
    drag(getHandle(), 0, 10);

    expect(getColWidths(container)).to.deep.equal(['110px', '120px', '0px']);
  });

  it('keeps the column edge under the pointer when the drag switches the table to fixed layout', () => {
    const columns: Column<CountryItem>[] = [
      {key: 'country', name: 'Country', width: 100},
      {key: 'capital', name: 'Capital', resizable: true},
    ];
    const {container} = render(<ResizableTable columns={columns} />);
    const table = container.querySelector('table')!;
    const [countryHeader, capitalHeader] = container.querySelectorAll('th');

    // "Country" asks for 100px, but the auto layout stretches it to 180px.
    // Starting the drag switches to fixed layout, which applies the 100px
    // and moves "Capital" 80px to the left.
    const layouts = {
      auto: {country: new DOMRect(0, 0, 180, 20), capital: new DOMRect(180, 0, 100, 20)},
      fixed: {country: new DOMRect(0, 0, 100, 20), capital: new DOMRect(100, 0, 100, 20)},
    };
    // Only the fixed layout sets the table width
    const currentLayout = () => (table.style.width === '' ? layouts.auto : layouts.fixed);
    vi.spyOn(countryHeader, 'getBoundingClientRect').mockImplementation(() => currentLayout().country);
    vi.spyOn(capitalHeader, 'getBoundingClientRect').mockImplementation(() => currentLayout().capital);

    // Grab the "Capital" edge, at 280px in auto layout, and move 1px to the right
    const handle = capitalHeader.querySelector('[data-test="ring-table-column-resize-handle"]')!;
    drag(handle, 280, 281);

    // Not 181px: the drag measures the columns after the switch, not before
    expect(getColWidths(container)).to.deep.equal(['100px', '101px', '0px']);
  });
});
