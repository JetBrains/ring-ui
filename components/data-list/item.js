/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';

import Link from '../link/link';
import Text from '../text/text';
import LoaderInline from '../loader-inline/loader-inline';

import {
  ChevronRightIcon,
  ChevronDownIcon
} from '../icon';

import Selection from './selection';
import Title from './title';
import type {ItemType} from './types';
import styles from './data-list.css';

export const moreLessButtonStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};

const ITEM_LEFT_OFFSET = 32;
const LIST_LEFT_OFFSET = 24;

export type MoreLessButtonState = typeof moreLessButtonStates.UNUSED |
  typeof moreLessButtonStates.MORE | typeof moreLessButtonStates.MORE_LOADING |
  typeof moreLessButtonStates.LESS;

type Props = {
  item: any,
  title: string,
  items: any[],
  className?: string,
  level: number,
  parentShift: number,

  itemFormatter: (item: any) => ItemType,

  collapsible: boolean,
  collapsed: boolean,
  onCollapse: () => void,
  onExpand: () => void,

  showFocus: boolean,
  onFocus: (item: ItemType) => void,

  selection: Selection,
  selectable: boolean,
  selected: boolean,
  onSelect: (item: ItemType, selected: boolean) => void,

  showMoreLessButton: MoreLessButtonState,
  onItemMoreLess: (item?: ItemType, more?: boolean) => void
};

export default class Item extends PureComponent {
  static defaultProps = {
    items: [],
    level: 0,
    parentShift: 0,
    showMoreLessButton: moreLessButtonStates.UNUSED,
    onItemMoreLess: () => {}
  };

  props: Props;

  onShowMore = (): void => {
    const {onItemMoreLess, item} = this.props;
    onItemMoreLess(item, true);
  };

  onShowLess = (): void => {
    const {onItemMoreLess, item} = this.props;
    onItemMoreLess(item, false);
  };

  onFocus = (): void => {
    const {onFocus, item} = this.props;
    onFocus(item);
  };

  onSelect = (selected: boolean): void => {
    const {onSelect, item} = this.props;
    onSelect(item, selected);
  };

  renderItem = (model: any, parentShift: number): Element<any> => {
    const {
      onFocus, onSelect, selection, level,
      itemFormatter
    } = this.props;

    const item = itemFormatter(model);

    return (
      <Item
        key={item.id}
        item={model}
        title={item.title}
        items={item.items}
        level={level + 1}
        parentShift={parentShift}

        itemFormatter={itemFormatter}

        collapsible={item.collapsible}
        collapsed={item.collapsed}
        onCollapse={item.onCollapse}
        onExpand={item.onExpand}

        focused={selection.isFocused(model)}
        showFocus={selection.isFocused(model)}
        onFocus={onFocus}

        selection={selection}
        selectable={item.selectable}
        selected={selection.isSelected(model)}
        onSelect={onSelect}
      />
    );
  };

  render(): Element<any> {
    const {
      title, items, showMoreLessButton,
      level, parentShift, showFocus,
      selectable, selected,
      collapsible, collapsed, onCollapse, onExpand
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
    if (collapsible) {
      if (collapsed) {
        collapserExpander = (
          <div
            className={styles.expanderBox}
            onClick={onExpand}
          >
            <ChevronRightIcon
              className={styles.collapseIcon}
              size={13}
              data-test="ring-data-list-expand"
            />
          </div>
        );
      } else {
        collapserExpander = (
          <div
            className={styles.expanderBox}
            onClick={onCollapse}
          >
            <ChevronDownIcon
              className={styles.collapseIcon}
              size={13}
              data-test="ring-data-list-collapse"
            />
          </div>
        );
      }
    }

    const itemIsEmpty = !items.length || (collapsible && collapsed);
    const offset = level * LIST_LEFT_OFFSET + ITEM_LEFT_OFFSET + parentShift;

    return (
      <li>
        <Title
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          collapserExpander={collapserExpander}
          onFocus={this.onFocus}
          onSelect={this.onSelect}
          offset={offset}
        />

        {!itemIsEmpty ? (
          <ul className={styles.itemContent}>
            {items.map(model => this.renderItem(model, parentShift))}

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
