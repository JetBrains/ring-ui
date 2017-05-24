/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';

import Link from '../link/link';
import Text from '../text/text';

import Item from './item';
import type {GroupType, ItemType} from './types';
import styles from './data-list.css';

type Props = {
  group: GroupType,
  title: string,
  items: ItemType[],
  className?: string,
  onItemCollapse: ItemType => void,
  onItemExpand: ItemType => void,
  isItemCollapsed: ItemType => boolean,
  showMoreLessButton: boolean,
  fullyShown: boolean,
  onGroupShowMore: GroupType => void,
  onGroupShowLess: GroupType => void
};

export default class Group extends PureComponent {
  static defaultProps = {
    onItemCollapse: item => {},
    onItemExpand: item => {},
    isItemCollapsed: item => true,
    showMoreLessButton: false,
    fullyShown: true,
    onGroupShowMore: group => {},
    onGroupShowLess: group => {}
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

  render(): Element<any> {
    const {
      title, items, onItemCollapse, onItemExpand,
      isItemCollapsed, showMoreLessButton, fullyShown
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
                collapsed={isItemCollapsed(item)}
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
