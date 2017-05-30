/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

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
  focused: boolean,
  onFocus: (groupOrItem: GroupType|ItemType) => void,
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
    focused: false,
    selectable: false,
    selected: false
  };

  props: Props;

  onShowMore = () => {
    const {onGroupShowMore, group} = this.props;
    onGroupShowMore(group);
  }

  onShowLess = () => {
    const {onGroupShowLess, group} = this.props;
    onGroupShowLess(group);
  }

  onFocus = () => {
    const {onFocus, group} = this.props;
    onFocus(group);
  }

  onItemFocus = (item: ItemType) => {
    const {onFocus, group} = this.props;
    onFocus(item);
  }

  render(): Element<any> {
    const {
      title, items, onItemCollapse, onItemExpand,
      isItemCollapsed, showMoreLessButton, fullyShown,
      focused, selection, selectable, selected
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

    const classes = classNames(this.props.className, {
      [styles.groupTitle]: true,
      [styles.groupTitleFocused]: focused
    });

    return (
      <li>
        <GroupTitle
          title={title}
          focused={focused}
          selectable={selectable}
          selected={selected}
          onFocus={this.onFocus}
        />

        {items.length ? (
          <ul className={styles.group}>
            {items.map(item => (
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
                onFocus={() => this.onItemFocus(item)}
              />
            ))}

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
