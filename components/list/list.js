/**
 * @name List
 * @category Components
 * @tags Ring UI Language
 * @description Displays a list of items.
 */

import 'dom4';
import 'core-js/modules/es6.array.find';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'mout/function/debounce';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import {CellMeasurer, CellMeasurerCache} from 'react-virtualized/dist/commonjs/CellMeasurer';

import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import memoize from '../global/memoize';
import {preventDefault} from '../global/dom';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';

import styles from './list.css';
import ListItem from './list__item';
import ListCustom from './list__custom';
import ListLink from './list__link';
import ListTitle from './list__title';
import ListSeparator from './list__separator';
import ListHint from './list__hint';

/**
 * @enum {number}
 */
const Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2,
  HINT: 3,
  CUSTOM: 4,
  TITLE: 5,
  MARGIN: 6
};
const SCROLL_HANDLER_DEBOUNCE = 100;

const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
  COMPACT_ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 25,
  SEPARATOR_FIRST_HEIGHT: 16,
  SEPARATOR_TEXT_HEIGHT: 18,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8,
  MARGIN: 4
};

const DEFAULT_ITEM_TYPE = Type.ITEM;

function noop() {}

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

/**
 * @name List
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./list.examples.html
 */
export default class List extends RingComponentWithShortcuts {
  static isItemType = isItemType;

  static ListProps = {
    Type,
    Dimension
  };

  static propTypes = {
    className: PropTypes.string,
    hint: PropTypes.string,
    hintOnSelection: PropTypes.string,
    data: PropTypes.array,
    maxHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    restoreActiveIndex: PropTypes.bool,
    activateSingleItem: PropTypes.bool,
    activateFirstItem: PropTypes.bool,
    shortcuts: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onSelect: PropTypes.func,
    onScrollToBottom: PropTypes.func,
    useMouseUp: PropTypes.bool,
    visible: PropTypes.bool,
    renderOptimization: PropTypes.bool,
    disableMoveDownOverflow: PropTypes.bool,
    compact: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    restoreActiveIndex: false, // restore active item using its "key" property
    activateSingleItem: false, // if there is only one item, activate it
    activateFirstItem: false, // if there no active items, activate the first one
    onMouseOut: noop,
    onSelect: noop,
    onScrollToBottom: noop,
    shortcuts: false,
    renderOptimization: true,
    disableMoveDownOverflow: false
  };

  static ListHint = ListHint;

  state = {
    activeIndex: null,
    activeItem: null,
    needScrollToActive: false,
    scrolling: false,
    hasOverflow: false
  };

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

  hoverScheduler = scheduleRAF();

  hasActivatableItems() {
    return this._activatableItems;
  }

  checkActivatableItems(items) {
    this._activatableItems = false;
    for (let i = 0; i < items.length; i++) {
      if (this.isActivatable(items[i])) {
        this._activatableItems = true;
        return;
      }
    }
  }

  isActivatable(item) {
    return !(item.rgItemType === Type.HINT ||
      item.rgItemType === Type.SEPARATOR ||
      item.rgItemType === Type.TITLE ||
      item.disabled);
  }

  hoverHandler = memoize(index => () =>
    this.hoverScheduler(() => {
      if (this.node) {
        this.setState({
          activeIndex: index,
          activeItem: this.props.data[index],
          needScrollToActive: false
        });
      }
    })
  );

  selectHandler = memoize(index => event => {
    const item = this.props.data[index];
    if (!this.props.useMouseUp && item.onClick) {
      item.onClick(item, event);
    } else if (this.props.useMouseUp && item.onMouseUp) {
      item.onMouseUp(item, event);
    }

    if (this.props.onSelect) {
      this.props.onSelect(item, event);
    }
  });

