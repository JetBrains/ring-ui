/**
 * @fileoverview Select options popup
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import RingComponentWithShortcuts from 'ring-component/ring-component_with-shortcuts';
import Popup from 'popup/popup';
import List from 'list/list';
import Input from 'input/input';

const noop = () => {};

export default class SelectPopup extends RingComponentWithShortcuts {
  static defaultProps = {
    data: [],
    activeIndex: null,
    toolbar: null,
    filter: false, // can be boolean or an object with "value" and "placeholder" properties
    message: null,
    anchorElement: null,
    container: null,
    maxHeight: 250,
    minWidth: 'target',
    onSelect: function () {},
    onClose: function () {},
    onFilter: function () {}
  };

  state = {
    popupShortcuts: false
  };

  didMount() {
    if (this.refs.filter) {
      if (this.props.filter.value) {
        findDOMNode(this.refs.filter).value = this.props.filter.value;
      }
      this.focusFilter();
    }
  }

  focusFilter() {
    if (this.refs.filter) {
      findDOMNode(this.refs.filter).focus();
    }
  }

  show() {
    this.refs.popup.show(() => this.focusFilter());

    this.setState({
      popupShortcuts: true
    });
  }

  hide() {
    this.refs.popup.hide();

    this.setState({
      popupShortcuts: false
    });
  }

  _focusHandler() {
    this.setState({
      shortcuts: true
    });
  }

  _blurHandler() {
    this.setState({
      shortcuts: false
    });
  }

  getShortcutsProps() {
    return {
      map: {
        right: noop,
        left: noop,
        up: noop,
        down: noop,
        'shift+up': noop,
        'shift+down': noop,
        space: noop
      },
      scope: ::this.constructor.getUID()
    };
  }

  remove() {
    this.refs.popup.remove();
  }

  isVisible() {
    return this.refs.popup.isVisible();
  }

  getFilter() {
    if (this.props.filter) {
      return (
        <div className="ring-popup__filter-wrapper">
          <Input
            ref="filter"
            className="ring-js-shortcuts ring-input_filter-popup"
            placeholder={this.props.filter.placeholder || ''}
            onInput={this.props.onFilter}
            onFocus={::this._focusHandler}
            onBlur={::this._blurHandler}
          />
        </div>
      );
    }
  }

  getMessage() {
    if (this.props.message) {
      return <div className="ring-select__message">{this.props.message}</div>;
    }
  }

  getList() {
    if (this.props.data.length) {
      return (
        <List
          maxHeight={this.props.maxHeight}
          data={this.props.data}
          activeIndex={this.props.activeIndex}
          restoreActiveIndex={true}
          activateSingleItem={true}
          onSelect={this.props.onSelect}
          shortcuts={this.state.popupShortcuts}
        />
      );
    }
  }

  render() {
    return (
      <Popup
        ref="popup"
        hidden={true}
        cutEdge={false}
        dontCloseOnAnchorClick={true}
        anchorElement={this.props.anchorElement}
        container={this.props.container}
        autoRemove={false}
        minWidth={this.props.minWidth}
        shortcuts={this.state.popupShortcuts}
        onClose={this.props.onClose}
      >
        {this.getFilter()}
        {this.getList()}
        {this.getMessage()}
        {this.props.toolbar}
      </Popup>
    );
  }
}
