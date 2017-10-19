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
import Item, {moreLessButtonStates} from './item';
import type {ItemType} from './types';
import styles from './data-list.css';

import type {MoreLessButtonState} from './item';

type Props = {
  className?: string,
  data: any[],
  loading: boolean,

  itemFormatter: (item: any) => ItemType,

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

    itemFormatter: PropTypes.func.isRequired,

    onItemMoreLess: PropTypes.func,
    itemMoreLessState: PropTypes.func,

    remoteSelection: PropTypes.bool
  };

  static defaultProps = {
    loading: false,

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

  onEqualPress = () => {
    const {
      selection, itemFormatter
    } = this.props;

    const item = itemFormatter(selection.getFocused());

    if (item.collapsed) {
      item.onExpand();
    } else {
      item.onCollapse();
    }
  }

  shortcutsMap = {
    '=': this.onEqualPress
  };

  render(): Element<any> {
    const {
      data, className, loading,
      selection, disabledHover,
      itemFormatter
    } = this.props;

    const shortcutsMap = {...this.shortcutsMap, ...this.props.shortcutsMap};

    const classes = classNames(className, {
      [styles.dataList]: true,
      [styles.disabledHover]: disabledHover,
      [styles.multiSelection]: selection.getSelected().size > 0
    });

    return (
      <div className={styles.dataListWrapper}>
        {this.state.shortcutsEnabled &&
          <Shortcuts
            map={shortcutsMap}
            scope={this.state.shortcutsScope}
          />
        }

        <ul className={classes}>
          {data.map(model => {
            const item = itemFormatter(model);
            const {id, title, items} = item;

            const showMoreLessButton = this.props.itemMoreLessState(item);

            return (
              <Item
                key={id}
                item={model}
                title={title}
                items={items}

                itemFormatter={itemFormatter}

                collapsible={item.collapsible}
                collapsed={item.collapsed}
                onCollapse={item.onCollapse}
                onExpand={item.onExpand}

                focused={selection.isFocused(model)}
                showFocus={selection.isFocused(model)}
                onFocus={this.onItemFocus}

                selection={selection}
                selectable={item.selectable}
                selected={selection.isSelected(model)}
                onSelect={this.onItemSelect}

                showMoreLessButton={showMoreLessButton}
                onItemMoreLess={this.props.onItemMoreLess}
              />
            );
          })}
        </ul>

        {loading && (
          <div className={data.length > 0 ? styles.loadingOverlay : null}>
            <Loader/>
          </div>
        )}
      </div>
    );
  }
}

export default disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(DataList)));
