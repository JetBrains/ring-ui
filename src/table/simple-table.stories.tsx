import {useState, useCallback, useEffect} from 'react';

import {StoryFn} from '@storybook/react-webpack5';

import Link from '../link/link';

import {TableAttrs} from './table';
import SimpleTable from './simple-table';
import {SelectionItem} from './selection';
import mock from './table.stories.json';
import tableData from './table.examples2.json';

import {SortParams} from './header-cell';
/**
 * Simple stateless table without hover effect
 */
export default {
  title: 'Components/Simple Table',

  component: SimpleTable,
  parameters: {
    screenshots: {skip: true},
  },
  argTypes: {
    selection: {
      control: {disable: true},
    },
  },
};

interface Item extends SelectionItem {
  country: string;
  city: string;
  url: string;
  children?: Item[];
}
interface BasicDemoProps extends TableAttrs<Item> {
  withCaption: boolean;
}
const tdata = tableData.countries;
export const Basic: StoryFn<BasicDemoProps> = args => (
  <div>
    <SimpleTable {...args} data={tdata} />
  </div>
);
Basic.args = {
  columns: [
    {
      id: 'country',
      title: 'Country',
    },

    {
      id: 'id',
      title: 'ID',
      rightAlign: true,
    },

    {
      id: 'city',
      title: 'City',
      getDataTest: item => item.city,
    },

    {
      id: 'url',
      title: 'URL',
      getValue({url}) {
        return <Link href={url}>{url}</Link>;
      },
    },
  ],
  autofocus: true,
  isItemSelectable: item => item.id !== 14,
};
Basic.storyName = 'basic';

export const WithSorting: StoryFn<BasicDemoProps> = args => {
  const {onSort, onSelect, withCaption, onReorder, ...restProps} = args;
  const [data, setData] = useState<Item[]>([]);
  const [sortKey, setSortKey] = useState<keyof Item>('country');
  const [sortOrder, setSortOrder] = useState<boolean>(true);

  const isItemSelectable = useCallback((item: Item) => item.id !== 14, []);

  useEffect(() => {
    const newData: Item[] = [...mock];
    newData.sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])) * (sortOrder ? 1 : -1));

    setData(newData);
  }, [isItemSelectable, sortKey, sortOrder]);

  const handleSort = useCallback(
    (event: SortParams) => {
      onSort?.(event);
      setSortKey(event.column.id as keyof Item);
      setSortOrder(event.order);
    },
    [onSort],
  );

  return <SimpleTable {...restProps} data={data} onSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />;
};
WithSorting.args = {
  columns: [
    {
      id: 'country',
      title: 'Country',
      sortable: true,
    },

    {
      id: 'id',
      title: 'ID',
      rightAlign: true,
    },

    {
      id: 'city',
      title: 'City',
      getDataTest: item => item.city,
      sortable: true,
    },

    {
      id: 'url',
      title: 'URL',
      getValue({url}) {
        return <Link href={url}>{url}</Link>;
      },
    },
  ],
  autofocus: true,
  isItemSelectable: item => item.id !== 14,
};
WithSorting.argTypes = {
  data: {
    control: {disable: true},
  },
  sortKey: {
    control: {disable: true},
  },
  sortOrder: {
    control: {disable: true},
  },
  caption: {
    control: {disable: true},
  },
};
WithSorting.storyName = 'with sorting';
