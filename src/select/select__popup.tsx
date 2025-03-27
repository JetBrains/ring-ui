/**
 * @description Displays a popup with select's options.
 */
import {
  ComponentType,
  CSSProperties,
  PureComponent,
  ReactNode,
  Ref,
  SyntheticEvent
} from 'react';

import * as React from 'react';
import classNames from 'classnames';
import searchIcon from '@jetbrains/icons/search';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';

import Icon, {IconType} from '../icon/icon';

import Popup, {getPopupContainer} from '../popup/popup';
import {Directions, maxHeightForDirection} from '../popup/position';
import {PopupTargetContext} from '../popup/popup.target';
import List, {SelectHandlerParams} from '../list/list';
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
import {ControlsHeight} from '../global/controls-height';
import {refObject} from '../global/prop-types';
import {createComposedRef} from '../global/composeRefs';

import {DEFAULT_DIRECTIONS} from '../popup/popup.consts';

import {ListDataItem} from '../list/consts';

import {ShortcutsMap} from '../shortcuts/core';
import {TagAttrs} from '../tag/tag';

import SelectFilter from './select__filter';
import styles from './select-popup.css';

import {SelectItem} from './select';

const FILTER_HEIGHT = 35;
const TOOLBAR_HEIGHT = 49;

function noop() {}

const FilterWithShortcuts = shortcutsHOC(SelectFilter);

export type FilterFn<T> = (
  itemToCheck: SelectItem<T>,
  checkString: string,
  data: readonly SelectItem<T>[]
) => boolean

export interface Filter<T = unknown> {
  fn?: FilterFn<T> | null | undefined
  fuzzy?: boolean | null | undefined
  value?: string | null | undefined
  placeholder?: string | undefined
}

export interface Multiple {
  label?: string | null | undefined
  limit?: number | null | undefined
  selectAll?: boolean | null | undefined
  renderSelectedItemsDescription?: (selectedItems: SelectItem[], total: number) => ReactNode;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  removeSelectedItems?: boolean | null | undefined
}

export interface TagsReset {
  separator?: boolean | null | undefined
  label?: string | number | null | undefined
  glyph?: IconType | string | null | undefined
}

export interface Tags {
  reset?: TagsReset | null | undefined
  customTagComponent?: (tag: TagAttrs) => ReactNode
}

export interface SelectPopupProps<T = unknown> {
  data: readonly ListDataItem<T>[]
  activeIndex: number | null
  toolbar: ReactNode
  topbar: ReactNode
  filter: boolean | Filter<T>
  filterIcon?: string | ComponentType | null | undefined
  filterRef?: Ref<HTMLInputElement>
  message: string | null
  anchorElement: HTMLElement | null
  maxHeight: number
  minWidth: number
  loading: boolean
  onSelect: (item: ListDataItem<T>, event: Event, params?: SelectHandlerParams,) => void
  onCloseAttempt: (e?: Event | SyntheticEvent, isEsc?: boolean | undefined) => void
  onOutsideClick: (e: PointerEvent) => void
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: (e: React.MouseEvent<HTMLButtonElement>) => void
  onLoadMore: () => void
  ringPopupTarget: string | null
  onSelectAll: (isSelectAll: boolean) => void
  onEmptyPopupEnter: (e: KeyboardEvent) => void
  className?: string | null | undefined
  compact?: boolean | null | undefined
  dir?: 'ltr' | 'rtl' | undefined
  directions?: readonly Directions[] | undefined
  disabled?: boolean | undefined
  disableMoveOverflow?: boolean | null | undefined
  disableScrollToActive?: boolean | null | undefined
  filterValue?: string | undefined
  hidden?: boolean | null | undefined
  isInputMode?: boolean | undefined
  listId?: string | undefined
  left?: number | undefined
  renderOptimization?: boolean | undefined
  style?: CSSProperties | undefined
  top?: number | undefined
  offset?: number | undefined
  multiple: boolean | Multiple
  selected: ListDataItem<T> | readonly ListDataItem<T>[] | null
  tags: Tags | boolean | null
  preventListOverscroll?: boolean | undefined
}

