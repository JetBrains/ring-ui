/* @flow */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock from './data-list.mock';

class DataListDemo extends PureComponent {
  state = {
    data: mock,
    selection: new Selection({data: mock, isItemSelectable: item => item.selectable})
  };

  expandedItems = new Set();

  isItemCollapsed = item => !this.expandedItems.has(item);

  onItemExpand = item => {
    this.expandedItems.add(item);
    this.setState({data: [...this.state.data]});
  };

  onItemCollapse = item => {
    this.expandedItems.delete(item);
    this.setState({data: [...this.state.data]});
  };

  onSelect = selection => {
    this.setState({selection});
  };

  render() {
    return (
      <DataList
        data={this.state.data}
        selection={this.state.selection}
        onSelect={this.onSelect}

        onItemCollapse={this.onItemCollapse}
        onItemExpand={this.onItemExpand}
        isItemCollapsed={this.isItemCollapsed}

        groupsAreCollapsible
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);
