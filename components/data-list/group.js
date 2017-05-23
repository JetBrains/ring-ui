/* @flow */

import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

import Item from './item';
import type {ItemType} from './types';
import styles from './data-list.css';

type Props = {
  title: string,
  items: ItemType[],
  className?: string,
  onItemCollapse?: ItemType => void,
  onItemExpand?: ItemType => void,
  isItemCollapsed?: ItemType => boolean,
  showMoreLessButton: any
};

export default class Group extends PureComponent {
  props: Props;

  render() {
    const {
      title, items, onItemCollapse, onItemExpand,
      isItemCollapsed, showMoreLessButton
    } = this.props;

    return (
      <li>
        <div className={styles.groupTitle}>{title}</div>

        {items.length ? (
          <ul className={styles.group}>
            {items.map(item => (
              <Item
                key={item.id}
                item={item}
                title={item.title}
                selectable={item.selectable}
                subitems={item.subitems}
                onExpand={onItemExpand}
                onCollapse={onItemCollapse}
                collapsed={isItemCollapsed && isItemCollapsed(item)}
              />
            ))}

            {
              showMoreLessButton ? (
                <li className={styles.item} style={{marginLeft: '27px'}}>{showMoreLessButton}</li>
              ) : null
            }
          </ul>
        ) : null}
      </li>
    );
  }
};


