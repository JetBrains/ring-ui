import React from 'react';

import {StoryFn} from '@storybook/react';


import {Grid, Row, Col} from '../grid/grid';
import Link from '../link/link';
import Pager from '../pager/pager';
import Button from '../button/button';

import Table, {Table as BaseTable, TableAttrs} from './table';
import MultiTable from './multitable';
import Selection, {SelectionItem} from './selection';
import mock from './table.stories.json';
import tableData from './table.examples2.json';
import {SortParams} from './header-cell';

export default {
  title: 'Components/Table',

  component: BaseTable,
  parameters: {
    hermione: {skip: true}
  },
  argTypes: {
    selection: {
      control: {disable: true}
    }
  }
};

const PAGE_SIZE = 7;
const TOTAL = mock.length;
interface Item extends SelectionItem {
  country: string
  city: string
  url: string
  children?: Item[]
}
interface BasicDemoProps extends TableAttrs<Item> {
  withCaption: boolean
}
export const Basic: StoryFn<BasicDemoProps> = args => {
  const {onSort, onSelect, withCaption, onReorder, ...restProps} = args;
  const [data, setData] = React.useState<Item[]>([]);
  const [selection, setSelection] = React.useState<Selection<Item>>(new Selection());
  const [sortKey, setSortKey] = React.useState<string>('country');
  const [sortOrder, setSortOrder] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);

  const isItemSelectable = React.useCallback((item: Item) => item.id !== 14, []);

  React.useEffect(() => {
    let newData: Item[] = [...mock];
    newData.sort((a, b) =>
      String(a[sortKey]).localeCompare(String(b[sortKey])) * (sortOrder ? 1 : -1));
    newData = newData.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);

    const newSelection = new Selection({data: newData, isItemSelectable});

    setData(newData);
    setSelection(newSelection);
  }, [isItemSelectable, page, sortKey, sortOrder]);

  const handleSort = React.useCallback((event: SortParams) => {
    onSort?.(event);
    setSortKey(event.column.id);
    setSortOrder(event.order);
  }, [onSort]);

  return (
    <div>
      <Table
        {...restProps}
        data={data}
        selection={selection}
        onSelect={newSelection => {
          onSelect?.(newSelection);
          setSelection(newSelection);
        }}
        onReorder={event => {
          onReorder?.(event);
          setData(event.data);
        }}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
        caption={withCaption ? 'Countries' : undefined}
        isItemSelectable={isItemSelectable}
        getItemDataTest={it => String(it.country)}
        dragHandleTitle="Drag me!"
      />

      <Grid>
        <Row>
          <Col>
            <Pager
              total={TOTAL}
              pageSize={PAGE_SIZE}
              currentPage={page}
              disablePageSizeSelector
              onPageChange={setPage}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            Active items: {[...selection.getActive()].map(item => item.country).join(', ')}
          </Col>
        </Row>

        <Row>
          <Col>
            <Button onClick={() => setData([...data])}>
              Recreate data array
            </Button>
            {page === 1 && data.length > 5 && (
              <>
                {' '}
                <span id="button-select-bulgaria">
                  {selection.isSelected(data[3])
                    ? (
                      <Button
                        onClick={() => setSelection(selection.deselect(data[3]))}
                      >
                        Deselect {data[3].country}
                      </Button>
                    )
                    : (
                      <Button
                        onClick={() => setSelection(selection.select(data[3]))}
                      >
                        Select {data[3].country}
                      </Button>
                    )}
                </span>

                <span id="button-select-finland">
                  {' '}
                  {selection.isSelected(data[5])
                    ? (
                      <Button
                        onClick={() => setSelection(selection.deselect(data[5]))}
                      >
                        Deselect {data[5].country}
                      </Button>
                    )
                    : (
                      <Button
                        onClick={() => setSelection(selection.select(data[5]))}
                      >
                        Select {data[5].country}
                      </Button>
                    )}
                </span>
              </>
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
Basic.args = {
  columns: [
    {
      id: 'country',
      title: 'Country',
      sortable: true
    },

    {
      id: 'id',
      title: 'ID',
      rightAlign: true
    },

    {
      id: 'city',
      title: 'City',
      getDataTest: item => item.city,
      sortable: true
    },

    {
      id: 'url',
      title: 'URL',
      getValue({url}) {
        return <Link href={url}>{url}</Link>;
      }
    }
  ],
  autofocus: true,
  selectable: true,
  draggable: true,
  withCaption: false,
  isItemSelectable: item => item.id !== 14
};
Basic.argTypes = {
  data: {
    control: {disable: true}
  },
  sortKey: {
    control: {disable: true}
  },
  sortOrder: {
    control: {disable: true}
  },
  caption: {
    control: {disable: true}
  },
  onSelect: {},
  onReorder: {}
};
Basic.storyName = 'basic';

const data1 = tableData.continents;
const data2 = tableData.countries;

export const MultiTableStory = () => {
  const [selection1, setSelection1] = React.useState(new Selection({data: data1}));
  const [selection2, setSelection2] = React.useState(new Selection({data: data2}));

  const columns1 = [
    {
      id: 'continent',
      title: 'Continent'
    },
    {
      id: 'url',
      title: 'URL'
    }
  ];

  const columns2 = [
    {
      id: 'country',
      title: 'Country'
    },
    {
      id: 'city',
      title: 'City'
    },
    {
      id: 'url',
      title: 'URL'
    }
  ];

  return (
    <MultiTable>
      <Table
        data={data1}
        columns={columns1}
        caption="Continents"
        selection={selection1}
        onSelect={setSelection1}
      />

      <Table
        data={data2}
        columns={columns2}
        caption="Countries"
        autofocus
        selection={selection2}
        onSelect={setSelection2}
      />
    </MultiTable>
  );
};
MultiTableStory.storyName = 'multi table';

export const EmptyTable: StoryFn<TableAttrs<SelectionItem>> = ({onSelect, ...restProps}) => {
  const [selection, setSelection] = React.useState(new Selection({}));

  return (
    <Table
      {...restProps}
      selection={selection}
      onSelect={newSelection => {
        onSelect?.(newSelection);
        setSelection(newSelection);
      }}
    />
  );
};
EmptyTable.args = {
  data: [],
  columns: [
    {
      id: 'country',
      title: 'Country'
    },
    {
      id: 'city',
      title: 'City'
    },
    {
      id: 'url',
      title: 'URL'
    }
  ],
  renderEmpty: () => 'Empty table',
  selectable: false
};
EmptyTable.storyName = 'empty table';
