/**
 * @description Displays a popup with select's options.
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Popup from '../popup/popup';
import List from '../list/list';
import LoaderInline from '../loader-inline/loader-inline';
import shortcutsHOC from '../shortcuts/shortcuts-hoc';
import {filterWrapper} from '../popup/popup.css';
import {preventDefault} from '../global/dom';
import getUID from '../global/get-uid';
import memoize from '../global/memoize';
import TagsList from '../tags-list/tags-list';

import SelectFilter from './select__filter';
import './select-popup.scss';

function noop() {}

const FilterWithShortcuts = shortcutsHOC(SelectFilter);

export default class SelectPopup extends RingComponentWithShortcuts {
  isClickingPopup = false; // This flag is to true while an item in the popup is being clicked

  static defaultProps = {
    data: [],
    activeIndex: null,
    toolbar: null,
    filter: false, // can be either boolean or an object with "value" and "placeholder" properties
    message: null,
    anchorElement: null,
    maxHeight: 250,
    loading: false,
    minWidth: Popup.PopupProps.MinWidth.TARGET,
    onSelect: noop,
    onCloseAttempt: noop,
    onFilter: noop,
    onLoadMore: noop,
    selected: [],
    tags: PropTypes.bool
  };

  state = {
    popupShortcuts: false,
    popupFilterShortcutsOptions: {
      modal: true,
      disabled: true
    },
    tagsActiveIndex: null
  };

  popupFilterShortcuts = {
    map: {
      up: e => (this.list && this.list.upHandler(e)),
      down: e => (this.list && this.list.downHandler(e)),
      enter: e => (this.list && this.list.enterHandler(e)),
      esc: e => this.props.onCloseAttempt(e),
      tab: e => this.tabPress(e),
      backspace: () => this.removeTag(this.props.selected[this.state.tagsActiveIndex]),
      left: () => this.navigateLeft(),
      right: () => this.navigateRight()
    }
  };

  focusFilter() {
    setTimeout(() => this.filter.focus());
  }

  updateTagActiveIndex(newIndex) {
    let newActiveIndex = newIndex;
    if (newActiveIndex >= this.props.selected.length || newActiveIndex < 0) {
      newActiveIndex = null;
      this.focusFilter();
    }
    this.setState({
      tagsActiveIndex: newActiveIndex
    });
  }

  navigateLeft() {
    this.updateTagActiveIndex(
      this.state.tagsActiveIndex === null
        ? this.props.selected.length - 1
        : this.state.tagsActiveIndex - 1
    );
  }

  navigateRight() {
    if (this.state.tagsActiveIndex !== null) {
      this.updateTagActiveIndex(this.state.tagsActiveIndex + 1);
    }
  }

  removeTag(tag) {
    const _tag = tag || this.props.selected.slice(0)[this.props.selected.length - 1];
    this.onListSelect(_tag);
    this.setState({
      tagsActiveIndex: null
    });
    this.focusFilter();
  }

  popupFilterOnFocus = () => this._togglePopupFilterShortcuts(false);
  popupFilterOnBlur = () => {
    if (!this.state.tagsActiveIndex) {
      this._togglePopupFilterShortcuts(true);
    }
  };

  _togglePopupFilterShortcuts(shortcutsDisabled) {
    this.setState({
      popupFilterShortcutsOptions: {
        modal: true,
        disabled: shortcutsDisabled
      }
    });
  }

  didMount() {
    window.document.addEventListener('mouseup', this.mouseUpHandler);
  }

  willReceiveProps(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      this.setState({
        popupShortcuts: !nextProps.hidden,
        shortcuts: !nextProps.hidden && this.props.filter
      });
    }
  }

  willUnmount() {
    window.document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  getShortcutsProps() {
    return {
      map: {
        tab: this.tabPress
      },
      scope: getUID('select-popup-')
    };
  }

  listOnMouseOut = () => {
    this.list.clearSelected();
  };

  mouseDownHandler = () => {
    this.isClickingPopup = true;
  };

  mouseUpHandler = () => {
    this.isClickingPopup = false;
  };

  listScrollToIndex(index) {
    this.list && this.list.setActiveItem(index);
  }

  isVisible() {
    return this.popup && this.popup.isVisible();
  }

  onListSelect = selected => {
    const getSelectItemEvent = () => {
      let event;
      if (document.createEvent) {
        event = document.createEvent('Event');
        event.initEvent('select', true, false);
      }
      return event;
    };

    this.props.onSelect(selected, getSelectItemEvent());
  };

  tabPress = event => {
    preventDefault(event);

    const listActiveItem = this.list && this.list.state.activeItem;
    if (listActiveItem) {
      this.onListSelect(listActiveItem);
    }
    this.props.onCloseAttempt();
  };

  filterRef = el => {
    this.filter = el;
  };

  getFilter() {
    if ((this.props.filter || this.props.tags) && !this.props.hidden) {
      const classes = classNames([
        filterWrapper,
        'ring-select-popup__filter'
      ]);
      const onClickHandler = () => this.filter.focus();

      return (
        <div className={classes}>
          <FilterWithShortcuts
            rgShortcutsOptions={this.state.popupFilterShortcutsOptions}
            rgShortcutsMap={this.popupFilterShortcuts.map}

            value={this.props.filterValue}
            inputRef={this.filterRef}
            onBlur={this.popupFilterOnBlur}
            onFocus={this.popupFilterOnFocus}
            className="ring-js-shortcuts"
            placeholder={this.props.filter.placeholder}

            onChange={this.props.onFilter}
            onClick={onClickHandler}
          />
        </div>
      );
    }

    return null;
  }

  handleRemoveTag = memoize(tag => () => this.removeTag(tag));
  handleTagClick = memoize(tag => () => {
    this.setState({
      focusFilter: false,
      tagsActiveIndex: this.props.selected.indexOf(tag)
    });
  });

  getTags() {
    return (
      <div className="ring-select-popup__tags">
        <TagsList
          tags={this.props.selected}
          activeIndex={this.state.tagsActiveIndex}
          handleRemove={this.handleRemoveTag}
          handleClick={this.handleTagClick}
          disabled={this.props.disabled}
        />
      </div>
    );
  }

  getFilterWithTags() {
    if (this.props.tags && !this.props.hidden) {
      const classes = classNames([
        'ring-select-popup__filter-with-tags',
        {
          'ring-select-popup__filter-with-tags_focused': !this.state.popupFilterShortcutsOptions.disabled
        }
      ]);

      return (
        <div
          className={classes}
          tabIndex="0"
        >
          {this.getTags()}
          {this.getFilter()}
        </div>
      );
    }

    return this.getFilter();
  }

  getBottomLine() {
    return (<div>
      {this.props.loading && <LoaderInline/>}

      {this.props.message &&
      <div className="ring-select__message">{this.props.message}</div>}
    </div>);
  }

  listRef = el => {
    this.list = el;
  };

  getList() {
    if (this.props.data.length) {
      return (
        <List
          maxHeight={this.props.maxHeight}
          data={this.props.data}
          activeIndex={this.props.activeIndex}
          ref={this.listRef}
          restoreActiveIndex={true}
          activateSingleItem={true}
          onSelect={this.onListSelect}
          onMouseOut={this.listOnMouseOut}
          onScrollToBottom={this.props.onLoadMore}
          shortcuts={this.state.popupShortcuts}
          disableMoveDownOverflow={this.props.loading}
        />
      );
    }

    return null;
  }

  popupRef = el => {
    this.popup = el;
  };

  render() {
    const classes = classNames(
      'ring-select-popup',
      this.props.className
    );

    return (
      <Popup
        ref={this.popupRef}
        hidden={this.props.hidden}
        attached={false}
        className={classes}
        dontCloseOnAnchorClick={true}
        keepMounted={true}
        anchorElement={this.props.anchorElement}
        minWidth={this.props.minWidth}
        onCloseAttempt={this.props.onCloseAttempt}
        directions={this.props.directions}
        top={this.props.top}
        left={this.props.left}
        onMouseDown={this.mouseDownHandler}
      >
        {this.getFilterWithTags()}
        {this.getList()}
        {this.getBottomLine()}
        {this.props.toolbar}
      </Popup>
    );
  }
}
