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
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

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
  shortcuts: {}
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
    shortcuts: PropTypes.object
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
    shortcuts: {}
  };

  state = {
    shortcuts: this.props.focused
  }

  componentWillReceiveProps(nextProps) {
    const shortcuts = nextProps.focused;
    if (shortcuts !== this.state.shortcuts) {
      this.setState({shortcuts});
    }
  }

  props: Props;

  // eslint-disable-next-line arrow-body-style
  onUpPress = (): boolean => {
    return false;
  }

  // eslint-disable-next-line arrow-body-style
  onDownPress = (): boolean => {
    return false;
  }

  shortcutsMap = {
    up: this.onUpPress,
    down: this.onDownPress
  }

  shortcutsScope = getUID('ring-data-list-')

  render(): Element<any> {
    const {
      data, className,
      onItemCollapse, onItemExpand, isItemCollapsed,
      groupItemsLimit, onGroupShowMore, onGroupShowLess,
      isGroupFullyShown,
      loading
    } = this.props;

    const {shortcuts} = this.state;

    return (
      <div className={styles.dataListWrapper}>
        {shortcuts ? (
          <Shortcuts
            map={{...this.shortcutsMap, ...this.props.shortcuts}}
            scope={this.shortcutsScope}
          />
        ) : ''}

        <ul className={classNames(styles.dataList, className)}>
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

export default focusSensorHOC(DataList);
