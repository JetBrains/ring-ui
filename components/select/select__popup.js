/**
 * @description Displays a popup with select's options.
 */
/* eslint-disable react/prop-types */

import React, {PureComponent} from 'react';
import classNames from 'classnames';
import searchIcon from '@jetbrains/icons/search.svg';
import memoizeOne from 'memoize-one';

import Icon from '../icon/icon';

import Popup, {getPopupContainer, PopupTargetContext} from '../popup/popup';
import {DEFAULT_DIRECTIONS, maxHeightForDirection} from '../popup/position';
import List from '../list/list';
import LoaderInline from '../loader-inline/loader-inline';
import shortcutsHOC from '../shortcuts/shortcuts-hoc';
import {getStyles} from '../global/dom';
import getUID from '../global/get-uid';
import memoize from '../global/memoize';
import TagsList from '../tags-list/tags-list';
import Caret from '../caret/caret';
import Shortcuts from '../shortcuts/shortcuts';
import Button from '../button/button';
import Text from '../text/text';

import SelectFilter from './select__filter';
import styles from './select-popup.css';

const INPUT_MARGIN_COMPENSATION = -14;
const FILTER_HEIGHT = 35;
const TOOLBAR_HEIGHT = 49;

function noop() {}

const FilterWithShortcuts = shortcutsHOC(SelectFilter);

export default class SelectPopup extends PureComponent {
  static defaultProps = {
    data: [],
    activeIndex: null,
    toolbar: null,
    filter: false, // can be either boolean or an object with "value" and "placeholder" properties
    multiple: false, // multiple can be an object - see demo for more information
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
    tags: null,
    ringPopupTarget: null,
    onSelectAll: noop,
    onEmptyPopupEnter: noop
  };

  state = {
    popupFilterShortcutsOptions: {
      modal: true,
      disabled: true
    },
    tagsActiveIndex: null
  };

