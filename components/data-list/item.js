/* @flow */
import React, {PureComponent, Element} from 'react';

import {
  CollapseIcon,
  ExpandIcon
} from '../icon';

import type {ItemType} from './types';
import Title from './title';
import styles from './data-list.css';

type Props = {
  className?: string,
  item: ItemType,
  title: string,
  selectable: boolean,
  selected: boolean,
  items: ItemType[],
  collapsed: boolean,
  onCollapse: (item?: ItemType) => void,
  onExpand: (item?: ItemType) => void,
  onSelect: (selected: boolean) => void,
  onFocus: () => void,
  showFocus: boolean
};

export default class Item extends PureComponent {
  static defaultProps = {
    selectable: false,
    selected: false,
    items: [],
    collapsed: true,
    onCollapse: () => {},
    onExpand: () => {},
    onFocus: () => {},
    showFocus: false
  };

  props: Props;

  onCollapse = (): void => {
    const {item, onCollapse} = this.props;
    onCollapse(item);
  };

  onExpand = (): void => {
    const {item, onExpand} = this.props;
    onExpand(item);
  };

  render(): Element<any> {
    const {
      title, selectable, selected, items,
      collapsed, onFocus, showFocus, onSelect
    } = this.props;

    let collapserExpander = null;
    if (items.length) {
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

    return (
      <li className={styles.item}>
        <Title
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          collapserExpander={collapserExpander}
          onFocus={onFocus}
          onSelect={onSelect}
        />

        {items.length && !collapsed ? (
          <ul className={styles.subgroup}>
            {items.map(item => (
              <li key={item.id} className={styles.subitem}>{item.title}</li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  }
}
