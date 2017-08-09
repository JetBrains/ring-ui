/* @flow */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock, {moreItems} from './data-list.mock';

import {moreLessButtonStates} from './group';

class DataListDemo extends PureComponent {
  state = {
    data: mock,
    selection: new Selection({data: mock, isItemSelectable: item => item.selectable})
  };

  expandedItems = new Set();

  moreExpandebleGroups = new Set([mock[0].id]);
  moreExpandedGroups = new Set();

  onItemExpand = item => {
    this.expandedItems.add(item);
    this.setState({data: [...this.state.data]});
  };

  onItemCollapse = item => {
    this.expandedItems.delete(item);
    this.setState({data: [...this.state.data]});
  };

  isItemCollapsed = item => !this.expandedItems.has(item);

  groupMoreLessState = group => {
    if (this.moreExpandebleGroups.has(group.id)) {
      return this.moreExpandedGroups.has(group.id)
        ? moreLessButtonStates.LESS
        : moreLessButtonStates.MORE;
    } else {
      return moreLessButtonStates.UNUSED;
    }
  };

  onGroupMoreLess = (group, more) => {
    if (more) {
      this.moreExpandedGroups.add(group.id);
      group.items = group.items.concat([...moreItems]);
    } else {
      this.moreExpandedGroups.delete(group.id);
      group.items = group.items.slice(0, group.items.length - moreItems.length);
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

        onGroupMoreLess={this.onGroupMoreLess}
        groupMoreLessState={this.groupMoreLessState}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);
