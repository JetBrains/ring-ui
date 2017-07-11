/**
  * @name Data List
  * @category Components
  * @framework React
  * @extends {PureComponent}
  * @description TODO add Data List description
  * @example-file ./data-list.examples.html
  */
/* @flow */

import React, {PureComponent, Element} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import selectionShortcutsHOC from '../table/selection-shortcuts-hoc';
import disableHoverHOC from '../table/disable-hover-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection from './selection';
import Group from './group';
import type {ItemType, GroupType} from './types';
import styles from './data-list.css';

type Props = {
  className?: string,
  data: GroupType[],
  loading: boolean,
  groupItemsLimit: number,
  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,

  // selectionShortcutsHOC
  selection: Selection,
  selectable: boolean,
  onSelect: (selection?: Selection) => void,
  shortcutsMap: {},

  // focusSensorHOC
  focused: boolean,

  // disableHoverHOC
  disabledHover: boolean
};

class DataList extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    groupItemsLimit: PropTypes.number,
    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isItemCollapsed: PropTypes.func
  };

  static defaultProps = {
    loading: false,
    groupItemsLimit: Infinity,
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true
  };

  state = {
    fullyShownGroups: new Set(),
    shortcutsEnabled: this.props.focused,
    shortcutsScope: getUID('ring-data-list-')
  }

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data) {
      onSelect(selection.cloneWith({data: nextProps.data}));
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(selection.resetSelection());
    }

    const shortcutsEnabled = nextProps.focused;
    if (shortcutsEnabled !== this.state.shortcutsEnabled) {
      this.setState({shortcutsEnabled});
    }
  }

  props: Props;

  onGroupOrItemFocus = (groupOrItem: GroupType|ItemType): void => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(groupOrItem));
  }

  onGroupOrItemSelect = (groupOrItem: GroupType|ItemType, selected: boolean): void => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(groupOrItem));
    } else {
      onSelect(selection.deselect(groupOrItem));
    }
  }

  onGroupShowLess = (group?: GroupType): void => {
    const fullyShownGroups = new Set(this.state.fullyShownGroups);
    fullyShownGroups.delete(group);
    this.setState({fullyShownGroups});
  }

  onGroupShowMore = (group?: GroupType): void => {
    const fullyShownGroups = new Set(this.state.fullyShownGroups);
    fullyShownGroups.add(group);
    this.setState({fullyShownGroups});
  }

  render(): Element<any> {
    const {
      data, className, loading,
      onItemCollapse, onItemExpand, isItemCollapsed,
      groupItemsLimit, selection, disabledHover
    } = this.props;

    const classes = classNames(className, {
      [styles.dataList]: true,
      [styles.disabledHover]: disabledHover,
      [styles.multiSelection]: selection.getSelected().size > 0
    });

    return (
      <div className={styles.dataListWrapper}>
        {this.state.shortcutsEnabled &&
          <Shortcuts
            map={this.props.shortcutsMap}
            scope={this.state.shortcutsScope}
          />
        }

        <ul className={classes}>
          {data.map(group => {
            const {id, title, items} = group;

            const showMoreLessButton = items.length > groupItemsLimit + 1;
            const fullyShown = this.state.fullyShownGroups.has(group);
            const itemsToShow = items.slice(0, groupItemsLimit);

            let moreItemsToShow = [];
            if (fullyShown && items.length > groupItemsLimit) {
              moreItemsToShow = items.slice(groupItemsLimit);
            }

            return (
              <Group
                key={id}
                group={group}
                title={title}
                items={itemsToShow}
                moreItems={moreItemsToShow}
                onItemExpand={onItemExpand}
                onItemCollapse={onItemCollapse}
                isItemCollapsed={isItemCollapsed}
                showMoreLessButton={showMoreLessButton}
                onGroupShowLess={this.onGroupShowLess}
                onGroupShowMore={this.onGroupShowMore}
                onFocus={this.onGroupOrItemFocus}
                focused={selection.isFocused(group)}
                showFocus={selection.isFocused(group)}
                onSelect={this.onGroupOrItemSelect}
                selection={selection}
                selectable={group.selectable}
                selected={selection.isSelected(group)}
              />
            );
          })}
        </ul>

        {loading && (
          <div className={styles.loadingOverlay}>
            <Loader/>
          </div>
        )}
      </div>
    );
  }
}

export default disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(DataList)));
