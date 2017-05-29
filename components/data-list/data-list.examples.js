/* @flow */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock from './data-list.mock';

class DataListDemo extends PureComponent {
  state = {
    data: mock,
    selection: new Selection({data: mock})
  };

  expandedItems = new Set();

  onItemExpand = item => {
    this.expandedItems.add(item);
    this.setState({data: [...this.state.data]});
  };

  onItemCollapse = item => {
    this.expandedItems.delete(item);
    this.setState({data: [...this.state.data]});
  };

  isItemCollapsed = item => !this.expandedItems.has(item);

  onSelect = selection => {
    console.log('onSelect', selection, [...selection.getActive()][0]);
    this.setState({selection});
  };

  render() {
    return (
      <DataList
        data={this.state.data}
        onItemCollapse={this.onItemCollapse}
        onItemExpand={this.onItemExpand}
        isItemCollapsed={this.isItemCollapsed}
        selection={this.state.selection}
        onSelect={this.onSelect}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);
