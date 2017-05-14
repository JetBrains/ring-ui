/* @flow */

import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DataList from './data-list';

import mock from './data-list.mock';

class DataListDemo extends PureComponent {
  state = {
    data: mock
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

  render() {
    return (
      <DataList
        data={this.state.data}
        onItemCollapse={this.onItemCollapse}
        onItemExpand={this.onItemExpand}
        isItemCollapsed={this.isItemCollapsed}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo />, container);
