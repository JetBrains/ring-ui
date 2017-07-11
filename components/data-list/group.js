/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';

import Link from '../link/link';
import Text from '../text/text';

import Selection from './selection';
import GroupTitle from './group-title';
import Item from './item';
import type {GroupType, ItemType} from './types';
import styles from './data-list.css';

type Props = {
  group: GroupType,
  title: string,
  items: ItemType[],
  moreItems: ItemType[],
  className?: string,
  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,
  showMoreLessButton: boolean,
  onGroupShowMore: (group?: GroupType) => void,
  onGroupShowLess: (group?: GroupType) => void,
  showFocus: boolean,
  onFocus: (groupOrItem: GroupType|ItemType) => void,
  onSelect: (groupOrItem: GroupType|ItemType, selected: boolean) => void,
  selection: Selection,
  selectable: boolean,
  selected: boolean
};

export default class Group extends PureComponent {
  static defaultProps = {
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,
    showMoreLessButton: false,
    onGroupShowMore: () => {},
    onGroupShowLess: () => {},
    selectable: false,
    selected: false,
    showFocus: false
  };

  props: Props;

  onShowMore = (): void => {
    const {onGroupShowMore, group} = this.props;
    onGroupShowMore(group);
  }

  onShowLess = (): void => {
    const {onGroupShowLess, group} = this.props;
    onGroupShowLess(group);
  }

  onFocus = (): void => {
    const {onFocus, group} = this.props;
    onFocus(group);
  }

  onItemFocus = (item: ItemType): void => {
    const {onFocus} = this.props;
    onFocus(item);
  }

  onSelect = (selected: boolean): void => {
    const {onSelect, group} = this.props;
    onSelect(group, selected);
  }

  onItemSelect = (item: ItemType, selected: boolean): void => {
    const {onSelect} = this.props;
    onSelect(item, selected);
  }

  renderItem = (item: ItemType): Element<any> => {
    const {
      onItemCollapse, onItemExpand, isItemCollapsed,
      selection
    } = this.props;

    const onFocus = () => {
      this.onItemFocus(item);
    };

    const onSelect = _selected => {
      this.onItemSelect(item, _selected);
    };

    return (
      <Item
        key={item.id}
        item={item}
        title={item.title}
        selectable={item.selectable}
        selected={selection.isSelected(item)}
        subitems={item.subitems}
        onExpand={onItemExpand}
        onCollapse={onItemCollapse}
        collapsed={isItemCollapsed(item)}
        focused={selection.isFocused(item)}
        showFocus={selection.isFocused(item)}
        onFocus={onFocus}
        onSelect={onSelect}
      />
    );
  }

  render(): Element<any> {
    const {
      title, items, moreItems, showMoreLessButton,
      showFocus, selectable, selected
    } = this.props;

    let moreLessButton;
    if (moreItems.length) {
      moreLessButton = (
        <Text comment={true}>
          <Link
            inherit={true}
            pseudo={true}
            onClick={this.onShowLess}
          >Show less</Link>
        </Text>
      );
    } else {
      moreLessButton = (
        <Text comment={true}>
          <Link
            inherit={true}
            pseudo={true}
            onClick={this.onShowMore}
          >Show more</Link>
        </Text>
      );
    }

    return (
      <li>
        <GroupTitle
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          onFocus={this.onFocus}
          onSelect={this.onSelect}
        />

        {items.length ? (
          <ul className={styles.group}>
            {items.map(item => this.renderItem(item))}

            {showMoreLessButton
              ? <li className={styles.showMore}>{moreLessButton}</li>
              : null
            }

            {moreItems
              ? moreItems.map(item => this.renderItem(item))
              : null
            }
          </ul>
        ) : null}
      </li>
    );
  }
}
