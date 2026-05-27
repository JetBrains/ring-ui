/* eslint-disable react-hooks/rules-of-hooks */
import {useState} from 'react';

import Table, {DeleteColumnButton, SortButton, type SortOrder} from './table';
import Link from '../link/link';
import Selection from '../legacy-table/selection';
import Checkbox from '../checkbox/checkbox';

import type {Meta, StoryObj} from '@storybook/react';

import countriesData from '../legacy-table/table.stories.json' with {type: 'json'};

import style from './table.stories.css';

const meta = {
  title: 'Components/Table',

  component: Table,

  parameters: {
    screenshots: {skip: true},
  },
} as Meta<typeof Table<unknown>>;

export default meta;

type TableStory<T> = StoryObj<typeof Table<T>>;

const smallDataSlice = countriesData.slice(10, 16);

export const BasicWithMultiselect: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {key: 'Country', renderCell: ({country}) => country},
      {key: 'City', renderCell: ({city}) => city},
      {key: 'URL', renderCell: ({url}) => <Link href={url}>{url}</Link>},
    ],
    getKey: item => item.id,

    selection: new Selection({data: smallDataSlice}),
    isClickable: () => true,
  },

  render(args) {
    const [selection, setSelection] = useState(args.selection!);
    const allSelected = args.data.every(item => selection.isSelected(item));

    const [idColumn, ...restColumns] = args.columns;
    const columns = [
      {
        ...idColumn,

        renderHeader: () => (
          <Checkbox
            indeterminate={selection.getSelected().size > 0 && !allSelected}
            checked={allSelected}
            onChange={e => setSelection(e.target.checked ? selection.selectAll() : selection.resetSelection())}
            label='ID'
          />
        ),

        thClassName: style.thWithCheckbox,

        renderCell: item => (
          <Checkbox
            checked={selection.isSelected(item)}
            onChange={e => setSelection(e.target.checked ? selection.select(item) : selection.deselect(item))}
            label={String(item.id)}
          />
        ),
      },
      ...restColumns,
    ] satisfies typeof args.columns;

    return (
      <Table
        data={args.data}
        columns={columns}
        getKey={args.getKey}
        selection={selection}
        isClickable={args.isClickable}
        onItemClick={(_e, item) => setSelection(selection.toggleSelection(item))}
      />
    );
  },
};

export const WithSortAndDelete: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {
        key: 'Country',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <SortButton>Country</SortButton> <DeleteColumnButton />
          </>
        ),
      },
      {
        key: 'City',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <SortButton>City</SortButton> <DeleteColumnButton />
          </>
        ),
      },
      {
        key: 'URL',
        renderHeader: () => (
          <>
            URL <DeleteColumnButton />
          </>
        ),
        renderCell: ({url}) => <Link href={url}>{url}</Link>,
      },
    ],
    getKey: item => item.id,
  },

  render(args) {
    const [data, setData] = useState(args.data);
    const [columns, setColumns] = useState(args.columns);

    function handleSort(columnIndex: number, sortOrder: SortOrder) {
      setColumns(
        columns.map((column, i) => ({
          ...column,
          sortOrder: i === columnIndex ? sortOrder : undefined,
        })),
      );

      if (sortOrder === 'none') {
        setData(args.data);
        return;
      }

      const sortedData = [...data].sort((a, b) => {
        const bVal = Object.values(a)[columnIndex];
        const aVal = Object.values(b)[columnIndex];

        if (bVal < aVal) return sortOrder === 'ascending' ? -1 : 1;
        if (bVal > aVal) return sortOrder === 'ascending' ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    }

    function handleColumnDelete(columnIndex: number) {
      setColumns(columns.filter((_, i) => i !== columnIndex));
    }

    return (
      <Table
        data={data}
        columns={columns}
        getKey={args.getKey}
        onSort={handleSort}
        onColumnDelete={handleColumnDelete}
      />
    );
  },
};
