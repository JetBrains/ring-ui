/* @flow */

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

import focusSensorHOC from '../global/focus-sensor-hoc';
import selectionShortcutsHOC from '../table/selection-shortcuts-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection from './selection';
import Group from './group';
import type {ItemType, GroupType} from './types';
import styles from './data-list.css';

type Props = {
  data: GroupType[],
  className?: string,
  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,
  groupItemsLimit: number,
  onGroupShowMore: (item?: GroupType) => void,
  onGroupShowLess: (item?: GroupType) => void,
  isGroupFullyShown: (item?: GroupType) => boolean,
  loading: boolean,
  focused: boolean,
  shortcutsMap: {},
  selectable: boolean,
  selection: Selection,
  onSelect: (selection?: Selection) => void
};

class DataList extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isItemCollapsed: PropTypes.func,
    groupItemsLimit: PropTypes.number,
    onGroupShowMore: PropTypes.func,
    onGroupShowLess: PropTypes.func,
    isGroupFullyShown: PropTypes.func,
    loading: PropTypes.bool,
    shortcutsMap: PropTypes.object,
    selectable: PropTypes.bool,
    selection: PropTypes.object,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,
    groupItemsLimit: Infinity,
    onGroupShowMore: () => {},
    onGroupShowLess: () => {},
    isGroupFullyShown: () => false,
    loading: false,
    focused: false,
    shortcutsMap: {},
    selectable: true,
    onSelect: () => {}
  };

  state = {
    shortcutsEnabled: this.props.focused,
    shortcutsScope: getUID('ring-data-list-'),
    disabledHover: false
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('keydown', this.onKeyDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.onKeyDown, true);
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

  onGroupOrItemFocus = (groupOrItem: GroupType|ItemType) => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(groupOrItem));
  }

  onMouseMove = () => {
    if (this.state.disabledHover) {
      this.setState({disabledHover: false});
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers
    if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
      this.setState({disabledHover: true});
    }
  }

  render(): Element<any> {
    const {
      data, className,
      onItemCollapse, onItemExpand, isItemCollapsed,
      groupItemsLimit, onGroupShowMore, onGroupShowLess,
      isGroupFullyShown, loading, selection
    } = this.props;

    const classes = classNames(this.props.className, {
      [styles.dataList]: true,
      [styles.disabledHover]: this.state.disabledHover
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

            const fullyShown = isGroupFullyShown(group);

            let itemsToShow;
            if (!fullyShown && items.length > groupItemsLimit + 1) {
              itemsToShow = [...items].splice(0, groupItemsLimit);
            } else {
              itemsToShow = [...items];
            }

            const showMoreLessButton = items.length > groupItemsLimit + 1;

            return (
              <Group
                key={id}
                group={group}
                title={title}
                items={itemsToShow}
                onItemExpand={onItemExpand}
                onItemCollapse={onItemCollapse}
                isItemCollapsed={isItemCollapsed}
                showMoreLessButton={showMoreLessButton}
                fullyShown={fullyShown}
                onGroupShowLess={onGroupShowLess}
                onGroupShowMore={onGroupShowMore}
                onFocus={this.onGroupOrItemFocus}
                focused={selection.isFocused(group)}
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

export default selectionShortcutsHOC(focusSensorHOC(DataList));
