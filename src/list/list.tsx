/**
 * @name List
 */

import {
  Component,
  ReactNode,
  ReactElement,
  SyntheticEvent,
  ComponentType,
  RefCallback
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import VirtualizedList, {ListRowProps} from 'react-virtualized/dist/es/List';
import AutoSizer, {Size} from 'react-virtualized/dist/es/AutoSizer';
import WindowScroller, {WindowScrollerChildProps} from 'react-virtualized/dist/es/WindowScroller';
import {CellMeasurer, CellMeasurerCache} from 'react-virtualized/dist/es/CellMeasurer';
import deprecate from 'util-deprecate';
import memoizeOne from 'memoize-one';

import dataTests from '../global/data-tests';
import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import memoize from '../global/memoize';
import {preventDefault} from '../global/dom';
import Shortcuts from '../shortcuts/shortcuts';

import createStatefulContext from '../global/create-stateful-context';

import {ShortcutsMap} from '../shortcuts/core';

import ListLink from './list__link';
import ListItem from './list__item';
import ListCustom from './list__custom';
import ListTitle from './list__title';
import ListSeparator from './list__separator';
import ListHint from './list__hint';
import {
  DEFAULT_ITEM_TYPE,
  Dimension,
  ListDataItem, ListDataItemProps,
  Type
} from './consts';

import styles from './list.css';

export type {ListDataItem};

function noop() {}

const warnEmptyKey = deprecate(
  () => {},
  'No key passed for list item with non-string label. It is considered as a bad practice and has been deprecated, please provide a key.'
);

/**
 * @param {Type} listItemType
 * @param {Object} item list item
 */
function isItemType<T>(listItemType: Type, item: ListDataItem<T>) {
  let type = item.rgItemType;
  if (type == null) {
    type = DEFAULT_ITEM_TYPE;
  }
  return type === listItemType;
}

const nonActivatableTypes: Array<Type | null | undefined> = [
  Type.SEPARATOR,
  Type.TITLE,
  Type.MARGIN
];

function isActivatable<T>(item: ListDataItem<T> | null) {
  return item != null && !nonActivatableTypes.includes(item.rgItemType) && !item.disabled;
}

function getDataHash<T>(data: readonly ListDataItem<T>[]): string {
  return data.map(it => `${it.key}-${it.disabled}`).join('-');
}

export interface SelectHandlerParams {
  tryKeepOpen?: boolean
}

export interface ListProps<T = unknown> {
  data: readonly ListDataItem<T>[]
  restoreActiveIndex: boolean
  activateSingleItem: boolean
  activateFirstItem: boolean
  onMouseOut: (e: SyntheticEvent<HTMLElement>) => void
  onSelect: (item: ListDataItem<T>, event: Event | SyntheticEvent, params?: SelectHandlerParams) =>
    void
  onScrollToBottom: () => void
  onResize: (info: Size) => void
  shortcuts: boolean
  shortcutsMap?: ShortcutsMap;
  renderOptimization: boolean
  disableMoveDownOverflow: boolean
  ariaLabel: string
  id?: string | undefined
  className?: string | null | undefined
  hint?: ReactNode
  hintOnSelection?: string | null | undefined
  maxHeight?: number | null | undefined
  activeIndex?: number | null | undefined
  useMouseUp?: boolean | null | undefined
  visible?: boolean | null | undefined
  disableMoveOverflow?: boolean | null | undefined
  compact?: boolean | null | undefined
  disableScrollToActive?: boolean | null | undefined
  hidden?: boolean | null | undefined
  preventListOverscroll?: boolean | undefined
}

const shouldActivateFirstItem = <T, >(props: ListProps<T>) => props.activateFirstItem ||
    props.activateSingleItem && props.data.length === 1;

export const ActiveItemContext = createStatefulContext<string | undefined>(undefined, 'ActiveItem');

export interface ListState<T = unknown> {
  activeIndex: number | null
  prevActiveIndex: number | null
  prevData: ListDataItem<T>[]
  activeItem: ListDataItem<T> | null
  needScrollToActive: boolean
  scrolling: boolean
  hasOverflow: boolean
  disabledHover: boolean
  scrolledToBottom: boolean
}

interface RenderVirtualizedInnerParams extends Partial<WindowScrollerChildProps> {
  height: number
  maxHeight?: number
  autoHeight?: boolean
  rowCount: number
}

/**
 * @name List
 * @constructor
 * @extends {ReactComponent}
 */
/**
 * Displays a list of items.
 */
export default class List<T = unknown> extends Component<ListProps<T>, ListState<T>> {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    hint: PropTypes.node,
    hintOnSelection: PropTypes.string,
    data: PropTypes.array,
    maxHeight: PropTypes.number,
    activeIndex: PropTypes.number,
    restoreActiveIndex: PropTypes.bool,
    activateSingleItem: PropTypes.bool,
    activateFirstItem: PropTypes.bool,
    shortcuts: PropTypes.bool,
    shortcutsMap: PropTypes.object,
    onMouseOut: PropTypes.func,
    onSelect: PropTypes.func,
    onScrollToBottom: PropTypes.func,
    onResize: PropTypes.func,
    useMouseUp: PropTypes.bool,
    visible: PropTypes.bool,
    renderOptimization: PropTypes.bool,
    disableMoveOverflow: PropTypes.bool,
    disableMoveDownOverflow: PropTypes.bool,
    compact: PropTypes.bool,
    disableScrollToActive: PropTypes.bool,
    hidden: PropTypes.bool,
    ariaLabel: PropTypes.string,
    preventListOverscroll: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    restoreActiveIndex: false, // restore active item using its "key" property
    activateSingleItem: false, // if there is only one item, activate it
    activateFirstItem: false, // if there no active items, activate the first one
    onMouseOut: noop,
    onSelect: noop,
    onScrollToBottom: noop,
    onResize: noop,
    shortcuts: false,
    renderOptimization: true,
    disableMoveDownOverflow: false,
    ariaLabel: 'List'
  };

  state: ListState<T> = {
    activeIndex: null,
    prevActiveIndex: null,
    prevData: [],
    activeItem: null,
    needScrollToActive: false,
    scrolling: false,
    hasOverflow: false,
    disabledHover: false,
    scrolledToBottom: false
  };

  static getDerivedStateFromProps(nextProps: ListProps, prevState: ListState) {
    const {prevActiveIndex, prevData, activeItem} = prevState;
    const {data, activeIndex, restoreActiveIndex} = nextProps;
    const nextState = {prevActiveIndex: activeIndex, prevData: data};

    if (data !== prevData) {
      Object.assign(nextState, {
        activeIndex: null,
        activeItem: null
      });
    }

    if (activeIndex != null && activeIndex !== prevActiveIndex && data[activeIndex] != null) {
      Object.assign(nextState, {
        activeIndex,
        activeItem: data[activeIndex],
        needScrollToActive: true
      });
    } else if (
      data !== prevData &&
      restoreActiveIndex &&
      activeItem != null &&
      activeItem.key != null
    ) {
      // Restore active index if there is an item with the same "key" property
      const index = data.findIndex(item => item.key === activeItem.key);
      if (index >= 0) {
        Object.assign(nextState, {
          activeIndex: index,
          activeItem: data[index]
        });
      }
    }

    return nextState;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('keydown', this.onDocumentKeyDown, true);

    if (this.props.activeIndex == null && shouldActivateFirstItem(this.props)) {
      this.activateFirst();
    }
  }

  shouldComponentUpdate(nextProps: ListProps<T>, nextState: ListState<T>) {
    return nextProps !== this.props ||
      (Object.keys(nextState) as Array<keyof ListState>).
        some(key => nextState[key] !== this.state[key]);
  }

  componentDidUpdate(prevProps: ListProps<T>) {
    if (this.virtualizedList && prevProps.data !== this.props.data) {
      this.virtualizedList.recomputeRowHeights();
    }

    const {activeIndex} = this.state;
    const isActiveItemRetainedPosition = activeIndex
      ? prevProps.data[activeIndex]?.key === this.props.data[activeIndex]?.key
      : false;

    if (this.props.activeIndex == null &&
      getDataHash(this.props.data) !== getDataHash(prevProps.data) &&
      shouldActivateFirstItem(this.props) &&
      !isActiveItemRetainedPosition
    ) {
      this.activateFirst();
    }

    this.checkOverflow();
  }

  componentWillUnmount() {
    this.unmounted = true;
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('keydown', this.onDocumentKeyDown, true);
  }

  scheduleScrollListener = scheduleRAF();
  scheduleHoverListener = scheduleRAF();

  static isItemType = isItemType;

  static ListHint = ListHint;

  static ListProps = {
    Type,
    Dimension
  };

  virtualizedList?: VirtualizedList | null;
  unmounted?: boolean;
  container?: HTMLElement | null;

  hoverHandler = memoize((index: number) => () =>
    this.scheduleHoverListener(() => {
      if (this.state.disabledHover) {
        return;
      }

      if (this.container) {
        this.setState({
          activeIndex: index,
          activeItem: this.props.data[index],
          needScrollToActive: false
        });
      }
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private _bufferSize = 10; // keep X items above and below of the visible area
  // reuse size cache for similar items
  sizeCacheKey = (index: number) => {
    if (index === 0 || index === this.props.data.length + 1) {
      return Type.MARGIN;
    }

    const item = this.props.data[index - 1];
    const isFirst = index === 1;
    switch (item.rgItemType) {
      case Type.SEPARATOR:
      case Type.TITLE:
        return `${item.rgItemType}${isFirst ? '_first' : ''}${item.description ? '_desc' : ''}`;
      case Type.MARGIN:
        return Type.MARGIN;
      case Type.CUSTOM:
        return `${Type.CUSTOM}_${item.key}`;
      case Type.ITEM:
      case Type.LINK:
      default:
        if (item.details) {
          return `${Type.ITEM}_${item.details}`;
        }
        return Type.ITEM;
    }
  };

  private _cache = new CellMeasurerCache({
    defaultHeight: this.defaultItemHeight(),
    fixedWidth: true,
    keyMapper: this.sizeCacheKey
  });

  private _hasActivatableItems = memoizeOne(items => items.some(isActivatable));
  hasActivatableItems() {
    return this._hasActivatableItems(this.props.data);
  }

  activateFirst = () => {
    const firstActivatableIndex = this.props.data.findIndex(isActivatable);
    if (firstActivatableIndex >= 0) {
      this.setState({
        activeIndex: firstActivatableIndex,
        activeItem: this.props.data[firstActivatableIndex],
        needScrollToActive: true
      });
    }
  };

  selectHandler = memoize((index: number) =>
    (event: Event | SyntheticEvent, tryKeepOpen = false) => {
      const item = this.props.data[index];
      if (!this.props.useMouseUp && item.onClick) {
        item.onClick(item, event);
      } else if (this.props.useMouseUp && item.onMouseUp) {
        item.onMouseUp(item, event);
      }

      if (this.props.onSelect) {
        this.props.onSelect(item, event, {tryKeepOpen});
      }
    });

  checkboxHandler =
    memoize((index: number) => (event: SyntheticEvent) => this.selectHandler(index)(event, true));

  upHandler = (e: KeyboardEvent) => {
    const {data, disableMoveOverflow} = this.props;
    const index = this.state.activeIndex;
    let newIndex;

    if (index === null || index === 0) {
      if (!disableMoveOverflow) {
        newIndex = data.length - 1;
      } else {
        return;
      }
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, this.upHandler, e);
  };

  downHandler = (e: KeyboardEvent) => {
    const {data, disableMoveOverflow, disableMoveDownOverflow} = this.props;
    const index = this.state.activeIndex;
    let newIndex;

    if (index === null) {
      newIndex = 0;
    } else if (index + 1 === data.length) {
      if (!disableMoveOverflow && !disableMoveDownOverflow) {
        newIndex = 0;
      } else {
        return;
      }
    } else {
      newIndex = index + 1;
    }

    this.moveHandler(newIndex, this.downHandler, e);
  };

  homeHandler = (e: KeyboardEvent) => {
    this.moveHandler(0, this.downHandler, e);
  };

  endHandler = (e: KeyboardEvent) => {
    this.moveHandler(this.props.data.length - 1, this.upHandler, e);
  };

  onDocumentMouseMove = () => {
    if (this.state.disabledHover) {
      this.setState({disabledHover: false});
    }
  };

  onDocumentKeyDown = (e: KeyboardEvent) => {
    const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line @typescript-eslint/no-magic-numbers
    if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
      this.setState({disabledHover: true});
    }
  };

  moveHandler(index: number, retryCallback: (e: KeyboardEvent) => void, e: KeyboardEvent) {
    let correctedIndex;
    if (this.props.data.length === 0 || !this.hasActivatableItems()) {
      return;
    } else if (this.props.data.length < index) {
      correctedIndex = 0;
    } else {
      correctedIndex = index;
    }

    const item = this.props.data[correctedIndex];
    this.setState(
      {
        activeIndex: correctedIndex,
        activeItem: item,
        needScrollToActive: true
      },
      function onSet() {
        if (!isActivatable(item)) {
          retryCallback(e);
          return;
        }

        if (e.key !== 'Home' && e.key !== 'End') {
          preventDefault(e);
        }
      }
    );
  }

  mouseHandler = () => {
    this.setState({scrolling: false});
  };

  scrollHandler = () => {
    this.setState({scrolling: true}, this.scrollEndHandler);
  };

  enterHandler = (event: KeyboardEvent, shortcut?: string) => {
    if (this.state.activeIndex !== null) {
      const item = this.props.data[this.state.activeIndex];
      this.selectHandler(this.state.activeIndex)(event);

      if (item.href && !event.defaultPrevented) {
        if (shortcut != null && ['command+enter', 'ctrl+enter'].includes(shortcut)) {
          window.open(item.href, '_blank');
        } else if (shortcut === 'shift+enter') {
          window.open(item.href);
        } else {
          window.location.href = item.href;
        }
      }
      return false; // do not propagate event
    } else {
      return true; // propagate event to the parent component (e.g., QueryAssist)
    }
  };

  getFirst() {
    return this.props.data.find(
      item => item.rgItemType === Type.ITEM || item.rgItemType === Type.CUSTOM
    );
  }

  getSelected() {
    return this.state.activeIndex != null ? this.props.data[this.state.activeIndex] : null;
  }

  clearSelected = () => {
    this.setState({
      activeIndex: null,
      needScrollToActive: false
    });
  };

  defaultItemHeight() {
    return this.props.compact ? Dimension.COMPACT_ITEM_HEIGHT : Dimension.ITEM_HEIGHT;
  }

  scrollEndHandler = () => this.scheduleScrollListener(() => {
    const innerContainer = this.inner;
    if (innerContainer) {
      const maxScrollingPosition = innerContainer.scrollHeight;
      const sensitivity = this.defaultItemHeight() / 2;
      const currentScrollingPosition =
        innerContainer.scrollTop + innerContainer.clientHeight + sensitivity;
      const scrolledToBottom =
        maxScrollingPosition > 0 && currentScrollingPosition >= maxScrollingPosition;
      if (!this.unmounted) {
        this.setState({scrolledToBottom});
      }
      if (scrolledToBottom) {
        this.props.onScrollToBottom();
      }
    }
  });

  checkOverflow = () => {
    if (this.inner) {
      this.setState({
        hasOverflow: this.inner.scrollHeight - this.inner.clientHeight > 1
      });
    }
  };

  getVisibleListHeight(maxHeight: number) {
    return maxHeight - this.defaultItemHeight() - Dimension.INNER_PADDING;
  }

  private _deprecatedGenerateKeyFromContent(itemProps: ListDataItem<T>) {
    const identificator = itemProps.label || itemProps.description;
    const isString = typeof identificator === 'string' || identificator instanceof String;
    if (identificator && !isString) {
      warnEmptyKey();
      `${itemProps.rgItemType}_${JSON.stringify(identificator)}`;
    }
    return `${itemProps.rgItemType}_${identificator}`;
  }

  getId(item: ListDataItem<T> | null) {
    return item != null ? `${this.id}:${item.key || this._deprecatedGenerateKeyFromContent(item)}` : undefined;
  }

  renderItem = ({index = 1, style, isScrolling = false, parent, key}: Partial<ListRowProps>) => {
    let itemKey;
    let el: ReactElement;

    const realIndex = index - 1;

    const item = this.props.data[realIndex];

    const itemId = this.getId(item);
    // top and bottom margins
    if (index === 0 || index === this.props.data.length + 1 || item.rgItemType === Type.MARGIN) {
      itemKey = key || `${Type.MARGIN}_${index}`;
      el = <div style={{height: Dimension.MARGIN}}/>;
    } else {

      // Hack around SelectNG implementation
      const {selectedLabel, originalModel, ...restProps} = item;
      const cleanedProps = restProps as ListDataItem<T>;
      if (cleanedProps.url) {
        cleanedProps.href = cleanedProps.url;
      }
      if (cleanedProps.href) {
        cleanedProps.rgItemType = Type.LINK;
      }
      cleanedProps.description = typeof cleanedProps.description === 'string'
        ? cleanedProps.description.trim()
        : cleanedProps.description;
      const itemProps =
        Object.assign({rgItemType: DEFAULT_ITEM_TYPE}, restProps) as ListDataItemProps<T>;


      itemKey = key || itemId;

      itemProps.hover = (realIndex === this.state.activeIndex);
      if (itemProps.hoverClassName != null && itemProps.hover) {
        itemProps.className = classNames(itemProps.className, itemProps.hoverClassName);
      }
      itemProps.onMouseOver = this.hoverHandler(realIndex);
      itemProps.tabIndex = -1;
      itemProps.scrolling = isScrolling;

      const selectHandler = this.selectHandler(realIndex);

      if (this.props.useMouseUp) {
        itemProps.onMouseUp = selectHandler;
      } else {
        itemProps.onClick = selectHandler;
      }
      itemProps.onCheckboxChange = this.checkboxHandler(realIndex);

      if (itemProps.compact == null) {
        itemProps.compact = this.props.compact;
      }

      let ItemComponent: ComponentType<ListDataItemProps<T>>;
      const isFirst = index === 1;
      switch (itemProps.rgItemType) {
        case Type.SEPARATOR:
          ItemComponent = ListSeparator;
          itemProps.isFirst = isFirst;
          break;
        case Type.LINK:
          ItemComponent = ListLink;
          this.addItemDataTestToProp(itemProps);
          break;
        case Type.ITEM:
          ItemComponent = ListItem;
          this.addItemDataTestToProp(itemProps);
          break;
        case Type.CUSTOM:
          ItemComponent = ListCustom;
          this.addItemDataTestToProp(itemProps);
          break;
        case Type.TITLE:
          itemProps.isFirst = isFirst;
          ItemComponent = ListTitle;
          break;
        default:
          throw new Error(`Unknown menu element type: ${itemProps.rgItemType}`);
      }

      el = <ItemComponent {...itemProps} key={itemProps.key}/>;
    }

    return parent
      ? (
        <CellMeasurer
          cache={this._cache}
          key={itemKey}
          parent={parent}
          rowIndex={index}
          columnIndex={0}
        >
          {({registerChild}) => (
            <div ref={registerChild as RefCallback<Element>} style={style} role="row" id={itemId}>
              <div role="cell">
                {el}
              </div>
            </div>
          )}
        </CellMeasurer>
      )
      : (
        <div role="row" id={itemId} key={itemKey}>
          <div role="cell">{el}</div>
        </div>
      );
  };

  addItemDataTestToProp = (props: ListDataItemProps<T>) => {
    props['data-test'] = dataTests('ring-list-item', props['data-test']);
    return props;
  };

  virtualizedListRef = (el: VirtualizedList | null) => {
    this.virtualizedList = el;
  };

  containerRef = (el: HTMLElement | null) => {
    this.container = el;
  };

  private _inner?: HTMLElement | null;
  get inner() {
    if (!this._inner) {
      this._inner = this.container && this.container.querySelector('.ring-list__i');
    }
    return this._inner;
  }

  renderVirtualizedInner({
    height,
    maxHeight,
    autoHeight = false,
    rowCount,
    isScrolling,
    onChildScroll = noop,
    scrollTop,
    registerChild
  }: RenderVirtualizedInnerParams) {
    const dirOverride = {direction: 'inherit'} as const; // Virtualized sets "direction: ltr" by default https://github.com/bvaughn/react-virtualized/issues/457
    return (
      <AutoSizer disableHeight onResize={this.props.onResize}>
        {({width}) => (
          <div ref={registerChild as never}>
            <VirtualizedList
              aria-label={this.props.ariaLabel}
              ref={this.virtualizedListRef}
              className={classNames('ring-list__i',
                {[styles.overscrollNone]: this.props.preventListOverscroll})}
              autoHeight={autoHeight}
              style={maxHeight ? {maxHeight, height: 'auto', ...dirOverride} : dirOverride}
              autoContainerWidth
              height={height}
              width={width}
              isScrolling={isScrolling}
              onScroll={e => {
                onChildScroll(e);
                this.scrollEndHandler();
              }}
              scrollTop={scrollTop}
              rowCount={rowCount}
              estimatedRowSize={this.defaultItemHeight()}
              rowHeight={this._cache.rowHeight}
              rowRenderer={this.renderItem}
              overscanRowCount={this._bufferSize}

              // ensure rerendering
              noop={() => {}}

              scrollToIndex={
                !this.props.disableScrollToActive &&
                  this.state.needScrollToActive &&
                  this.state.activeIndex != null
                  ? this.state.activeIndex + 1
                  : undefined
              }
              scrollToAlignment="center"
              deferredMeasurementCache={this._cache}
              onRowsRendered={this.checkOverflow}
            />
          </div>
        )}
      </AutoSizer>
    );
  }

  renderVirtualized(maxHeight: number | null | undefined, rowCount: number) {
    if (maxHeight) {
      return this.renderVirtualizedInner({height: maxHeight, maxHeight, rowCount});
    }

    return (
      <WindowScroller>
        {props => this.renderVirtualizedInner({...props, rowCount, autoHeight: true})}
      </WindowScroller>
    );
  }

  renderSimple(maxHeight: number | null | undefined, rowCount: number) {
    const items = [];

    for (let index = 0; index < rowCount; index++) {
      items.push(this.renderItem({
        index,
        isScrolling: this.state.scrolling
      }));
    }

    return (
      <div
        className={classNames('ring-list__i', styles.simpleInner)}
        onScroll={this.scrollHandler}
        onMouseMove={this.mouseHandler}
      >
        <div
          aria-label={this.props.ariaLabel}
          role="grid"
          style={maxHeight
            ? {maxHeight: this.getVisibleListHeight(maxHeight)}
            : undefined
          }
        >
          {items}
        </div>
      </div>
    );
  }

  id = getUID('list-');
  shortcutsScope = this.id;
  shortcutsMap: ShortcutsMap = {
    up: this.upHandler,
    down: this.downHandler,
    home: this.homeHandler,
    end: this.endHandler,
    enter: this.enterHandler,
    'meta+enter': this.enterHandler,
    'ctrl+enter': this.enterHandler,
    'command+enter': this.enterHandler,
    'shift+enter': this.enterHandler
  };

  /** @override */
  render() {
    const hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    const fadeStyles = hint ? {bottom: Dimension.ITEM_HEIGHT} : undefined;

    const rowCount = this.props.data.length + 2;

    const maxHeight = this.props.maxHeight && this.getVisibleListHeight(this.props.maxHeight);

    const classes = classNames(styles.list, this.props.className);

    return (
      <>
        <ActiveItemContext.Updater
          value={this.getId(this.state.activeItem)}
          skipUpdate={this.props.hidden || !isActivatable(this.state.activeItem)}
        />
        <div
          id={this.props.id}
          ref={this.containerRef}
          className={classes}
          onMouseOut={this.props.onMouseOut}
          onBlur={this.props.onMouseOut}
          onMouseLeave={this.clearSelected}
          data-test="ring-list"
        >
          {this.props.shortcuts &&
          (
            <Shortcuts
              map={this.props.shortcutsMap
                ? {...this.shortcutsMap, ...this.props.shortcutsMap}
                : this.shortcutsMap}
              scope={this.shortcutsScope}
            />
          )
          }
          {this.props.renderOptimization
            ? this.renderVirtualized(maxHeight, rowCount)
            : this.renderSimple(maxHeight, rowCount)
          }
          {this.state.hasOverflow && !this.state.scrolledToBottom && (
            <div
              className={styles.fade}
              style={fadeStyles}
            />
          )}
          {hint && (
            <ListHint
              label={hint}
            />
          )}
        </div>
      </>
    );
  }
}

export type ListAttrs<T = unknown> = React.JSX.LibraryManagedAttributes<typeof List, ListProps<T>>
