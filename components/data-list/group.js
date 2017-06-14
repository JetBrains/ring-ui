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
  className?: string,
  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,
  showMoreLessButton: boolean,
  fullyShown: boolean,
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
    fullyShown: true,
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

  render(): Element<any> {
    const {
      title, items, onItemCollapse, onItemExpand,
      isItemCollapsed, showMoreLessButton, fullyShown,
      showFocus, selection, selectable, selected
    } = this.props;

    let moreLessButton;
    if (showMoreLessButton) {
      if (fullyShown) {
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
    } else {
      moreLessButton = null;
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
            {items.map(item => {
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
            })}

            {
              moreLessButton ? (
                <li className={styles.item} style={{marginLeft: '27px'}}>{moreLessButton}</li>
              ) : null
            }
          </ul>
        ) : null}
      </li>
    );
  }
}
