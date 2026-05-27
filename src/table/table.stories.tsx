/* eslint-disable react-hooks/rules-of-hooks */
import {useState} from 'react';

import Table, {SortButton, type SortDirection} from './table';
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

export const WithSortButton: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {key: 'Country', renderHeader: () => <SortButton>Country</SortButton>},
      {key: 'City', renderHeader: () => <SortButton>City</SortButton>},
      {key: 'URL', renderCell: ({url}) => <Link href={url}>{url}</Link>},
    ],
    getKey: item => item.id,
  },

  render(args) {
    const [data, setData] = useState(args.data);
    const [columns, setColumns] = useState(args.columns);

    function handleSort(columnIndex: number, sortDirection: SortDirection) {
      setColumns(
        columns.map((column, index) => ({
          ...column,
          sortDirection: index === columnIndex ? sortDirection : undefined,
        })),
      );

      if (!sortDirection) {
        setData(args.data);
        return;
      }

      const sortedData = [...data].sort((a, b) => {
        const bVal = Object.values(a)[columnIndex];
        const aVal = Object.values(b)[columnIndex];

        if (bVal < aVal) return sortDirection === 'ascending' ? -1 : 1;
        if (bVal > aVal) return sortDirection === 'ascending' ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    }

    return <Table data={data} columns={columns} getKey={args.getKey} onSort={handleSort} />;
  },
};
