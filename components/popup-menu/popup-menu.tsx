import React, {SyntheticEvent, ComponentType} from 'react';
import PropTypes from 'prop-types';

import Popup, {BasePopupProps} from '../popup/popup';
import List, {ListProps as ListPropsType} from '../list/list';
import {ListDataItem} from '../list/consts';

const {children, ...popupPropTypes} = Popup.propTypes || {};

export interface PopupMenuProps<T = unknown> extends
  Omit<ListPropsType<T>, 'maxHeight' | 'hidden'>, Omit<BasePopupProps, 'onMouseOut'> {
  closeOnSelect: boolean
}

/**
 * @name Popup Menu
 */
export default class PopupMenu<T = unknown> extends Popup<PopupMenuProps<T>> {
  static isItemType = List.isItemType;
  static ListProps = List.ListProps;

  static defaultProps = {
    ...List.defaultProps,
    ...Popup.defaultProps,
    renderOptimization: false,
    closeOnSelect: false
  };

  onSelect = (item: ListDataItem<T>, event: Event | SyntheticEvent) => {
    if (this.props.closeOnSelect) {
      this._onCloseAttempt(event);
    }
    this.props.onSelect(item, event);
  };

  list?: List<T> | null;
  listRef = (el: List<T> | null) => {
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
          maxHeight={this.popup && parseFloat(this.popup.style.maxHeight)}
          shortcuts={this.shouldUseShortcuts()}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

(PopupMenu as ComponentType<unknown>).propTypes = {
  ...popupPropTypes,
  ...List.propTypes,
  closeOnSelect: PropTypes.bool
};

export type PopupMenuAttrs<T = unknown> =
  JSX.LibraryManagedAttributes<typeof PopupMenu, PopupMenuProps<T>>

export const {ListProps} = List;