  upHandler = e => {
    const index = this.state.activeIndex;
    let newIndex;

    if (index === null || index === 0) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, this.upHandler, e);
  }

  downHandler = e => {
    const index = this.state.activeIndex;
    let newIndex;

    if ((index === null || index + 1 === this.props.data.length)) {
      if (!this.props.disableMoveDownOverflow) {
        newIndex = 0;
      } else {
        return;
      }
    } else {
      newIndex = index + 1;
    }

    this.moveHandler(newIndex, this.downHandler, e);
  }

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
        if (!this.isActivatable(item)) {
          retryCallback(e);
          return;
        }

        preventDefault(e);
      }
    );
  }

  mouseHandler = () => {
    this.setState({scrolling: false});
  }

  scrollHandler = () => {
    this.setState({scrolling: true}, this.scrollEndHandler);
  }

  enterHandler = event => {
    if (this.state.activeIndex !== null) {
      const item = this.props.data[this.state.activeIndex];
      this.selectHandler(this.state.activeIndex)(event);

      if (item.href && !event.defaultPrevented) {
        window.location.href = item.href;
      }
      return false; // do not propagate event
    } else {
      return true; // propagate event to the parent component (e.g., QueryAssist)
    }
  }

  getFirst() {
    return this.props.data.find(item => item.rgItemType === Type.ITEM);
  }

  getSelected() {
    return this.props.data[this.state.activeIndex];
  }

  clearSelected() {
    this.setState({
      activeIndex: null,
      needScrollToActive: false
    });
  }

  willMount() {
    this.checkActivatableItems(this.props.data);
    if (this.props.activeIndex != null && this.props.data[this.props.activeIndex]) {
      this.setState({
        activeIndex: this.props.activeIndex,
        activeItem: this.props.data[this.props.activeIndex],
        needScrollToActive: true
      });
    }
  }

  willReceiveProps(props) {
    if (props.data) {
      //TODO investigate (https://youtrack.jetbrains.com/issue/RG-772)
      //props.data = props.data.map(normalizeListItemType);

      this.checkActivatableItems(props.data);

      let activeIndex = null;
      let activeItem = null;

      if (
        props.restoreActiveIndex &&
        this.state.activeItem &&
        this.state.activeItem.key !== undefined &&
        this.state.activeItem.key !== null
      ) {
        for (let i = 0; i < props.data.length; i++) {
          // Restore active index if there is an item with the same "key" property
          if (props.data[i].key !== undefined && props.data[i].key === this.state.activeItem.key) {
            activeIndex = i;
            activeItem = props.data[i];
            break;
          }
        }
      }

      if (
        activeIndex === null &&
        this.shouldActivateFirstItem(props) &&
        this.isActivatable(props.data[0])
      ) {
        activeIndex = 0;
        activeItem = props.data[0];
      } else if (
        props.activeIndex != null &&
        props.activeIndex !== this.props.activeIndex &&
        props.data[props.activeIndex]
      ) {
        activeIndex = props.activeIndex;
        activeItem = props.data[props.activeIndex];
      }

      this.setState({
        activeIndex,
        activeItem,
        needScrollToActive: true
      });
    }
  }

  shouldUpdate(nextProps, nextState) {
    return nextProps !== this.props ||
      Object.keys(nextState).some(key => nextState[key] !== this.state[key]);
  }

  didUpdate(prevProps) {
    if (this.virtualizedList && prevProps.data.length !== this.props.data.length) {
      this.virtualizedList.recomputeRowHeights();
    }
    this.checkOverflow();
  }

  defaultItemHeight() {
    return this.props.compact ? Dimension.COMPACT_ITEM_HEIGHT : Dimension.ITEM_HEIGHT;
  }

  shouldActivateFirstItem(props) {
    return props.activateFirstItem ||
      props.activateSingleItem && props.length === 1;
  }

  scrollEndHandler = debounce(() => {
    const innerContainer = this.inner;
    if (innerContainer) {
      const maxScrollingPosition = innerContainer.scrollHeight;
      const sensitivity = this.defaultItemHeight() / 2;
      const currentScrollingPosition =
        innerContainer.scrollTop + innerContainer.clientHeight + sensitivity;
      if (currentScrollingPosition >= maxScrollingPosition) {
        this.props.onScrollToBottom();
      }
    }
  }, SCROLL_HANDLER_DEBOUNCE);

  checkOverflow = () => {
    if (this.inner) {
      this.setState({
        hasOverflow: this.inner.scrollHeight - this.inner.clientHeight > 1
      });
    }
  };

  getShortcutsProps() {
    return {
      map: {
        up: this.upHandler,
        down: this.downHandler,
        enter: this.enterHandler
      },
      scope: getUID('list-')
    };
  }

  getVisibleListHeight(props) {
    return props.maxHeight - this.defaultItemHeight() - Dimension.INNER_PADDING;
  }

  // eslint-disable-next-line react/prop-types
  renderItem = ({index, style, isScrolling, parent}) => {
    let key;
    let el;

    const realIndex = index - 1;

    const item = this.props.data[realIndex];

    // top and bottom margins
    if (index === 0 || index === this.props.data.length + 1 || item.rgItemType === Type.MARGIN) {
      key = `${Type.MARGIN}_${index}`;
      el = <div style={{height: Dimension.MARGIN}}/>;
    } else {

      const itemProps = Object.assign({rgItemType: DEFAULT_ITEM_TYPE}, item);

      if (itemProps.url) {
        itemProps.href = itemProps.url;
      }
      if (itemProps.href) {
        itemProps.rgItemType = Type.LINK;
      }

      // Probably unique enough key
      key = itemProps.key ||
        `${itemProps.rgItemType}_${itemProps.label || itemProps.description}`;

      itemProps.hover = (realIndex === this.state.activeIndex);
      itemProps.onMouseOver = this.hoverHandler(realIndex);
      itemProps.tabIndex = -1;
      itemProps.scrolling = isScrolling;

      const selectHandler = this.selectHandler(realIndex);

      if (this.props.useMouseUp) {
        itemProps.onMouseUp = selectHandler;
      } else {
        itemProps.onClick = selectHandler;
      }

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
          break;
        case Type.ITEM:
          ItemComponent = ListItem;
          break;
        case Type.CUSTOM:
          ItemComponent = ListCustom;
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

    return (
      <CellMeasurer
        cache={this._cache}
        key={key}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div style={style}>{el}</div>
      </CellMeasurer>
    );
  }

  virtualizedListRef = el => {
    this.virtualizedList = el;
  };

  containerRef = el => {
    this.container = el;
  }

  get inner() {
    if (!this._inner) {
      this._inner = this.container && this.container.query('.ring-list__i');
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
    scrollTop
  }) {
    return (
      <AutoSizer disableHeight={true}>
        {({width}) => (
          <VirtualizedList
            ref={this.virtualizedListRef}
            className="ring-list__i"
            autoHeight={autoHeight}
            style={maxHeight ? {maxHeight, height: 'auto'} : {}}
            autoContainerWidth={true}
            height={height}
            width={width}
            isScrolling={isScrolling}
            // eslint-disable-next-line react/jsx-no-bind
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
            // eslint-disable-next-line react/jsx-no-bind
            noop={() => {}}

            scrollToIndex={
              this.state.needScrollToActive && this.state.activeIndex != null
                ? this.state.activeIndex + 1
                : undefined
            }
            deferredMeasurementCache={this._cache}
            onRowsRendered={this.checkOverflow}
          />
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
        className="ring-list__i"
        onScroll={this.scrollHandler}
        onMouseMove={this.mouseHandler}
      >
        <div
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

  /** @override */
  render() {
    const hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    const fadeStyles = hint ? {bottom: Dimension.ITEM_HEIGHT} : null;

    const rowCount = this.props.data.length + 2;

    const maxHeight = this.props.maxHeight && this.getVisibleListHeight(this.props);

    const classes = classNames(styles.list, this.props.className);

    return (
      <div
        ref={this.containerRef}
        className={classes}
        onMouseOut={this.props.onMouseOut}
      >
        {this.props.renderOptimization
          ? this.renderVirtualized(maxHeight, rowCount)
          : this.renderSimple(maxHeight, rowCount)
        }
        {this.state.hasOverflow && (
          <div
            className={styles.fade}
            style={fadeStyles}
          />
        )}
        {hint && (
          <ListHint
            key={this.props.hint + Type.ITEM}
            label={hint}
          />
        )}
      </div>
    );
  }
}
