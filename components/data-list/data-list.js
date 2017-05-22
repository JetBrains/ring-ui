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

import Link from '../link/link';
import Text from '../text/text';

import Item from './item';
import type {ItemType, GroupType} from './types';
import styles from './data-list.css';

type Props = {
  data: GroupType[],
  className?: string,
  onItemCollapse?: ItemType => void,
  onItemExpand?: ItemType => void,
  isItemCollapsed?: ItemType => boolean,
  groupItemsLimit?: number,
  onGroupShowMore?: GroupType => void,
  onGroupShowLess?: GroupType => void,
  isGroupFullyShown?: GroupType => boolean
};

export default class DataList extends PureComponent {
  props: Props;

  static propTypes = {
    data: PropTypes.array.isRequired,
    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isItemCollapsed: PropTypes.func,
    groupItemsLimit: PropTypes.number,
    onGroupShowMore: PropTypes.func,
    onGroupShowLess: PropTypes.func,
    isGroupFullyShown: PropTypes.func
  };

  defaultProps = {
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,
    groupItemsLimit: Infinity,
    onGroupShowMore: () => {},
    onGroupShowLess: () => {},
    isGroupFullyShown: () => false
  };

  render(): Element<any> {
    const {
      data, className,
      onItemCollapse, onItemExpand, isItemCollapsed,
      //groupItemsLimit,
      onGroupShowMore, onGroupShowLess, isGroupFullyShown
    } = this.props;

    const groupItemsLimit = this.props.groupItemsLimit || Infinity;

    return (
      <ul className={classNames(styles.dataList, className)}>
        {data.map(group => {
          const {id, title, items} = group;

          const fullyShown = isGroupFullyShown && isGroupFullyShown(group);

          let itemsToShow;
          if (!fullyShown && items.length > groupItemsLimit + 1) {
            itemsToShow = [...items].splice(0, groupItemsLimit);
          } else {
            itemsToShow = [...items];
          }

          let showMoreLessButton;
          if (items.length > groupItemsLimit + 1) {
            if (fullyShown) {
              showMoreLessButton = (
                <Text comment={true}>
                  <Link
                    inherit={true}
                    pseudo={true}
                    onClick={() => onGroupShowLess && onGroupShowLess(group)}
                  >Show less</Link>
                </Text>
              );
            } else {
              showMoreLessButton = (
                <Text comment={true}>
                  <Link
                    inherit={true}
                    pseudo={true}
                    onClick={() => onGroupShowMore && onGroupShowMore(group)}
                  >Show more</Link>
                </Text>
              );
            }
          } else {
            showMoreLessButton = null;
          }

          return (
            <li key={id}>
              <div className={styles.groupTitle}>{title}</div>

              {itemsToShow.length ? (
                <ul className={styles.group}>
                  {itemsToShow.map(item => (
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
          )
        })}
      </ul>
    );
  }
}
