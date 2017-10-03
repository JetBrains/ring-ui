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
import type {ItemType} from './types';
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
  item: ItemType,
  title: string,
  items?: ItemType[],
  className?: string,
  theFirstLevel?: boolean,

  collapsible: boolean,
  collapsed: boolean,
  onCollapse: (item?: ItemType) => void,
  onExpand: (item?: ItemType) => void,

  isCollapsed: (item?: ItemType) => boolean,
  isCollapsible: (item?: ItemType) => boolean,

  showFocus: boolean,
  onFocus: (item: ItemType) => void,

  selection: Selection,
  selectable: boolean,
  selected: boolean,
  onSelect: (item: ItemType, selected: boolean) => void,

  showMoreLessButton: MoreLessButtonState,
  onItemMoreLess: (item?: ItemType, more?: boolean) => void
};

export default class Group extends PureComponent {
  static defaultProps = {
    items: [],
    theFirstLevel: false,
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

  onItemFocus = (item: ItemType): void => {
    const {onFocus} = this.props;
    onFocus(item);
  };

  onSelect = (selected: boolean): void => {
    const {onSelect, item} = this.props;
    onSelect(item, selected);
  };

  onItemSelect = (item: ItemType, selected: boolean): void => {
    const {onSelect} = this.props;
    onSelect(item, selected);
  };

  onCollapse = (): void => {
    const {item, onCollapse} = this.props;
    onCollapse(item);
  }

  onExpand = (): void => {
    const {item, onExpand} = this.props;
    onExpand(item);
  }

  renderItem = (item: ItemType): Element<any> => {
    const {
      onCollapse, onExpand,
      isCollapsed, isCollapsible,
      selection
    } = this.props;

    const onFocus = () => {
      this.onItemFocus(item);
    };

    const onSelect = _selected => {
      this.onItemSelect(item, _selected);
    };

    return (
      <Group
        key={item.id}
        item={item}
        title={item.title}
        items={item.items}

        collapsible={isCollapsible(item)}
        collapsed={isCollapsed(item)}
        onCollapse={onCollapse}
        onExpand={onExpand}
        isCollapsed={isCollapsed}
        isCollapsible={isCollapsible}

        focused={selection.isFocused(item)}
        showFocus={selection.isFocused(item)}
        onFocus={onFocus}

        selection={selection}
        selectable={item.selectable}
        selected={selection.isSelected(item)}
        onSelect={onSelect}
      />
    );
  };

  render(): Element<any> {
    const {
      title, items, showMoreLessButton,
      theFirstLevel, showFocus,
      selectable, selected,
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

    const itemIsEmpty = !items.length || (collapsible && collapsed);

    return (
      <li
        className={classNames(styles.group, {
          [styles.groupShifted]: selectable && collapserExpander,
          [styles.groupEmpty]: theFirstLevel && itemIsEmpty,
          [styles.groupFocused]: showFocus,
          [styles.groupNested]: !theFirstLevel
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

        {!itemIsEmpty ? (
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
