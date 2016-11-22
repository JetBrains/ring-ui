/**
 * @description Displays a popup with select's options.
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Popup from '../popup/popup';
import List from '../list/list';
import Input from '../input-legacy/input-legacy';
import LoaderInline from '../loader-inline/loader-inline';
import classNames from 'classnames';

function noop() {}

export default class SelectPopup extends RingComponentWithShortcuts {
  isClickingPopup = false; // This flag is to true while an item in the popup is being clicked

  static defaultProps = {
    data: [],
    activeIndex: null,
    toolbar: null,
    filter: false, // can be either boolean or an object with "value" and "placeholder" properties
    message: null,
    anchorElement: null,
    container: null,
    maxHeight: 250,
    loading: false,
    minWidth: 'target',
    onSelect: noop,
    onClose: noop,
    onFilter: noop,
    onLoadMore: noop
  };

  state = {
    popupShortcuts: false
  };

  constructor() {
    super();
    this.mouseUpHandler = ::this.mouseUpHandler;
  }

  didMount() {
    if (this.refs.filter) {
      if (this.props.filter.value) {
        findDOMNode(this.refs.filter).value = this.props.filter.value;
      }
      this.focusFilter();
    }

    window.document.addEventListener('mouseup', this.mouseUpHandler);
  }

  willUnmount() {
    window.document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  focusFilter() {
    if (this.refs.filter) {
      findDOMNode(this.refs.filter).focus();
    }
  }

  show() {
    this.refs.popup.show(() => this.focusFilter());

    this.setState({
      shortcuts: this.props.filter,
      popupShortcuts: true
    });
  }

  hide() {
    this.refs.popup.hide();

    this.setState({
      shortcuts: false,
      popupShortcuts: false
    });
  }

  getShortcutsProps() {
    return {
      map: {
        tab: ::this.tabPress
      },
      options: {
        modal: true
      },
      scope: ::this.constructor.getUID('ring-select-popup-')
    };
  }

  remove() {
    this.refs.popup.remove();
  }

  listOnMouseOut() {
    this.refs.list.clearSelected();
  }

  mouseDownHandler() {
    this.isClickingPopup = true;
  }

  mouseUpHandler() {
    this.isClickingPopup = false;
  }

  listScrollToIndex(index) {
    this.refs.list && this.refs.list.setActiveItem(index);
  }

  isVisible() {
    return this.refs.popup && this.refs.popup.isVisible();
  }

  onListSelect(selected) {
    const getSelectItemEvent = () => {
      let event;
      if (document.createEvent) {
        event = document.createEvent('Event');
        event.initEvent('select', true, false);
      }
      return event;
    };

    this.props.onSelect(selected, getSelectItemEvent());
  }

  tabPress(event) {
    event.preventDefault();
    const listActiveItem = this.refs.list.state.activeItem;
    if (listActiveItem) {
      this.onListSelect(listActiveItem);
    }
    this.hide();
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
          />
        </div>
      );
    }

    return null;
  }

  getBottomLine() {
    return (<div>
      {this.props.loading && <LoaderInline/>}

      {this.props.message &&
      <div className="ring-select__message">{this.props.message}</div>}
    </div>);
  }

  getList() {
    if (this.props.data.length) {
      return (
        <List
          maxHeight={this.props.maxHeight}
          data={this.props.data}
          activeIndex={this.props.activeIndex}
          ref="list"
          restoreActiveIndex={true}
          activateSingleItem={true}
          onSelect={::this.onListSelect}
          onMouseOut={::this.listOnMouseOut}
          onScrollToBottom={::this.props.onLoadMore}
          shortcuts={this.state.popupShortcuts}
          disableMoveDownOverflow={this.props.loading}
        />
      );
    }

    return null;
  }

  render() {
    const classes = classNames(
      'ring-select-popup',
      this.props.className
    );

    return (
      <Popup
        ref="popup"
        hidden={true}
        cutEdge={false}
        className={classes}
        dontCloseOnAnchorClick={true}
        anchorElement={this.props.anchorElement}
        container={this.props.container}
        autoRemove={false}
        minWidth={this.props.minWidth}
        shortcuts={this.state.popupShortcuts}
        onClose={this.props.onClose}
        directions={this.props.directions}
        top={this.props.top}
        left={this.props.left}
        onMouseDown={::this.mouseDownHandler}
      >
        {this.getFilter()}
        {this.getList()}
        {this.getBottomLine()}
        {this.props.toolbar}
      </Popup>
    );
  }
}
