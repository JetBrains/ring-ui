/* @flow */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable modules/no-mix-default-named */

/**
  * @name Data List
  * @category Components
  * @framework React
  * @extends {PureComponent}
  * @description TODO add Data List description
  * @example-file ./data-list.examples.html
  */

import React, {PureComponent, Element} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Item from './item';
import type {ItemType, GroupType} from './types';
import styles from './data-list.css';

type Props = {
  data: GroupType[],
  className?: string,
  onItemCollapse?: ItemType => void,
  onItemExpand?: ItemType => void,
  isItemCollapsed?: ItemType => boolean
};

export default class DataList extends PureComponent {
  props: Props;

  static propTypes = {
    data: PropTypes.array.isRequired
  };

  defaultProps = {
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => {}
  };

  render(): Element<any> {
    const {data, className, onItemCollapse, onItemExpand, isItemCollapsed} = this.props;

    return (
      <ul className={classNames(styles.dataList, className)}>
        {data.map(group => (
          <li key={group.id}>

            <div className={styles.groupTitle}>{group.title}</div>

            {group.items.length ? (
              <ul className={styles.group}>
                {group.items.map(item => (
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
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
}
