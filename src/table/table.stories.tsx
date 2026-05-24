/* eslint-disable react-hooks/rules-of-hooks */
import {useState} from 'react';

import Table from './table';
import Link from '../link/link';
import Selection from '../legacy-table/selection';
import Checkbox from '../checkbox/checkbox';

import type {Meta, StoryObj} from '@storybook/react';

import data from '../legacy-table/table.stories.json' with {type: 'json'};

const meta = {
  title: 'Components/Table',

  component: Table,

  parameters: {
    screenshots: {skip: true},
  },
} as Meta<typeof Table<unknown>>;

export default meta;

type TableStory<T> = StoryObj<typeof Table<T>>;

export const BasicWithMultiselect: TableStory<(typeof data)[number]> = {
  args: {
    data: data.slice(10, 16),
    columns: [
      {key: 'Check', renderCell: () => null},
      {key: 'ID', renderCell: ({id}) => id},
      {key: 'Country', renderCell: ({country}) => country},
      {key: 'City', renderCell: ({city}) => city},
      {key: 'URL', renderCell: ({url}) => <Link href={url}>{url}</Link>},
    ],
    getKey: item => item.id,

    selection: new Selection(),
    isClickable: () => true,
  },

  render(args) {
    const [selection, setSelection] = useState(args.selection!);

    const [checkColumn, ...restColumns] = args.columns;
    const columns = [
      {
        ...checkColumn,
        renderCell: item => (
          <Checkbox
            checked={selection.isSelected(item)}
            onChange={e => setSelection(e.target.checked ? selection.select(item) : selection.deselect(item))}
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
