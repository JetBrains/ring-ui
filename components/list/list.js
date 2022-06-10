/**
 * @name List
 */

import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import VirtualizedList from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
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

import ListLink from './list__link';
import ListItem from './list__item';
import ListCustom from './list__custom';
import ListTitle from './list__title';
import ListSeparator from './list__separator';
import ListHint from './list__hint';
import {DEFAULT_ITEM_TYPE, Dimension, Type} from './consts';

import styles from './list.css';

function noop() {}

const warnEmptyKey = deprecate(
  () => {},
  'No key passed for list item with non-string label. It is considered as a bad practice and has been deprecated, please provide a key.'
);

/**
 * @param {Type} listItemType
 * @param {Object} item list item
 */
function isItemType(listItemType, item) {
  let type = item.rgItemType;
  if (type == null) {
    type = DEFAULT_ITEM_TYPE;
  }
  return type === listItemType;
}

const nonActivatableTypes = [
  Type.SEPARATOR,
  Type.TITLE,
  Type.MARGIN
];

function isActivatable(item) {
  return item != null && !nonActivatableTypes.includes(item.rgItemType) && !item.disabled;
}

const shouldActivateFirstItem = props => props.activateFirstItem ||
    props.activateSingleItem && props.data.length === 1;

export const ActiveItemContext = createStatefulContext(undefined, 'ActiveItem');

/**
 * @name List
 * @constructor
 * @extends {ReactComponent}
 */
/**
 * Displays a list of items.
 */