  componentDidMount() {
    window.document.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentWillUnmount() {
    window.document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  isClickingPopup = false; // This flag is set to true while an item in the popup is being clicked
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

  removeTag(tag, event) {
    const _tag = tag || this.props.selected.slice(0)[this.props.selected.length - 1];
    if (_tag) {
      this.onListSelect(_tag, event, {tryKeepOpen: true});
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

  onFilterFocus = () => {
    this._togglePopupFilterShortcuts(false);
    this.setState({tagsActiveIndex: null});
  };

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

  mouseDownHandler = () => {
    this.isClickingPopup = true;
  };

  mouseUpHandler = () => {
    this.isClickingPopup = false;
  };

  isVisible() {
    return this.popup && this.popup.isVisible();
  }

  onListSelect = (selected, event, opts) => {
    const getSelectItemEvent = () => {
      let customEvent;
      if (document.createEvent) {
        customEvent = document.createEvent('Event');
        customEvent.initEvent('select', true, false);
      }
      if (event && event.persist) {
        event.persist();
      }
      customEvent.originalEvent = event;
      return customEvent;
    };

    this.props.onSelect(selected, getSelectItemEvent(), opts);
  };

  tabPress = event => {
    this.props.onCloseAttempt(event, true);
  };

  onClickHandler = () => this.filter.focus();

  getFilter() {
    if (this.props.filter || this.props.tags) {
      return (
        <div
          className={styles.filterWrapper}
          data-test="ring-select-popup-filter"
        >
          <Icon
            glyph={searchIcon}
            className={styles.filterIcon}
            data-test-custom="ring-select-popup-filter-icon"
          />
          <FilterWithShortcuts
            rgShortcutsOptions={this.state.popupFilterShortcutsOptions}
            rgShortcutsMap={this.popupFilterShortcuts.map}

            value={this.props.filterValue}
            inputRef={this.filterRef}
            onBlur={this.popupFilterOnBlur}
            onFocus={this.onFilterFocus}
            className="ring-js-shortcuts"
            placeholder={this.props.filter.placeholder}

            onChange={this.props.onFilter}
            onClick={this.onClickHandler}
            onClear={this.props.onClear}

            data-test-custom="ring-select-popup-filter-input"
            listId={this.props.listId}
          />
        </div>
      );
    }

    return null;
  }

  handleRemoveTag = memoize(tag => event => this.removeTag(tag, event));

  handleTagClick = memoize(tag => () => {
    this.setState({
      tagsActiveIndex: this.props.selected.indexOf(tag)
    });
  });

  getTags() {
    return (
      <div>
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
    if (this.props.tags) {
      const classes = classNames([
        styles.filterWithTags,
        {
          [styles.filterWithTagsFocused]: !this.state.popupFilterShortcutsOptions.disabled
        }
      ]);

      return (
        <div
          className={classes}
        >
          {this.getTags()}
          {this.getFilter()}
        </div>
      );
    }

    return this.getFilter();
  }

  getBottomLine() {
    return (
      <div className={styles.bottomLine}>
        {this.props.loading && <LoaderInline/>}

        {this.props.message && (
          <div className={styles.message}>{this.props.message}</div>
        )}
      </div>
    );
  }

  handleListResize = () => {
    this.forceUpdate();
  };

  getList(ringPopupTarget) {
    if (this.props.data.length) {
      let {maxHeight} = this.props;

      if (this.props.anchorElement) {
        maxHeight = this._adjustListMaxHeight(this.props.hidden, maxHeight, ringPopupTarget);
      }

      if (this.props.filter) {
        maxHeight -= FILTER_HEIGHT;
      }

      if (this.props.toolbar) {
        maxHeight -= TOOLBAR_HEIGHT;
      }

      return (
        <List
          id={this.props.listId}
          maxHeight={maxHeight}
          data={this.props.data}
          activeIndex={this.props.activeIndex}
          ref={this.listRef}
          restoreActiveIndex
          activateFirstItem
          onSelect={this.onListSelect}
          onResize={this.handleListResize}
          onScrollToBottom={this.props.onLoadMore}
          hidden={this.props.hidden}
          shortcuts={!this.props.hidden}
          disableMoveOverflow={this.props.disableMoveOverflow}
          disableMoveDownOverflow={this.props.loading}
          disableScrollToActive={this.props.disableScrollToActive}
          compact={this.props.compact}
          renderOptimization={this.props.renderOptimization}
        />
      );
    }

    return null;
  }

  handleSelectAll = () => this.props.onSelectAll(
    this.props.data.filter(item => !item.disabled).length !== this.props.selected.length
  );

  getSelectAll = () => {
    const activeFilters = this.props.data.filter(item => !item.disabled);
    return (
      <div className={styles.selectAll}>
        {
          activeFilters.length === 0
            ? (
              <span/>
            )
            : (
              <Button
                text
                inline
                onClick={this.handleSelectAll}
              >
                {activeFilters.length !== this.props.selected.length
                  ? 'Select all'
                  : 'Deselect all'}
              </Button>
            )
        }
        <Text info>{`${this.props.selected.length} selected`}</Text>
      </div>
    );
  };


  // Cache the value because this method is called
  // inside `render` function which can be called N times
  // and should be fast as possible.
  // Cache invalidates each time hidden or userDefinedMaxHeight changes
  _adjustListMaxHeight = memoizeOne((hidden, userDefinedMaxHeight, ringPopupTarget) => {
    if (hidden) {
      return userDefinedMaxHeight;
    }

    // Calculate list's maximum height that can't
    // get beyond the screen
    // @see RG-1838, JT-48358
    const minMaxHeight = 100;
    const directions = this.props.directions || DEFAULT_DIRECTIONS;

    // Note:
    // Create a method which'll be called only when the popup opens and before
    // render the list would be a better way
    const anchorNode = this.props.anchorElement;
    const containerNode = getPopupContainer(ringPopupTarget) || document.documentElement;
    return Math.min(
      directions.reduce((maxHeight, direction) => (
        Math.max(maxHeight, maxHeightForDirection(
          direction,
          anchorNode,
          getStyles(containerNode).position !== 'static' ? containerNode : null
        ))
      ), minMaxHeight),
      userDefinedMaxHeight
    );
  });

  popupRef = el => {
    this.popup = el;
  };

  listRef = el => {
    this.list = el;
  };

  filterRef = el => {
    this.filter = el;
    this.caret = new Caret(this.filter);
  };

  shortcutsScope = getUID('select-popup-');
  shortcutsMap = {
    tab: this.tabPress
  };

  popupFilterShortcuts = {
    map: {
      up: event => (this.list && this.list.upHandler(event)),
      down: event => (this.list && this.list.downHandler(event)),
      home: event => (this.list && this.list.homeHandler(event)),
      end: event => (this.list && this.list.endHandler(event)),
      enter: event => (this.list
        ? this.list.enterHandler(event)
        : this.props.onEmptyPopupEnter(event)),
      esc: event => this.props.onCloseAttempt(event, true),
      tab: event => this.tabPress(event),
      backspace: event => this.handleBackspace(event),
      del: () => this.removeSelectedTag(),
      left: () => this.handleNavigation(true),
      right: () => this.handleNavigation()
    }
  };

  render() {
    const classes = classNames(styles.popup, this.props.className);

    return (
      <PopupTargetContext.Consumer>
        {ringPopupTarget => (
          <Popup
            trapFocus={false}
            ref={this.popupRef}
            hidden={this.props.hidden}
            attached={this.props.isInputMode}
            className={classes}
            dontCloseOnAnchorClick
            anchorElement={this.props.anchorElement}
            minWidth={this.props.minWidth}
            onCloseAttempt={this.props.onCloseAttempt}
            directions={this.props.directions}
            top={this.props.top || (this.props.isInputMode ? INPUT_MARGIN_COMPENSATION : null)}
            left={this.props.left}
            onMouseDown={this.mouseDownHandler}
            target={this.props.ringPopupTarget}
            autoCorrectTopOverflow={false}
            style={this.props.style}
          >
            <div dir={this.props.dir}>
              {!this.props.hidden && this.props.filter &&
                  (
                    <Shortcuts
                      map={this.shortcutsMap}
                      scope={this.shortcutsScope}
                    />
                  )
              }
              {/* Add empty div to prevent the change of List position in DOM*/}
              {this.props.hidden ? <div/> : this.getFilterWithTags()}
              {this.props.multiple &&
                  !this.props.multiple.limit &&
                  this.props.multiple.selectAll &&
                  this.getSelectAll()
              }
              {this.getList(this.props.ringPopupTarget || ringPopupTarget)}
              {this.getBottomLine()}
              {this.props.toolbar}
            </div>
          </Popup>
        )}
      </PopupTargetContext.Consumer>
    );
  }
}
