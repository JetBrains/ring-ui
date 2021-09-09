import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup';
import List from '../list/list';

const {children, ...popupPropTypes} = Popup.propTypes || {};

/**
 * @name Popup Menu
 */
export default class PopupMenu extends Popup {
  static isItemType = List.isItemType;
  static ListProps = List.ListProps;

  static propTypes = {
    ...popupPropTypes,
    ...List.propTypes,
    closeOnSelect: PropTypes.bool
  };

  static defaultProps = {
    ...List.defaultProps,
    ...Popup.defaultProps,
    renderOptimization: false,
    closeOnSelect: false
  };

  static getDerivedStateFromProps(props) {
    return {
      data: (props.data || []).map(dataItem => ({
        role: 'menuitem', ...dataItem
      }))
    };
  }

  onSelect = (item, event) => {
    if (this.props.closeOnSelect) {
      this._onCloseAttempt(event);
    }
    this.props.onSelect(item, event);
  };

  listRef = el => {
    this.list = el;
  };

  /** @override */
  getInternalContent() {
    const {className, data, ...props} = this.props;

    return (
      <div>
        <List
          role="menu"
          ref={this.listRef}
          data={this.state.data}
          {...props}
          maxHeight={this.popup && this.popup.style.maxHeight}
          shortcuts={this.shouldUseShortcuts()}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export const {ListProps} = List;
