/**
 * @name List
 */

import 'dom4';
import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import VirtualizedList from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import {CellMeasurer, CellMeasurerCache} from 'react-virtualized/dist/es/CellMeasurer';
import deprecate from 'util-deprecate';

import dataTests from '../global/data-tests';
import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import memoize from '../global/memoize';
import {preventDefault} from '../global/dom';
import Shortcuts from '../shortcuts/shortcuts';

import styles from './list.css';
import ListItem from './list__item';
import ListCustom from './list__custom';
import ListLink from './list__link';
import ListTitle from './list__title';
import ListSeparator from './list__separator';
import ListHint from './list__hint';

const scheduleScrollListener = scheduleRAF();
const scheduleHoverListener = scheduleRAF();
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

const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
  COMPACT_ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 25,
  SEPARATOR_FIRST_HEIGHT: 16,
  SEPARATOR_TEXT_HEIGHT: 18,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8,
  MARGIN: 8
};

const DEFAULT_ITEM_TYPE = Type.ITEM;

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

function isActivatable(item) {
  return !(item.rgItemType === Type.HINT ||
    item.rgItemType === Type.SEPARATOR ||
    item.rgItemType === Type.TITLE ||
    item.disabled);
}

/**
 * @name List
 * @constructor
 * @extends {ReactComponent}
 */
export default class List extends Component {
  static isItemType = isItemType;

  static ListHint = ListHint;

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
    disableScrollToActive: PropTypes.bool
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
    disableMoveDownOverflow: false
  };

  state = {
    activeIndex: null,
    activeItem: null,
    needScrollToActive: false,
    scrolling: false,
    hasOverflow: false,
    disabledHover: false,
    scrolledToBottom: false
  };

  UNSAFE_componentWillMount() {
    const {data, activeIndex} = this.props;
    this.checkActivatableItems(data);
    if (activeIndex != null && data[this.props.activeIndex]) {
      this.setState({
        activeIndex,
        activeItem: data[activeIndex],
        needScrollToActive: true
      });
    } else if (
      activeIndex == null &&
      this.shouldActivateFirstItem(this.props) &&
      this.hasActivatableItems()
    ) {
      const firstActivatableIndex = data.findIndex(isActivatable);
      this.setState({
        activeIndex: firstActivatableIndex,
        activeItem: data[firstActivatableIndex],
        needScrollToActive: true
      });
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('keydown', this.onDocumentKeyDown, true);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.data) {
      //TODO investigate (https://youtrack.jetbrains.com/issue/RG-772)
      //props.data = props.data.map(normalizeListItemType);

      this.checkActivatableItems(props.data);

      this.setState(prevState => {
        let activeIndex = null;
        let activeItem = null;

        if (
          props.restoreActiveIndex &&
          prevState.activeItem &&
          prevState.activeItem.key != null
        ) {
          for (let i = 0; i < props.data.length; i++) {
            // Restore active index if there is an item with the same "key" property
            if (props.data[i].key !== undefined && props.data[i].key === prevState.activeItem.key) {
              activeIndex = i;
              activeItem = props.data[i];
              break;
            }
          }
        }

        if (
          activeIndex === null &&
          this.shouldActivateFirstItem(props) &&
          this.hasActivatableItems()
        ) {
          activeIndex = props.data.findIndex(isActivatable);
          activeItem = props.data[activeIndex];
        } else if (
          props.activeIndex != null &&
          props.activeIndex !== this.props.activeIndex &&
          props.data[props.activeIndex]
        ) {
          activeIndex = props.activeIndex;
          activeItem = props.data[props.activeIndex];
        }

        return {
          activeIndex,
          activeItem,
          needScrollToActive:
            activeIndex !== prevState.activeIndex ? true : prevState.needScrollToActive
        };
      });
    }
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

  hoverHandler = memoize(index => () =>
    scheduleHoverListener(() => {
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

  hasActivatableItems() {
    return this._activatableItems;
  }

  checkActivatableItems(items) {
    this._activatableItems = false;
    for (let i = 0; i < items.length; i++) {
      if (isActivatable(items[i])) {
        this._activatableItems = true;
        return;
      }
    }
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

        preventDefault(e);
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

  shouldActivateFirstItem(props) {
    return props.activateFirstItem ||
      props.activateSingleItem && props.length === 1;
  }

  scrollEndHandler = () => scheduleScrollListener(() => {
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

  renderItem = ({index, style, isScrolling, parent, key}) => {
    let itemKey;
    let el;

    const realIndex = index - 1;

    const item = this.props.data[realIndex];

    // top and bottom margins
    if (index === 0 || index === this.props.data.length + 1 || item.rgItemType === Type.MARGIN) {
      itemKey = key || `${Type.MARGIN}_${index}`;
      el = <div style={{height: Dimension.MARGIN}}/>;
    } else {

      // Hack around SelectNG implementation
      // eslint-disable-next-line no-unused-vars
      const {selectedLabel, originalModel, ...cleanedProps} = item;
      const itemProps = Object.assign({rgItemType: DEFAULT_ITEM_TYPE}, cleanedProps);

      if (itemProps.url) {
        itemProps.href = itemProps.url;
      }
      if (itemProps.href) {
        itemProps.rgItemType = Type.LINK;
      }

      itemKey = key || itemProps.key || this._deprecatedGenerateKeyFromContent(itemProps);

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
      itemProps.onCheckboxChange = event => selectHandler(event, true);

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

    return parent ? (
      <CellMeasurer
        cache={this._cache}
        key={itemKey}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div style={style}>{el}</div>
      </CellMeasurer>
    ) : cloneElement(el, {key: itemKey});
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
    const dirOverride = {direction: 'auto'}; // Virtualized sets "direction: ltr" by defaulthttps://github.com/bvaughn/react-virtualized/issues/457
    return (
      <AutoSizer disableHeight onResize={this.props.onResize}>
        {({width}) => (
          <VirtualizedList
            ref={this.virtualizedListRef}
            className="ring-list__i"
            autoHeight={autoHeight}
            style={maxHeight ? {maxHeight, height: 'auto', ...dirOverride} : dirOverride}
            autoContainerWidth
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

  shortcutsScope = getUID('list-');
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
      <div
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
    );
  }
}
