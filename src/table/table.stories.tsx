import Table from './table';
import Link from '../link/link';

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

export const Basic: TableStory<(typeof data)[number]> = {
  args: {
    data,
    columns: [
      {key: 'ID'},
      {key: 'Country'},
      {key: 'City'},
      {key: 'URL', renderCell: ({url}) => <Link href={url}>{url}</Link>},
    ],
    getKey: item => item.id,
  },
};
