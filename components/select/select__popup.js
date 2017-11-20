/**
 * @description Displays a popup with select's options.
 */
/* eslint-disable react/prop-types */

import React, {Component} from 'react';
import classNames from 'classnames';

import Popup from '../popup/popup';
import List from '../list/list';
import LoaderInline from '../loader-inline/loader-inline';
import shortcutsHOC from '../shortcuts/shortcuts-hoc';
import {filterWrapper} from '../popup/popup.css';
import getUID from '../global/get-uid';
import memoize from '../global/memoize';
import TagsList from '../tags-list/tags-list';
import Caret from '../caret/caret';
import Shortcuts from '../shortcuts/shortcuts';

import SelectFilter from './select__filter';
import './select-popup.scss';

function noop() {}

const FilterWithShortcuts = shortcutsHOC(SelectFilter);

export default class SelectPopup extends Component {
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
    tags: null,
    ringPopupTarget: null
  };

  state = {
    popupShortcuts: false,
    popupFilterShortcutsOptions: {
      modal: true,
      disabled: true
    },
    tagsActiveIndex: null
  };

  componentDidMount() {
    window.document.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      this.setState({
        popupShortcuts: !nextProps.hidden,
        shortcuts: !nextProps.hidden && this.props.filter
      });
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  isClickingPopup = false; // This flag is set to true while an item in the popup is being clicked

  popupFilterShortcuts = {
    map: {
      up: event => (this.list && this.list.upHandler(event)),
      down: event => (this.list && this.list.downHandler(event)),
      enter: event => (this.list && this.list.enterHandler(event)),
      esc: event => this.props.onCloseAttempt(event, true),
      tab: event => this.tabPress(event),
      backspace: event => this.handleBackspace(event),
      del: () => this.removeSelectedTag(),
      left: () => this.handleNavigation(true),
      right: () => this.handleNavigation()
    }
  };

  focusFilter() {
    setTimeout(() => this.filter.focus());
  }

  isEventTargetFilter(event) {
    return event.target && event.target.matches('input,textarea');
  }

  handleNavigation(navigateLeft) {
    if (this.isEventTargetFilter(event) && this.caret.getPosition() > 0) {
      return;
    }

    let newIndex = null;
    if (navigateLeft) {
      newIndex = this.state.tagsActiveIndex === null
        ? this.props.selected.length - 1
        : this.state.tagsActiveIndex - 1;
    } else if (this.state.tagsActiveIndex !== null) {
      newIndex = this.state.tagsActiveIndex + 1;
    }

    if (newIndex !== null && (newIndex >= this.props.selected.length || newIndex < 0)) {
      newIndex = null;
      this.focusFilter();
    }

    this.setState({
      tagsActiveIndex: newIndex
    });
  }

  removeTag(tag) {
    const _tag = tag || this.props.selected.slice(0)[this.props.selected.length - 1];
    if (_tag) {
      this.onListSelect(_tag);
      this.setState({
        tagsActiveIndex: null
      });
      this.focusFilter();
    }
  }

  removeSelectedTag() {
    if (this.state.tagsActiveIndex != null) {
      this.removeTag(this.props.selected[this.state.tagsActiveIndex]);
      return false;
    }
    return true;
  }

  handleBackspace(event) {
    if (!this.props.tags) {
      return true;
    }

    if (!this.isEventTargetFilter(event)) {
      this.removeSelectedTag();
      return false;
    }
    if (!event.target.value) {
      this.removeTag();
      return false;
    }
    return true;
  }

  popupFilterOnFocus = () => this._togglePopupFilterShortcuts(false);

  popupFilterOnBlur = () => {
    if (this.state.tagsActiveIndex === null) {
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

  listOnMouseOut = () => {
    this.list.clearSelected();
  };

  mouseDownHandler = () => {
    this.isClickingPopup = true;
  };

  mouseUpHandler = () => {
    this.isClickingPopup = false;
  };

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
    this.props.onCloseAttempt(event, true);
  };

  filterRef = el => {
    this.filter = el;
    this.caret = new Caret(this.filter);
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
          restoreActiveIndex
          activateFirstItem
          onSelect={this.onListSelect}
          onMouseOut={this.listOnMouseOut}
          onScrollToBottom={this.props.onLoadMore}
          shortcuts={this.state.popupShortcuts}
          disableMoveDownOverflow={this.props.loading}
          renderOptimization={this.props.renderOptimization}
        />
      );
    }

    return null;
  }

  popupRef = el => {
    this.popup = el;
  };

  shortcutsScope = getUID('select-popup-');

  shortcutsMap = {
    tab: this.tabPress
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
        dontCloseOnAnchorClick
        keepMounted
        anchorElement={this.props.anchorElement}
        minWidth={this.props.minWidth}
        onCloseAttempt={this.props.onCloseAttempt}
        directions={this.props.directions}
        top={this.props.top}
        left={this.props.left}
        onMouseDown={this.mouseDownHandler}
        target={this.props.ringPopupTarget}
      >
        {this.state.shortcuts &&
          <Shortcuts
            map={this.shortcutsMap}
            scope={this.shortcutsScope}
          />
        }

        {this.getFilterWithTags()}
        {this.getList()}
        {this.getBottomLine()}
        {this.props.toolbar}
      </Popup>
    );
  }
}
