/**
 * @description Displays a popup with select's options.
 */

import React from 'react';
import classNames from 'classnames';

import searchIcon from 'jetbrains-icons/search.svg';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Popup from '../popup/popup';
import List from '../list/list';
import Icon from '../icon/icon';
import LoaderInline from '../loader-inline/loader-inline';
import shortcutsHOC from '../shortcuts/shortcuts-hoc';
import {preventDefault} from '../global/dom';
import getUID from '../global/get-uid';
import memoize from '../global/memoize';
import TagsList from '../tags-list/tags-list';
import Caret from '../caret/caret';

import SelectFilter from './select__filter';
import styles from './select-popup.css';

const INPUT_MARGIN_COMPENSATION = -14;
const FILTER_HEIGHT = 35;

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
    maxHeight: 600,
    minWidth: 240,
    loading: false,
    onSelect: noop,
    onCloseAttempt: noop,
    onFilter: noop,
    onClear: noop,
    onLoadMore: noop,
    selected: [],
    tags: null
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
      up: event => (this.list && this.list.upHandler(event)),
      down: event => (this.list && this.list.downHandler(event)),
      enter: event => (this.list && this.list.enterHandler(event)),
      esc: event => this.props.onCloseAttempt(event),
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
    this.caret = new Caret(this.filter);
  };

  getFilter() {
    if ((this.props.filter || this.props.tags) && !this.props.hidden) {
      const onClickHandler = () => this.filter.focus();

      return (
        <div className={styles.filterWrapper}>
          <Icon
            className={styles.filterIcon}
            glyph={searchIcon}
            size={Icon.Size.Size18}
          />
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
            onClear={this.props.onClear}
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
      <div className={styles.message}>{this.props.message}</div>}
    </div>);
  }

  listRef = el => {
    this.list = el;
  };

  getList() {
    if (this.props.data.length) {
      let {maxHeight} = this.props;
      if (this.props.filter) {
        maxHeight -= FILTER_HEIGHT;
      }

      return (
        <List
          maxHeight={maxHeight}
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
          compact={this.props.compact}
          renderOptimization={this.props.renderOptimization}
        />
      );
    }

    return null;
  }

  popupRef = el => {
    this.popup = el;
  };

  listRef = el => {
    this.list = el;
  };

  filterRef = el => {
    this.filter = el;
  };

  render() {
    const classes = classNames(styles.popup, this.props.className);

    return (
      <Popup
        ref={this.popupRef}
        hidden={this.props.hidden}
        attached={this.props.isInputMode}
        className={classes}
        dontCloseOnAnchorClick={true}
        keepMounted={true}
        anchorElement={this.props.anchorElement}
        minWidth={this.props.minWidth}
        onCloseAttempt={this.props.onCloseAttempt}
        directions={this.props.directions}
        top={this.props.top || (this.props.isInputMode ? INPUT_MARGIN_COMPENSATION : null)}
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
