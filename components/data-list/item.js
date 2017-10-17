/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';
import PropTypes from 'prop-types';
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
import {moreLessStates} from './types';
import type {MoreLessState} from './types';
import styles from './data-list.css';

const ITEM_LEFT_OFFSET = 30;

type Props = {
  model: any,
  title: string,
  items: any[],
  className?: string,
  level: number,
  parentShift?: number,

  collapsible: boolean,
  collapsed: boolean,
  onCollapse: () => void,
  onExpand: () => void,

  showFocus: boolean,

  selectable: boolean,
  selected: boolean,

  moreLessState: MoreLessState
};

export default class Item extends PureComponent {
  static defaultProps = {
    items: [],
    level: 0,
    parentShift: 0,
    moreLessState: moreLessStates.UNUSED
  };

  static contextTypes = {
    itemFormatter: PropTypes.func.isRequired,
    selection: PropTypes.instanceOf(Selection).isRequired,
    onSelect: PropTypes.func,
    onFocus: PropTypes.func,
    onItemMoreLess: PropTypes.func
  };

  props: Props;

  onShowMore = (): void => {
    this.context.onItemMoreLess(this.props.model, true);
  };

  onShowLess = (): void => {
    this.context.onItemMoreLess(this.props.model, false);
  };

  onFocus = (): void => {
    this.context.onFocus(this.props.model);
  };

  onSelect = (selected: boolean): void => {
    this.context.onSelect(this.props.model, selected);
  };

  renderItem = (model: any, parentShift: number): Element<any> => {
    const {level} = this.props;
    const {itemFormatter, selection} = this.context;
    const item = itemFormatter(model);

    const {
      key, title, children, selectable,
      collapsible, collapsed, onCollapse, onExpand
    } = item;

    return (
      <Item
        key={key}
        model={model}
        title={title}
        items={children}

        level={level + 1}
        parentShift={parentShift}

        collapsible={collapsible}
        collapsed={collapsed}
        onCollapse={onCollapse}
        onExpand={onExpand}

        focused={selection.isFocused(model)}
        showFocus={selection.isFocused(model)}

        selectable={selectable}
        selected={selection.isSelected(model)}
      />
    );
  };

  render(): Element<any> {
    const {
      title, items, moreLessState,
      level, parentShift, showFocus,
      selectable, selected,
      collapsible, collapsed, onCollapse, onExpand
    } = this.props;

    let moreLess;
    if (moreLessState === moreLessStates.MORE ||
      moreLessState === moreLessStates.MORE_LOADING) {
      moreLess = (
        <Text comment>
          <Link
            inherit
            pseudo
            onClick={this.onShowMore}
          >Show more</Link>
          {moreLessState === moreLessStates.MORE_LOADING &&
            <LoaderInline className={styles.showMoreLoader}/>
          }
        </Text>
      );
    } else if (moreLessState === moreLessStates.LESS) {
      moreLess = (
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
          <ExpandIcon
            className={styles.collapseIcon}
            size={13}
            onClick={onExpand}
          />
        );
      } else {
        collapserExpander = (
          <CollapseIcon
            className={styles.collapseIcon}
            size={13}
            onClick={onCollapse}
          />
        );
      }
    }

    const itemIsNested = level > 0;
    const itemIsEmpty = !items.length || (collapsible && collapsed);

    const offset = level * ITEM_LEFT_OFFSET + ITEM_LEFT_OFFSET + parentShift;
    const itemShift = ((selectable && collapserExpander) ? ITEM_LEFT_OFFSET : 0) + parentShift;

    return (
      <li
        className={classNames(styles.item, {
          [styles.itemEmpty]: itemIsEmpty && !itemIsNested,
          [styles.itemFocused]: showFocus,
          [styles.itemNested]: itemIsNested
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
          offset={offset}
        />

        {!itemIsEmpty ? (
          <ul className={styles.itemContent}>
            {items.map(model => this.renderItem(model, itemShift))}

            {moreLessState !== moreLessStates.UNUSED
              ? <li className={styles.showMore}>{moreLess}</li>
              : null
            }
          </ul>
        ) : null}
      </li>
    );
  }
}
