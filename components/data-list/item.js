/* @flow */
import React, {PureComponent, Element} from 'react';
import CollapseIcon from '@jetbrains/icons/collapse.svg';
import ExpandIcon from '@jetbrains/icons/expand.svg';

import type {SubitemType, ItemType} from './types';
import ItemTitle from './item-title';
import styles from './data-list.css';

type Props = {
  className?: string,
  item: ItemType,
  title: string,
  selectable: boolean,
  selected: boolean,
  subitems: SubitemType[],
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
    subitems: [],
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
  }

  onExpand = (): void => {
    const {item, onExpand} = this.props;
    onExpand(item);
  }

  render(): Element<any> {
    const {
      title, selectable, selected, subitems,
      collapsed, onFocus, showFocus, onSelect
    } = this.props;

    let collapserExpander = null;
    if (subitems.length) {
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
        <ItemTitle
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          collapserExpander={collapserExpander}
          onFocus={onFocus}
          onSelect={onSelect}
        />

        {subitems.length && !collapsed
          ? (
            <ul className={styles.subgroup}>
              {subitems.map(subitem => (
                <li key={subitem.id} className={styles.subitem}>{subitem.title}</li>
              ))}
            </ul>
          ) : null
        }
      </li>
    );
  }
}
