import React, {Component} from 'react';

import {Story} from '@storybook/react';

import reactDecorator from '../../.storybook/react-decorator';

import {Grid, Row, Col} from '../grid/grid';
import Link from '../link/link';
import Pager from '../pager/pager';
import Button from '../button/button';

import Table, {Table as BaseTable, TableAttrs} from './table';
import MultiTable from './multitable';
import Selection, {SelectionItem} from './selection';
import mock from './table.examples.json';
import {continents, countries} from './table.examples2.json';
import {SortParams} from './header-cell';

export default {
  title: 'Components/Table',
  decorators: [reactDecorator()],

  parameters: {
    component: BaseTable,
    framework: 'react',
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
interface BasicDemoState {
  data: Item[]
  selection: Selection<Item>
  page: number
  pageSize: number
  total: number
  sortKey: string
  sortOrder: boolean
}
class BasicDemo extends Component<BasicDemoProps, BasicDemoState> {
  state: BasicDemoState = {
    data: [],
    selection: new Selection(),
    page: 1,
    pageSize: PAGE_SIZE,
    total: TOTAL,
    sortKey: 'country',
    sortOrder: true
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate(prevProps: BasicDemoProps, prevState: BasicDemoState) {
    const {page, sortKey, sortOrder} = this.state;
    if (
      page !== prevState.page ||
      sortKey !== prevState.sortKey ||
      sortOrder !== prevState.sortOrder
    ) {
      this.loadPage();
    }
  }

  onSort = (event: SortParams) => {
    this.props.onSort?.(event);
    this.setState({sortKey: event.column.id, sortOrder: event.order});
  };

  onPageChange = (page: number) => {
    this.setState({page});
  };

  isItemSelectable(item: Item) {
    return item.id !== 14;
  }

  loadPage = () => {
    const {page, pageSize, sortKey, sortOrder} = this.state;

    let data: Item[] = [...mock];
    data.sort((a, b) =>
      String(a[sortKey]).localeCompare(String(b[sortKey])) * (sortOrder ? 1 : -1));
    data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    const selection = new Selection({data, isItemSelectable: this.isItemSelectable});

    this.setState({data, selection});
  };

  render() {
    const {onSelect, withCaption, onReorder, ...restProps} = this.props;
    const {
      data,
      page,
      pageSize,
      total,
      selection,
      sortKey,
      sortOrder
    } = this.state;

    return (
      <div>
        <Table
          {...restProps}
          data={data}
          selection={selection}
          onSelect={newSelection => {
            onSelect?.(newSelection);
            this.setState({selection: newSelection});
          }}
          onReorder={event => {
            onReorder?.(event);
            this.setState({data: event.data});
          }}
          onSort={this.onSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
          caption={withCaption ? 'Countries' : undefined}
          isItemSelectable={this.isItemSelectable}
          getItemDataTest={it => String(it.country)}
          dragHandleTitle="Drag me!"
        />

        <Grid>
          <Row>
            <Col>
              <Pager
                total={total}
                pageSize={pageSize}
                currentPage={page}
                disablePageSizeSelector
                onPageChange={this.onPageChange}
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
              <Button onClick={() => this.setState({data: [...data]})}>
                Recreate data array
              </Button>
              {page === 1 && data.length > 5 && (
                <>
                  {' '}
                  <span id="button-select-bulgaria">
                    {selection.isSelected(data[3])
                      ? (
                        <Button
                          onClick={() => this.setState({selection: selection.deselect(data[3])})}
                        >
                          Deselect {data[3].country}
                        </Button>
                      )
                      : (
                        <Button
                          onClick={() => this.setState({selection: selection.select(data[3])})}
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
                          onClick={() => this.setState({selection: selection.deselect(data[5])})}
                        >
                          Deselect {data[5].country}
                        </Button>
                      )
                      : (
                        <Button
                          onClick={() => this.setState({selection: selection.select(data[5])})}
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
  }
}
export const basic: Story<BasicDemoProps> = args => <BasicDemo {...args}/>;
basic.args = {
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
basic.argTypes = {
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
basic.storyName = 'basic';

const data1 = continents;
const data2 = countries;

class MultiTableDemo extends Component {
  state = {
    selection1: new Selection({data: data1}),
    selection2: new Selection({data: data2})
  };

  columns1 = [
    {
      id: 'continent',
      title: 'Continent'
    },
    {
      id: 'url',
      title: 'URL'
    }
  ];

  columns2 = [
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

  render() {
    return (
      <MultiTable>
        <Table
          data={data1}
          columns={this.columns1}
          caption="Continents"
          selection={this.state.selection1}
          onSelect={selection => this.setState({selection1: selection})}
        />

        <Table
          data={data2}
          columns={this.columns2}
          caption="Countries"
          autofocus
          selection={this.state.selection2}
          onSelect={selection => this.setState({selection2: selection})}
        />
      </MultiTable>
    );
  }
}
export const multiTable = () => <MultiTableDemo/>;
multiTable.storyName = 'multi table';

class EmptyTableDemo extends Component<TableAttrs<SelectionItem>> {
  state = {
    selection: new Selection({})
  };

  render() {
    const {onSelect, ...restProps} = this.props;

    return (
      <Table
        {...restProps}
        selection={this.state.selection}
        onSelect={selection => {
          onSelect?.(selection);
          this.setState({selection});
        }}
      />
    );
  }
}

export const emptyTable: Story<TableAttrs<SelectionItem>> = args => <EmptyTableDemo {...args}/>;
emptyTable.args = {
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
emptyTable.storyName = 'empty table';
