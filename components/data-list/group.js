/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

import Link from '../link/link';
import Text from '../text/text';
import LoaderInline from '../loader-inline/loader-inline';

import {
  CollapseIcon,
  ExpandIcon
} from '../icon';

import Selection from './selection';
import Title from './title';
import Item from './item';
import type {GroupType, ItemType} from './types';
import styles from './data-list.css';

export const moreLessButtonStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};

export type MoreLessButtonState = typeof moreLessButtonStates.UNUSED |
  typeof moreLessButtonStates.MORE | typeof moreLessButtonStates.MORE_LOADING |
  typeof moreLessButtonStates.LESS;

type Props = {
  group: GroupType,
  title: string,
  items: ItemType[],
  className?: string,

  collapsible: boolean,
  collapsed: boolean,
  onCollapse: (item?: GroupType) => void,
  onExpand: (item?: GroupType) => void,

  onItemCollapse: (item?: GroupType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,

  showMoreLessButton: MoreLessButtonState,
  onItemMoreLess: (group?: GroupType, more?: boolean) => void,

  showFocus: boolean,
  onFocus: (groupOrItem: GroupType|ItemType) => void,

  onSelect: (groupOrItem: GroupType|ItemType, selected: boolean) => void,
  selection: Selection,
  selectable: boolean,
  selected: boolean
};

export default class Group extends PureComponent {
  static defaultProps = {
    collapsible: false,
    collapsed: true,
    onCollapse: () => {},
    onExpand: () => {},

    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,

    showMoreLessButton: moreLessButtonStates.UNUSED,
    onItemMoreLess: () => {},

    showFocus: false,

    selectable: false,
    selected: false
  };

  props: Props;

  onShowMore = (): void => {
    const {onItemMoreLess, group} = this.props;
    onItemMoreLess(group, true);
  };

  onShowLess = (): void => {
    const {onItemMoreLess, group} = this.props;
    onItemMoreLess(group, false);
  };

  onFocus = (): void => {
    const {onFocus, group} = this.props;
    onFocus(group);
  };

  onItemFocus = (item: ItemType): void => {
    const {onFocus} = this.props;
    onFocus(item);
  };

  onSelect = (selected: boolean): void => {
    const {onSelect, group} = this.props;
    onSelect(group, selected);
  };

  onItemSelect = (item: ItemType, selected: boolean): void => {
    const {onSelect} = this.props;
    onSelect(item, selected);
  };

  onCollapse = (): void => {
    const {group, onCollapse} = this.props;
    onCollapse(group);
  }

  onExpand = (): void => {
    const {group, onExpand} = this.props;
    onExpand(group);
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
  };

  render(): Element<any> {
    const {
      title, items, showMoreLessButton,
      showFocus, selectable, selected,
      collapsible, collapsed
    } = this.props;

    let moreLessButton;
    if (showMoreLessButton === moreLessButtonStates.MORE ||
      showMoreLessButton === moreLessButtonStates.MORE_LOADING) {
      moreLessButton = (
        <Text comment>
          <Link
            inherit
            pseudo
            onClick={this.onShowMore}
          >Show more</Link>
          {showMoreLessButton === moreLessButtonStates.MORE_LOADING &&
            <LoaderInline className={styles.showMoreLoader}/>
          }
        </Text>
      );
    } else if (showMoreLessButton === moreLessButtonStates.LESS) {
      moreLessButton = (
        <Text comment>
          <Link
            inherit
            pseudo
            onClick={this.onShowLess}
          >Show less</Link>
        </Text>
      );
    }

    let collapserExpander = null;
    if (collapsible && items.length) {
      if (collapsed) {
        collapserExpander = (
          <ExpandIcon
            className={styles.collapseIcon}
            size={13}
            onClick={this.onExpand}
          />
        );
      } else {
        collapserExpander = (
          <CollapseIcon
            className={styles.collapseIcon}
            size={13}
            onClick={this.onCollapse}
          />
        );
      }
    }

    const groupIsEmpty = !items.length || (collapsible && collapsed);

    return (
      <li
        className={classNames(styles.group, {
          [styles.groupShifted]: selectable && collapserExpander,
          [styles.groupEmpty]: groupIsEmpty,
          [styles.groupFocused]: showFocus
        })}
      >
        <Title
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          collapserExpander={collapserExpander}
          onFocus={this.onFocus}
          onSelect={this.onSelect}
        />

        {!groupIsEmpty ? (
          <ul className={styles.groupContent}>
            {items.map(item => this.renderItem(item))}

            {showMoreLessButton !== moreLessButtonStates.UNUSED
              ? <li className={styles.showMore}>{moreLessButton}</li>
              : null
            }
          </ul>
        ) : null}
      </li>
    );
  }
}