export default class SelectPopup<T = unknown> extends PureComponent<SelectPopupProps<T>> {
  static defaultProps: SelectPopupProps = {
    data: [],
    activeIndex: null,
    toolbar: null,
    topbar: null,
    filter: false,
    filterIcon: null,
    filterRef: noop,
    multiple: false,
    message: null,
    anchorElement: null,
    maxHeight: 600,
    minWidth: 240,
    loading: false,
    onSelect: noop,
    onCloseAttempt: noop,
    onOutsideClick: noop,
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
  filter?: HTMLInputElement | null;
  focusFilter() {
    setTimeout(() => this.filter?.focus());
  }

  isEventTargetFilter(event: Event) {
    return event.target instanceof Element && event.target.matches('input,textarea');
  }

  caret?: Caret | null;
  handleNavigation(event: Event, navigateLeft?: boolean) {
    if (this.isEventTargetFilter(event) && this.caret != null &&
      Number(this.caret.getPosition()) > 0 ||
      !Array.isArray(this.props.selected)) {
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

  removeTag(tag?: ListDataItem<T>, event?: SyntheticEvent) {
    if (!Array.isArray(this.props.selected)) {
      return;
    }
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
    if (Array.isArray(this.props.selected) && this.state.tagsActiveIndex != null) {
      this.removeTag(this.props.selected[this.state.tagsActiveIndex]);
      return false;
    }
    return true;
  }

  handleBackspace(event: Event) {
    if (!this.props.tags) {
      return true;
    }

    if (!this.isEventTargetFilter(event)) {
      this.removeSelectedTag();
      return false;
    }
    if ((event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) &&
      !event.target.value) {
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

  private _togglePopupFilterShortcuts(shortcutsDisabled: boolean) {
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

  popup?: Popup | null;
  isVisible() {
    return this.popup && this.popup.isVisible();
  }

  onListSelect = (
    selected: ListDataItem<T>,
    event?: Event | SyntheticEvent,
    opts?: SelectHandlerParams
  ) => {
    const getSelectItemEvent = () => {
      const customEvent: Event & {
        originalEvent?: Event | SyntheticEvent
      } = document.createEvent('Event');
      customEvent.initEvent('select', true, false);
      if (event && 'persist' in event) {
        event.persist();
      }
      customEvent.originalEvent = event;
      return customEvent;
    };

    this.props.onSelect(selected, getSelectItemEvent(), opts);
  };

  tabPress = (event: Event) => {
    this.props.onCloseAttempt(event, true);
  };

  onClickHandler = () => this.filter?.focus();

  getFilter() {
    if (this.props.filter || this.props.tags) {
      return (
        <div
          className={styles.filterWrapper}
          data-test="ring-select-popup-filter"
        >
          {!this.props.tags && (
            <Icon
              glyph={this.props.filterIcon ?? searchIcon}
              className={styles.filterIcon}
              data-test-custom="ring-select-popup-filter-icon"
            />
          )}
          <FilterWithShortcuts
            rgShortcutsOptions={this.state.popupFilterShortcutsOptions}
            rgShortcutsMap={this.popupFilterShortcutsMap}

            value={this.props.filterValue}
            inputRef={this.composedFilterRef(this.filterRef, this.props.filterRef)}
            onBlur={this.popupFilterOnBlur}
            onFocus={this.onFilterFocus}
            className="ring-js-shortcuts"
            inputClassName={classNames({[styles.filterWithTagsInput]: this.props.tags})}
            placeholder={typeof this.props.filter === 'object'
              ? this.props.filter.placeholder
              : undefined}
            height={this.props.tags ? ControlsHeight.S : ControlsHeight.L}

            onChange={this.props.onFilter}
            onClick={this.onClickHandler}
            onClear={this.props.tags ? undefined : this.props.onClear}

            data-test-custom="ring-select-popup-filter-input"
            listId={this.props.listId}
            enableShortcuts={Object.keys(this.popupFilterShortcutsMap)}
          />
        </div>
      );
    }

    return null;
  }

  handleRemoveTag = memoize((tag: ListDataItem<T>) => (event: SyntheticEvent) =>
    this.removeTag(tag, event));

  handleTagClick = memoize((tag: ListDataItem<T>) => () => {
    if (Array.isArray(this.props.selected)) {
      this.setState({
        tagsActiveIndex: this.props.selected.indexOf(tag)
      });
    }
  });

  getCustomTag(tags: Tags | boolean | null) {
    if (tags !== null && typeof tags !== 'boolean') {
      return tags.customTagComponent;
    }
    return undefined;
  }

  getTags() {
    return Array.isArray(this.props.selected) && (
      <div>
        <TagsList<ListDataItem<T>>
          tags={this.props.selected}
          activeIndex={this.state.tagsActiveIndex}
          handleRemove={this.handleRemoveTag}
          handleClick={this.handleTagClick}
          disabled={this.props.disabled}
          customTagComponent={this.getCustomTag(this.props.tags)}
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
    const {loading, message, data} = this.props;
    const hasMoreThanOneItem = data.length > 1;

    return (loading || message) && (
      <div
        className={classNames(styles.bottomLine, {
          [styles.bottomLineOverItem]: hasMoreThanOneItem
        })}
      >
        {loading && <LoaderInline/>}

        {message && (
          <div className={styles.message}>{message}</div>
        )}
      </div>
    );
  }

  handleListResize = () => {
    this.forceUpdate();
  };

  getList(ringPopupTarget: string | Element | undefined) {
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
          preventListOverscroll={this.props.preventListOverscroll}
          renderOptimization={this.props.renderOptimization}
        />
      );
    }

    return null;
  }

  handleSelectAll = () => {
    if (Array.isArray(this.props.selected)) {
      this.props.onSelectAll(
        this.props.data.filter(item => !item.disabled).length !== this.props.selected.length
      );
    }
  };

  getSelectAll = () => {
    const multiple = this.props.multiple as Multiple;
    const activeFilters = this.props.data.filter(item => !item.disabled);
    return Array.isArray(this.props.selected) && (
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
                  ? multiple.selectAllLabel || 'Select all'
                  : multiple.deselectAllLabel || 'Deselect all'}
              </Button>
            )
        }
        {multiple.renderSelectedItemsDescription
          ?.(this.props.selected, activeFilters.length) || (
          <Text info>{`${this.props.selected.length} selected`}</Text>
        )}
      </div>
    );
  };


  // Cache the value because this method is called
  // inside `render` function which can be called N times
  // and should be fast as possible.
  // Cache invalidates each time hidden or userDefinedMaxHeight changes
  private _adjustListMaxHeight = memoizeOne((hidden, userDefinedMaxHeight, ringPopupTarget) => {
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
    return anchorNode != null
      ? Math.min(
        directions.reduce((maxHeight, direction) => (
          Math.max(maxHeight, maxHeightForDirection(
            direction,
            anchorNode,
            getStyles(containerNode).position !== 'static' ? containerNode : null
          ) ?? 0)
        ), minMaxHeight),
        userDefinedMaxHeight
      )
      : userDefinedMaxHeight;
  });

  popupRef = (el: Popup | null) => {
    this.popup = el;
  };

  list?: List<T> | null;
  listRef = (el: List<T> | null) => {
    this.list = el;
  };

  filterRef = (el: HTMLInputElement | null) => {
    this.filter = el;
    this.caret = el && new Caret(el);
  };

  composedFilterRef = createComposedRef<HTMLInputElement>();

  shortcutsScope = getUID('select-popup-');
  shortcutsMap = {
    tab: this.tabPress
  };

  popupFilterShortcutsMap: ShortcutsMap = {
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
    left: event => this.handleNavigation(event, true),
    right: event => this.handleNavigation(event)
  };

  render() {
    const {
      toolbar,
      topbar,
      className,
      multiple,
      hidden,
      isInputMode,
      anchorElement,
      minWidth,
      onCloseAttempt,
      onOutsideClick,
      directions,
      top,
      left,
      offset,
      style,
      dir,
      filter
    } = this.props;
    const classes = classNames(styles.popup, className);

    return (
      <PopupTargetContext.Consumer>
        {ringPopupTarget => {
          const filterWithTags = this.getFilterWithTags();
          const selectAll = multiple && typeof multiple === 'object' && !multiple.limit &&
            multiple.selectAll && this.getSelectAll();
          const list = this.getList(this.props.ringPopupTarget || ringPopupTarget);
          const bottomLine = this.getBottomLine();
          const hasContent = filterWithTags || selectAll || list || bottomLine || toolbar || topbar;
          return (
            <Popup
              trapFocus={false}
              ref={this.popupRef}
              hidden={hidden || !hasContent}
              attached={isInputMode}
              className={classes}
              dontCloseOnAnchorClick
              anchorElement={anchorElement}
              minWidth={minWidth}
              onCloseAttempt={onCloseAttempt}
              onOutsideClick={onOutsideClick}
              directions={directions}
              top={top}
              left={left}
              offset={offset}
              onMouseDown={this.mouseDownHandler}
              target={this.props.ringPopupTarget}
              autoCorrectTopOverflow={false}
              style={style}
            >
              <div dir={dir}>
                {!hidden && filter &&
                  (
                    <Shortcuts
                      map={this.shortcutsMap}
                      scope={this.shortcutsScope}
                    />
                  )}
                {topbar}
                {/* Add empty div to prevent the change of List position in DOM*/}
                {hidden ? <div/> : filterWithTags}
                {selectAll}
                {list}
                {bottomLine}
                {toolbar}
              </div>
            </Popup>
          );
        }}
      </PopupTargetContext.Consumer>
    );
  }
}

(SelectPopup as ComponentType<unknown>).propTypes = {
  activeIndex: PropTypes.number,
  anchorElement: PropTypes.instanceOf(HTMLElement),
  className: PropTypes.string,
  compact: PropTypes.bool,
  data: PropTypes.array,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  directions: PropTypes.array,
  disabled: PropTypes.bool,
  disableMoveOverflow: PropTypes.bool,
  disableScrollToActive: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    value: PropTypes.string,
    placeholder: PropTypes.string
  })]),
  filterValue: PropTypes.string,
  filterIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  filterRef: PropTypes.oneOfType([
    PropTypes.func,
    refObject(PropTypes.instanceOf(HTMLInputElement))
  ]),
  hidden: PropTypes.bool,
  isInputMode: PropTypes.bool,
  listId: PropTypes.string,
  maxHeight: PropTypes.number,
  message: PropTypes.string,
  minWidth: PropTypes.number,
  multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    label: PropTypes.string,
    limit: PropTypes.number,
    selectAll: PropTypes.bool
  })]),
  left: PropTypes.number,
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  onCloseAttempt: PropTypes.func,
  onOutsideClick: PropTypes.func,
  onEmptyPopupEnter: PropTypes.func,
  onFilter: PropTypes.func,
  onLoadMore: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  renderOptimization: PropTypes.bool,
  ringPopupTarget: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.object,
  tags: PropTypes.object,
  toolbar: PropTypes.node,
  topbar: PropTypes.node,
  top: PropTypes.number,
  preventListOverscroll: PropTypes.bool
};

export type SelectPopupAttrs<T = unknown> =
  React.JSX.LibraryManagedAttributes<typeof SelectPopup, SelectPopupProps<T>>
