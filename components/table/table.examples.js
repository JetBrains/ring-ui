import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import {Grid, Row, Col} from '../grid/grid';
import Link from '../link/link';
import Pager from '../pager/pager';
import Button from '../button/button';

import Table from './table';
import Selection from './selection';
import mock from './table.examples.json';

const PAGE_SIZE = 7;
const TOTAL = mock.length;

class TableDemo extends Component {
  state = {
    data: [],
    selection: new Selection(),
    caption: undefined,
    selectable: true,
    draggable: true,
    page: 1,
    pageSize: PAGE_SIZE,
    total: TOTAL,
    sortKey: 'country',
    sortOrder: true,
    loading: false
  }

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate(prevProps, prevState) {
    const {page, sortKey, sortOrder} = this.state;
    if (
      page !== prevState.page ||
      sortKey !== prevState.sortKey ||
      sortOrder !== prevState.sortOrder
    ) {
      this.loadPage();
    }
  }

  columns = [
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
      sortable: true
    },

    {
      id: 'url',
      title: 'URL',
      getValue: ({url}) => <Link href={url}>{url}</Link>
    }
  ]

  onSort = ({column: {id: sortKey}, order: sortOrder}) => {
    this.setState({sortKey, sortOrder});
  }

  onPageChange = page => {
    this.setState({page});
  }

  isItemSelectable(item) {
    return item.id !== 14;
  }

  loadPage = () => {
    const {page, pageSize, sortKey, sortOrder} = this.state;

    let data = [...mock];
    data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]) * (sortOrder ? 1 : -1));
    data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    const selection = new Selection({data, isItemSelectable: this.isItemSelectable});

    this.setState({data, selection});
  }

  render() {
    const {
      data, caption, selectable, draggable, loading, page,
      pageSize, total, selection, sortKey, sortOrder
    } = this.state;

    return (
      <div>
        <Table
          data={data}
          columns={this.columns}
          selection={selection}
          onSelect={newSelection => this.setState({selection: newSelection})}
          onReorder={({data: newData}) => this.setState({data: newData})}
          loading={loading}
          onSort={this.onSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
          caption={caption}
          selectable={selectable}
          isItemSelectable={this.isItemSelectable}
          draggable={draggable}
          autofocus
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
              <Button
                onClick={() => this.setState({data: [...data]})}
              >Recreate data array</Button>
              {' '}
              <span id="button-non-selectable">
                {
                  selectable
                    ? (
                      <Button
                        onClick={() => this.setState({selectable: false})}
                      >Non-selectable</Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({selectable: true})}
                      >Selectable</Button>
                    )
                }
              </span>

              {' '}
              {draggable
                ? <Button onClick={() => this.setState({draggable: false})}>Non-draggable</Button>
                : <Button onClick={() => this.setState({draggable: true})}>Draggable</Button>
              }
              {' '}

              <span id="button-with-a-caption">
                {' '}
                {
                  caption
                    ? (
                      <Button
                        onClick={() => this.setState({caption: undefined})}
                      >Without a caption</Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({caption: 'Countries'})}
                      >With a caption</Button>
                    )
                }
                {' '}
              </span>
              {' '}

              {
                loading
                  ? <Button onClick={() => this.setState({loading: false})}>Not loading</Button>
                  : <Button onClick={() => this.setState({loading: true})}>Loading</Button>
              }
            </Col>
          </Row>

          {page === 1 && data.length > 5 && (
            <Row>
              <Col>
                <span id="button-select-bulgaria">{
                  selection.isSelected(data[3])
                    ? (
                      <Button
                        onClick={() => this.setState({selection: selection.deselect(data[3])})}
                      >Deselect {data[3].country}</Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({selection: selection.select(data[3])})}
                      >Select {data[3].country}</Button>
                    )
                }
                </span>

                <span id="button-select-finland">{' '}
                  {selection.isSelected(data[5])
                    ? (
                      <Button
                        onClick={() => this.setState({selection: selection.deselect(data[5])})}
                      >Deselect {data[5].country}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => this.setState({selection: selection.select(data[5])})}
                      >Select {data[5].country}</Button>
                    )
                  }</span>
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

storiesOf('Components|Table', module).
  addDecorator(reactDecorator()).
  add('table', () => <TableDemo/>);
