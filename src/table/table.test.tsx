/* eslint-disable no-nested-ternary */
import {useMemo, useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import Table from './table';
import {DefaultItemRenderer} from './default-item-renderer';

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
          onColumnDelete={columnIndex => {
            setColumns(previousColumns => previousColumns.filter((_, i) => i !== columnIndex));
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
          onColumnReorder={(fromIndex, insertionIndex) => {
            setColumns(previousColumns => {
              const newColumns = [...previousColumns];
              const [moved] = newColumns.splice(fromIndex, 1);
              const nextIndex = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
              newColumns.splice(nextIndex, 0, moved);
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
