/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';

import Link from '../link/link';
import Text from '../text/text';
import LoaderInline from '../loader-inline/loader-inline';

import Selection from './selection';
import GroupTitle from './group-title';
import Item from './item';
import type {GroupType, ItemType} from './types';
import styles from './data-list.css';

export const moreLessButtonStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};

export type MoreLessButtonState = $Keys<typeof moreLessButtonStates>; // eslint-disable-line no-undef

type Props = {
  group: GroupType,
  title: string,
  items: ItemType[],
  className?: string,
  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,
  showMoreLessButton: MoreLessButtonState,
  onGroupMoreLess: (group?: GroupType) => void,
  showFocus: boolean,
  onFocus: (groupOrItem: GroupType|ItemType) => void,
  onSelect: (groupOrItem: GroupType|ItemType, selected: boolean) => void,
  selection: Selection,
  selectable: boolean,
  selected: boolean
};

export default class Group extends PureComponent {
  static defaultProps = {
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,
    showMoreLessButton: moreLessButtonStates.UNUSED,
    onGroupMoreLess: () => {},
    selectable: false,
    selected: false,
    showFocus: false,
    hasMoreItems: false
  };

  props: Props;

  onShowMore = (): void => {
    const {onGroupMoreLess, group} = this.props;
    onGroupMoreLess(group, true);
  }

  onShowLess = (): void => {
    const {onGroupMoreLess, group} = this.props;
    onGroupMoreLess(group, false);
  }

  onFocus = (): void => {
    const {onFocus, group} = this.props;
    onFocus(group);
  }

  onItemFocus = (item: ItemType): void => {
    const {onFocus} = this.props;
    onFocus(item);
  }

  onSelect = (selected: boolean): void => {
    const {onSelect, group} = this.props;
    onSelect(group, selected);
  }

  onItemSelect = (item: ItemType, selected: boolean): void => {
    const {onSelect} = this.props;
    onSelect(item, selected);
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
  }

  render(): Element<any> {
    const {
      title, items, showMoreLessButton,
      showFocus, selectable, selected
    } = this.props;

    let moreLessButton;
    if (showMoreLessButton === moreLessButtonStates.MORE ||
      showMoreLessButton === moreLessButtonStates.MORE_LOADING) {
      moreLessButton = (
        <Text comment={true}>
          <Link
            inherit={true}
            pseudo={true}
            onClick={this.onShowMore}
          >Show more</Link>
          {showMoreLessButton === moreLessButtonStates.MORE_LOADING &&
            <LoaderInline className={styles.showMoreLoader}/>
          }
        </Text>
      );
    } else if (showMoreLessButton === moreLessButtonStates.LESS) {
      moreLessButton = (
        <Text comment={true}>
          <Link
            inherit={true}
            pseudo={true}
            onClick={this.onShowLess}
          >Show less</Link>
        </Text>
      );
    }

    return (
      <li>
        <GroupTitle
          title={title}
          focused={showFocus}
          showFocus={showFocus}
          selectable={selectable}
          selected={selected}
          onFocus={this.onFocus}
          onSelect={this.onSelect}
        />

        {items.length ? (
          <ul className={styles.group}>
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
