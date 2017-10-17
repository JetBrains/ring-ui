/* @flow */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/sort-comp */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock, {moreItems} from './data-list.mock';

import {moreLessStates} from './types';

class DataListDemo extends PureComponent {
  expandedItems = new Set();
  moreExpandedItems = new Set();

  isItemCollapsible = item => item.collapsible && item.items && item.id > 10;
  isItemCollapsed = item => !this.expandedItems.has(item.id);

  getKey = item => item.id;

  getChildren = item => {
    const collapsible = this.isItemCollapsible(item);
    const collapsed = this.isItemCollapsed(item);
    return ((collapsible && collapsed) || !item.items) ? [] : item.items;
  };

  isItemSelectable = item => item.selectable;

  state = {
    data: mock,
    selection: new Selection({
      data: mock,
      getKey: this.getKey,
      getChildren: this.getChildren,
      isItemSelectable: this.isItemSelectable
    })
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

  itemFormatter = item => {
    const onCollapse = () => {
      this.expandedItems.delete(item.id);
      this.setState({data: [...this.state.data]});
    };

    const onExpand = () => {
      this.expandedItems.add(item.id);
      this.setState({data: [...this.state.data]});
    };

    let moreLessState = moreLessStates.UNUSED;
    if (item.moreLess) {
      if (this.moreExpandedItems.has(item.id)) {
        moreLessState = moreLessStates.LESS;
      } else {
        moreLessState = moreLessStates.MORE;
      }
    }

    return {
      key: this.getKey(item),
      title: item.title,
      children: this.getChildren(item),
      selectable: this.isItemSelectable(item),
      collapsible: this.isItemCollapsible(item),
      collapsed: this.isItemCollapsed(item),
      moreLessState,
      onCollapse,
      onExpand
    };
  };

  render() {
    return (
      <DataList
        data={this.state.data}
        itemFormatter={this.itemFormatter}
        selection={this.state.selection}
        onSelect={this.onSelect}
        onItemMoreLess={this.onItemMoreLess}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);