export default class List extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    hint: PropTypes.node,
    hintOnSelection: PropTypes.string,
    data: PropTypes.array,
    maxHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    activeIndex: PropTypes.number,
    restoreActiveIndex: PropTypes.bool,
    activateSingleItem: PropTypes.bool,
    activateFirstItem: PropTypes.bool,
    shortcuts: PropTypes.bool,
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
    ariaLabel: PropTypes.string
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

  constructor(...args) {
    super(...args);
    this.scheduleScrollListener = scheduleRAF();
    this.scheduleHoverListener = scheduleRAF();
  }

  state = {
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

  static getDerivedStateFromProps(nextProps, prevState) {
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

    if (
      activeIndex == null &&
      prevState.activeIndex == null &&
      shouldActivateFirstItem(nextProps)
    ) {
      const firstActivatableIndex = data.findIndex(isActivatable);
      if (firstActivatableIndex >= 0) {
        Object.assign(nextState, {
          activeIndex: firstActivatableIndex,
          activeItem: data[firstActivatableIndex],
          needScrollToActive: true
        });
      }
    }

    return nextState;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('keydown', this.onDocumentKeyDown, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props ||
      Object.keys(nextState).some(key => nextState[key] !== this.state[key]);
  }

  componentDidUpdate(prevProps) {
    if (this.virtualizedList && prevProps.data !== this.props.data) {
      this.virtualizedList.recomputeRowHeights();
    }

    this.checkOverflow();
  }

  componentWillUnmount() {
    this.unmounted = true;
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('keydown', this.onDocumentKeyDown, true);
  }

  static isItemType = isItemType;

  static ListHint = ListHint;

  static ListProps = {
    Type,
    Dimension
  };

  hoverHandler = memoize(index => () =>
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

  _activatableItems = false;

  // eslint-disable-next-line no-magic-numbers
  _bufferSize = 10; // keep X items above and below of the visible area
  // reuse size cache for similar items
  sizeCacheKey = index => {
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

  _cache = new CellMeasurerCache({
    defaultHeight: this.defaultItemHeight(),
    fixedWidth: true,
    keyMapper: this.sizeCacheKey
  });

  _hasActivatableItems = memoizeOne(items => items.some(isActivatable));
  hasActivatableItems() {
    return this._hasActivatableItems(this.props.data);
  }

  selectHandler = memoize(index => (event, tryKeepOpen = false) => {
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

  checkboxHandler = memoize(index => event => this.selectHandler(index)(event, true));

  upHandler = e => {
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

  downHandler = e => {
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

  homeHandler = e => {
    this.moveHandler(0, this.downHandler, e);
  };

  endHandler = e => {
    this.moveHandler(this.props.data.length - 1, this.upHandler, e);
  };

  onDocumentMouseMove = () => {
    if (this.state.disabledHover) {
      this.setState({disabledHover: false});
    }
  };

  onDocumentKeyDown = e => {
    const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers
    if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
      this.setState({disabledHover: true});
    }
  };

  moveHandler(index, retryCallback, e) {
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

  enterHandler = (event, shortcut) => {
    if (this.state.activeIndex !== null) {
      const item = this.props.data[this.state.activeIndex];
      this.selectHandler(this.state.activeIndex)(event);

      if (item.href && !event.defaultPrevented) {
        if (['command+enter', 'ctrl+enter'].includes(shortcut)) {
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
    return this.props.data[this.state.activeIndex];
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

  getVisibleListHeight(props) {
    return props.maxHeight - this.defaultItemHeight() - Dimension.INNER_PADDING;
  }

  _deprecatedGenerateKeyFromContent(itemProps) {
    const identificator = itemProps.label || itemProps.description;
    const isString = typeof identificator === 'string' || identificator instanceof String;
    if (identificator && !isString) {
      warnEmptyKey();
      `${itemProps.rgItemType}_${JSON.stringify(identificator)}`;
    }
    return `${itemProps.rgItemType}_${identificator}`;
  }

  getId(item) {
    return item != null ? `${this.id}:${item.key || this._deprecatedGenerateKeyFromContent(item)}` : null;
  }

  renderItem = ({index, style, isScrolling, parent, key}) => {
    let itemKey;
    let el;

    const realIndex = index - 1;

    const item = this.props.data[realIndex];

    const itemId = this.getId(item);
    // top and bottom margins
    if (index === 0 || index === this.props.data.length + 1 || item.rgItemType === Type.MARGIN) {
      itemKey = key || `${Type.MARGIN}_${index}`;
      el = <div style={{height: Dimension.MARGIN}}/>;
    } else {

      // Hack around SelectNG implementation
      const {selectedLabel, originalModel, ...cleanedProps} = item;
      const itemProps = Object.assign({rgItemType: DEFAULT_ITEM_TYPE}, cleanedProps);

      if (itemProps.url) {
        itemProps.href = itemProps.url;
      }
      if (itemProps.href) {
        itemProps.rgItemType = Type.LINK;
      }

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

      let ItemComponent;
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

      el = <ItemComponent {...itemProps}/>;
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
            <div ref={registerChild} style={style} role="row" id={itemId}>
              <div role="cell">
                {el}
              </div>
            </div>
          )}
        </CellMeasurer>
      )
      : (
        <div role="row" id={itemId} key={itemKey}>
          <div role="cell">{cloneElement(el)}</div>
        </div>
      );
  };

  addItemDataTestToProp = props => {
    props['data-test'] = dataTests('ring-list-item', props['data-test']);
    return props;
  };

  virtualizedListRef = el => {
    this.virtualizedList = el;
  };

  containerRef = el => {
    this.container = el;
  };

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
  }) {
    const dirOverride = {direction: 'auto'}; // Virtualized sets "direction: ltr" by default https://github.com/bvaughn/react-virtualized/issues/457
    return (
      <AutoSizer disableHeight onResize={this.props.onResize}>
        {({width}) => (
          <div ref={registerChild}>
            <VirtualizedList
              aria-label={this.props.ariaLabel}
              ref={this.virtualizedListRef}
              className="ring-list__i"
              autoHeight={autoHeight}
              style={maxHeight ? {maxHeight, height: 'auto', ...dirOverride} : dirOverride}
              autoContainerWidth
              height={height}
              width={width}
              isScrolling={isScrolling}
              onScroll={e => {
                onChildScroll(e);
                this.scrollEndHandler(e);
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

  renderVirtualized(maxHeight, rowCount) {
    if (maxHeight) {
      return this.renderVirtualizedInner({height: maxHeight, maxHeight, rowCount});
    }

    return (
      <WindowScroller>
        {props => this.renderVirtualizedInner({...props, rowCount, autoHeight: true})}
      </WindowScroller>
    );
  }

  renderSimple(maxHeight, rowCount) {
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
            ? {maxHeight: this.getVisibleListHeight(this.props)}
            : null
          }
        >
          {items}
        </div>
      </div>
    );
  }

  id = getUID('list-');
  shortcutsScope = this.id;
  shortcutsMap = {
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
    const fadeStyles = hint ? {bottom: Dimension.ITEM_HEIGHT} : null;

    const rowCount = this.props.data.length + 2;

    const maxHeight = this.props.maxHeight && this.getVisibleListHeight(this.props);

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
              map={this.shortcutsMap}
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
