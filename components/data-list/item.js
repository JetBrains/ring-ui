/* eslint-disable react/jsx-no-literals */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import chevronRightIcon from '@jetbrains/icons/chevron-right.svg';
import chevronDownIcon from '@jetbrains/icons/chevron-down.svg';

import Link from '../link/link';
import Text from '../text/text';
import LoaderInline from '../loader-inline/loader-inline';

import Icon from '../icon';

import Title from './title';

import styles from './data-list.css';

export const moreLessButtonStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};

const ITEM_LEFT_OFFSET = 32;
const LIST_LEFT_OFFSET = 24;


export default class Item extends PureComponent {
  static propTypes = {
    item: PropTypes.object,
    title: PropTypes.node,
    items: PropTypes.array,
    className: PropTypes.string,
    level: PropTypes.number,
    parentShift: PropTypes.number,

    itemFormatter: PropTypes.func,

    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,

    showFocus: PropTypes.bool,
    onFocus: PropTypes.func,

    selection: PropTypes.object,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,

    showMoreLessButton: PropTypes.number,
    onItemMoreLess: PropTypes.func
  };

  static defaultProps = {
    items: [],
    level: 0,
    parentShift: 0,
    showMoreLessButton: moreLessButtonStates.UNUSED,
    onItemMoreLess: () => {}
  };


  onShowMore = () => {
    const {onItemMoreLess, item} = this.props;
    onItemMoreLess(item, true);
  };

  onShowLess = () => {
    const {onItemMoreLess, item} = this.props;
    onItemMoreLess(item, false);
  };

  onFocus = () => {
    const {onFocus, item} = this.props;
    onFocus(item);
  };

  onSelect = selected => {
    const {onSelect, item} = this.props;
    onSelect(item, selected);
  };

  renderItem = (model, parentShift) => {
    const {
      onFocus, onSelect, selection, level,
      itemFormatter
    } = this.props;

    const item = itemFormatter(model);

    return (
      <Item
        key={item.key || item.id}
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

  render() {
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
            <Icon
              glyph={chevronRightIcon}
              className={styles.collapseIcon}
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
            <Icon
              glyph={chevronDownIcon}
              className={styles.collapseIcon}
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
