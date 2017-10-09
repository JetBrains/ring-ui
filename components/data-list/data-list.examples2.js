/* @flow */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock, {moreItems} from './data-list.mock';

import {moreLessButtonStates} from './item';

class DataListDemo extends PureComponent {
  state = {
    data: mock,
    selection: new Selection({data: mock, isItemSelectable: item => item.selectable})
  };

  expandedItems = new Set();

  moreExpandebleItems = new Set([mock[0].id]);
  moreExpandedItems = new Set();

  isItemCollapsed = item => !this.expandedItems.has(item);
  isItemCollapsible = item => item.collapsible;

  onItemExpand = item => {
    this.expandedItems.add(item);
    this.setState({data: [...this.state.data]});
  };

  onItemCollapse = item => {
    this.expandedItems.delete(item);
    this.setState({data: [...this.state.data]});
  };

  itemMoreLessState = item => {
    if (this.moreExpandebleItems.has(item.id)) {
      return this.moreExpandedItems.has(item.id)
        ? moreLessButtonStates.LESS
        : moreLessButtonStates.MORE;
    } else {
      return moreLessButtonStates.UNUSED;
    }
  };

  onItemMoreLess = (item, more) => {
    if (more) {
      this.moreExpandedItems.add(item.id);
      item.items = item.items.concat([...moreItems]);
    } else {
      this.moreExpandedItems.delete(item.id);
      item.items = item.items.slice(0, item.items.length - moreItems.length);
    }

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
        isItemCollapsible={this.isItemCollapsible}

        onItemMoreLess={this.onItemMoreLess}
        itemMoreLessState={this.itemMoreLessState}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);
