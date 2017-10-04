/**
  * @name Data List
  * @category Components
  * @framework React
  * @extends {PureComponent}
  * @description A component for rendering interactive hierarchical tables.
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
import Group, {moreLessButtonStates} from './group';
import type {ItemType} from './types';
import styles from './data-list.css';

import type {MoreLessButtonState} from './group';

type Props = {
  className?: string,
  data: ItemType[],
  loading: boolean,

  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,
  isItemCollapsible: (item?: ItemType) => boolean,

  onItemMoreLess: (item?: ItemType, more?: boolean) => void,
  itemMoreLessState: (item?: ItemType) => MoreLessButtonState,

  remoteSelection: boolean,

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

    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isItemCollapsed: PropTypes.func,
    isItemCollapsible: PropTypes.func,

    onItemMoreLess: PropTypes.func,
    itemMoreLessState: PropTypes.func,

    remoteSelection: PropTypes.bool
  };

  static defaultProps = {
    loading: false,

    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,
    isItemCollapsible: () => false,

    onItemMoreLess: () => {},
    itemMoreLessState: () => moreLessButtonStates.UNUSED,

    remoteSelection: false
  };

  state = {
    shortcutsEnabled: this.props.focused,
    shortcutsScope: getUID('ring-data-list-')
  };

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data && !this.props.remoteSelection) {
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

  onItemFocus = (item: ItemType): void => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(item));
  };

  onItemSelect = (item: ItemType, selected: boolean): void => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(item));
    } else {
      onSelect(selection.deselect(item));
    }
  };

  render(): Element<any> {
    const {
      data, className, loading,
      onItemCollapse, onItemExpand,
      isItemCollapsed, isItemCollapsible,
      selection, disabledHover
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
          {data.map(item => {
            const {id, title, items} = item;

            const showMoreLessButton = this.props.itemMoreLessState(item);

            return (
              <Group
                key={id}
                item={item}
                title={title}
                items={items}

                collapsible={isItemCollapsible(item)}
                collapsed={isItemCollapsed(item)}
                onCollapse={onItemCollapse}
                onExpand={onItemExpand}
                isCollapsed={isItemCollapsed}
                isCollapsible={isItemCollapsible}

                focused={selection.isFocused(item)}
                showFocus={selection.isFocused(item)}
                onFocus={this.onItemFocus}

                selection={selection}
                selectable={item.selectable}
                selected={selection.isSelected(item)}
                onSelect={this.onItemSelect}

                showMoreLessButton={showMoreLessButton}
                onItemMoreLess={this.props.onItemMoreLess}
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
