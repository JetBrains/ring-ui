import {PureComponent} from 'react';

import TableSelection from '../table/selection';

import DataList from './data-list';
import Selection from './selection';
import {FormattedItem, moreLessButtonStates} from './item';
import mock, {Item, moreItems} from './data-list.mock';

export default {
  title: 'Components/DataList',

  parameters: {
    notes: 'A component for rendering interactive hierarchical tables.',
  },
};

export const basic = () => {
  class DataListDemo extends PureComponent {
    // state uses getChildren
    // eslint-disable-next-line react/sort-comp
    expandedItems = new Set();
    isItemCollapsible = (item: Item) => item.collapsible && item.items && Number(item.id) > 10;
    isItemCollapsed = (item: Item) => !this.expandedItems.has(item.id);

    getChildren = (item: Item) => {
      const collapsible = this.isItemCollapsible(item);
      const collapsed = this.isItemCollapsed(item);
      return (collapsible && collapsed) || !item.items ? [] : item.items;
    };

    state = {
      data: mock,
      selection: new Selection({
        data: mock,
        isItemSelectable: item => item.selectable,
        getChildren: this.getChildren,
      }),
    };

    moreExpandableItems = new Set([mock[0].id]);
    moreExpandedItems = new Set();

    itemMoreLessState = (item: FormattedItem<Item>) => {
      if (item.id != null && this.moreExpandableItems.has(item.id)) {
        return this.moreExpandedItems.has(item.id) ? moreLessButtonStates.LESS : moreLessButtonStates.MORE;
      } else {
        return moreLessButtonStates.UNUSED;
      }
    };

    onItemMoreLess = (item: Item, more: boolean) => {
      if (more) {
        this.moreExpandedItems.add(item.id);
        item.items = item.items ?? [];
        item.items = item.items.concat([...moreItems]);
      } else {
        this.moreExpandedItems.delete(item.id);
        item.items = item.items ?? [];
        item.items = item.items.slice(0, item.items.length - moreItems.length);
      }

      const data = this.state.data;
      this.setState({data: [...data]});
    };

    onSelect = (selection: TableSelection<Item>) => {
      this.setState({selection});
    };

    itemFormatter = (item: Item): FormattedItem<Item> => {
      const items = this.getChildren(item);
      const collapsible = this.isItemCollapsible(item);
      const collapsed = this.isItemCollapsed(item);

      const onCollapse = () => {
        this.expandedItems.delete(item.id);
        const data = this.state.data;
        this.setState({data: [...data]});
      };

      const onExpand = () => {
        this.expandedItems.add(item.id);
        const data = this.state.data;
        this.setState({data: [...data]});
      };

      return {
        ...item,
        items,
        collapsible,
        collapsed,
        onCollapse,
        onExpand,
      };
    };

    render() {
      return (
        <DataList
          data={this.state.data}
          selection={this.state.selection}
          onSelect={this.onSelect}
          itemFormatter={this.itemFormatter}
          onItemMoreLess={this.onItemMoreLess}
          itemMoreLessState={this.itemMoreLessState}
        />
      );
    }
  }

  return <DataListDemo />;
};

basic.storyName = 'DataList';
