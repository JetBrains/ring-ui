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
    const {className, ...props} = this.props;

    return (
      <div>
        <List
          ref={this.listRef}
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
