/**
 * @name List
 * @category Components
 * @tags 3.0
 * @description Displays a list of items.
 */

import 'core-js/modules/es6.array.find';
import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import throttle from 'mout/function/throttle';

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
  TITLE: 5
};
const SCROLL_HANDLER_DEBOUNCE = 100;

const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
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
  if (Object.keys(Type).some(key => Type[key] === item.type)) {
    return item.type === listItemType;
  }

  /**
   * If rgItemType is not set, Type.ITEM is used by default.
   */
  if (!item.hasOwnProperty('rgItemType') && listItemType === DEFAULT_ITEM_TYPE) {
    return true;
  }

  return item.rgItemType === listItemType;
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
    data: PropTypes.arrayOf(PropTypes.object),
    maxHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    shortcuts: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onSelect: PropTypes.func,
    onScrollToBottom: PropTypes.func,
    useMouseUp: PropTypes.bool,
    visible: PropTypes.bool,
    disableMoveDownOverflow: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    restoreActiveIndex: false,  // restore active item using its "key" property
    activateSingleItem: false,  // if there is only one item, activate it
    onMouseOut: noop,
    onSelect: noop,
    onScrollToBottom: noop,
    shortcuts: false,
    renderOptimization: true,
    disableMoveDownOverflow: false
  };

  static ListHint = ListHint;

  state = {
    data: [],
    activeIndex: null,
    activeItem: null,
    renderOptimizationSkip: 0,
    renderOptimizationPaddingTop: 0,
    renderOptimizationPaddingBottom: 0,
    hasOverflow: false
  };

  _activatableItems = false;
  // eslint-disable-next-line no-magic-numbers
  _bufferSize = 10; // keep X items above and below of the visible area

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
          activeItem: this.props.data[index]
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
    } else if (this.props.data.length === 1) {
      correctedIndex = 0;
    } else {
      correctedIndex = index;
    }

    const item = this.props.data[correctedIndex];
    this.setState(
      {activeIndex: correctedIndex, activeItem: item, scrolling: true},
      function onSet() {
        if (!this.isActivatable(item)) {
          retryCallback(e);
          return;
        }

        this.recalculateVisibleOptions(true);
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
      this.setState({scrolling: false}, function onSet() {
        const item = this.props.data[this.state.activeIndex];
        this.selectHandler(this.state.activeIndex)(event);

        if (item.href && !event.defaultPrevented) {
          window.location.href = item.href;
        }
      });
      return false; // do not propagate event
    } else {
      return true;  // propagate event to the parent component (e.g., QueryAssist)
    }
  }

  getFirst() {
    return this.props.data.find(item => item.rgItemType === Type.ITEM);
  }

  getSelected() {
    return this.props.data[this.state.activeIndex];
  }

  clearSelected() {
    this.setState({activeIndex: null});
  }

  willMount() {
    this.checkActivatableItems(this.props.data);
    if (this.props.activeIndex != null && this.props.data[this.props.activeIndex]) {
      this.setState({
        activeIndex: this.props.activeIndex,
        activeItem: this.props.data[this.props.activeIndex]
      }, this.recalculateVisibleOptions);
    }
  }

  willReceiveProps(props) {

    /**
     * TODO(maksimrv): Remove this code when migrate to rgItemType.
     * Convert old item.type to item.rgItemType
     * @param {Object} listItem
     * @return {Object} listItem
     */
    // function normalizeListItemType(listItem) {
    //   if (Object.keys(Type).some(key => Type[key] === listItem.type)) {
    //     listItem.rgItemType = listItem.type;
    //   }
    //
    //   return listItem;
    // }

    if (props.data) {
      //TODO investigate (https://youtrack.jetbrains.com/issue/RG-772)
      //props.data = props.data.map(normalizeListItemType);

      this.checkActivatableItems(props.data);

      let activeIndex = null;
      let activeItem = null;

      if (
        this.props.restoreActiveIndex &&
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
        this.props.activateSingleItem &&
        props.data.length === 1 &&
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

      this.setState({activeIndex, activeItem}, this.recalculateVisibleOptions);
    }
  }

  shouldUpdate(nextProps, nextState) {
    return nextProps !== this.props ||
      Object.keys(nextState).some(key => nextState[key] !== this.state[key]);
  }

  didMount() {
    // we need to throttle rather than debounce to recalculate visible elements when holding UP/DOWN key
    this.scrollEndHandler = throttle(() => {
      const innerContainer = this.inner;
      if (innerContainer) {
        const maxScrollingPosition = innerContainer.scrollHeight;
        const sensitivity = Dimension.ITEM_HEIGHT / 2;
        const currentScrollingPosition =
          innerContainer.scrollTop + innerContainer.clientHeight + sensitivity;
        if (currentScrollingPosition >= maxScrollingPosition) {
          this.props.onScrollToBottom();
        }
      }
      this.setState({scrolling: false}, () => {
        this.recalculateVisibleOptions(true, true);
      });
    }, SCROLL_HANDLER_DEBOUNCE);
  }

  didUpdate() {
    this.checkOverflow();
  }

  componentWillMount() {
    this.recalculateVisibleOptions();
    super.componentWillMount();
  }

  setActiveItem(index) {
    this.setState({
      activeIndex: index,
      activeItem: this.props.data[index]
    }, () => {
      this.recalculateVisibleOptions(true);
    });
  }

  cachedSizes = [];

  recalculateVisibleOptions(fast, preventScrollToActiveItem) {
    if (this.props.renderOptimization && this.props.maxHeight) {
      this.recalculateVisibleOptionsWithOptimization(fast, preventScrollToActiveItem, this.props);
      return;
    }

    this.setState({
      data: this.props.data
    });
  }

  recalculateVisibleOptionsWithOptimization(fast, preventScrollToActiveItem, props) {
    const shouldRecalculateItemsSize = !fast;
    if (shouldRecalculateItemsSize) {
      this.cachedSizes = this.calculateItemsSize(props.data);
    }

    if (this.inner && !preventScrollToActiveItem && this.state.activeIndex !== null) {
      this.scrollToActiveItem(props);
    }

    const {
      paddingTop, paddingBottom,
      startIndex, stopIndex
    } = this.calculateVisibleOptions(props, this.cachedSizes);

    // And splice these elements to state data
    const optimizedData = props.data.slice(startIndex, stopIndex + 1);

    this.setState({
      renderOptimizationSkip: startIndex,
      renderOptimizationPaddingTop: paddingTop,
      renderOptimizationPaddingBottom: paddingBottom,
      data: optimizedData
    });
  }

  calculateVisibleOptions(props, cachedSizes) {
    const bufferSize = this._bufferSize;
    const visibleListHeight = this.getVisibleListHeight(props);
    const listHeight = this.getListHeight(cachedSizes);

    let firstRenderedItemIndex = null;
    let lastRenderedItemIndex = null;
    let heightUnrenderedAboveItems = 0;
    let heightUnrenderedBelowItems = 0;

    const scrollTop = this.inner ? this.inner.scrollTop : 0;

    for (let itemIndex = 0; itemIndex < cachedSizes.length; itemIndex++) {
      const cachedSizeItem = cachedSizes[itemIndex];

      if (firstRenderedItemIndex === null && cachedSizeItem.begin >= scrollTop) {
        firstRenderedItemIndex = itemIndex - bufferSize;
        if (firstRenderedItemIndex < 0) {
          firstRenderedItemIndex = 0;
        }
        heightUnrenderedAboveItems = cachedSizes[firstRenderedItemIndex].begin - Dimension.MARGIN;
      }

      if (lastRenderedItemIndex === null && cachedSizeItem.end > (scrollTop + visibleListHeight)) {
        lastRenderedItemIndex = itemIndex + bufferSize;
        if (lastRenderedItemIndex >= cachedSizes.length) {
          lastRenderedItemIndex = cachedSizes.length - 1;
        }
        heightUnrenderedBelowItems = listHeight - cachedSizes[lastRenderedItemIndex].end;
      }

      if (firstRenderedItemIndex !== null && lastRenderedItemIndex !== null) {
        break;
      }
    }

    if (lastRenderedItemIndex === null) {
      lastRenderedItemIndex = cachedSizes.length;
      heightUnrenderedBelowItems = 0;
    }

    return {
      startIndex: firstRenderedItemIndex,
      stopIndex: lastRenderedItemIndex,
      paddingTop: heightUnrenderedAboveItems,
      paddingBottom: heightUnrenderedBelowItems
    };
  }

  getListHeight(cachedSizes) {
    if (!cachedSizes || !cachedSizes.length) {
      return 0;
    }

    return cachedSizes[cachedSizes.length - 1].end;
  }

  calculateItemsSize(data) {
    const cachedSizes = [];
    for (let i = 0; i < data.length; i++) {
      let size;
      switch (data[i].rgItemType) {
        case Type.SEPARATOR:
          size = i === 0 ? Dimension.SEPARATOR_FIRST_HEIGHT : Dimension.SEPARATOR_HEIGHT;
          if (!data[i].description) {
            size -= Dimension.SEPARATOR_TEXT_HEIGHT;
          }
          break;
        case Type.TITLE:
          size = Dimension.TITLE_HEIGHT;
          break;
        case Type.ITEM:
        case Type.LINK:
        default:
          size = Dimension.ITEM_HEIGHT;
          break;
      }

      const begin = cachedSizes.length === 0
        ? Dimension.MARGIN
        : cachedSizes[cachedSizes.length - 1].end;

      const dimensions = {
        begin,
        size,
        end: begin + size
      };

      cachedSizes.push(dimensions);
    }
    return cachedSizes;
  }

  scrollToActiveItem(props) {
    const innerContainer = this.inner;
    const top = innerContainer.scrollTop;
    const visibleListHeight = this.getVisibleListHeight(props);
    const bottom = top + visibleListHeight;

    const itemDimensions = this.cachedSizes[this.state.activeIndex];
    const HALF = 0.5;

    if (
      itemDimensions.end < top ||
      itemDimensions.begin > bottom
    ) {
      const scrollTop = itemDimensions.begin -
        Math.floor((visibleListHeight - itemDimensions.size) * HALF);
      innerContainer.scrollTop = scrollTop > 0 ? scrollTop : 0;
    } else if (itemDimensions.begin < top) {
      innerContainer.scrollTop = itemDimensions.begin;
    } else if (itemDimensions.end > bottom) {
      innerContainer.scrollTop = itemDimensions.end - visibleListHeight;
    }
  }

  checkOverflow() {
    if (this.inner) {
      this.setState({
        hasOverflow: this.inner.scrollHeight - this.inner.clientHeight > 1
      });
    }
  }

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
    return props.maxHeight - Dimension.ITEM_HEIGHT - Dimension.INNER_PADDING;
  }

  innerRef = el => {
    if (el) {
      this.inner = el;
      this.checkOverflow();
    }
  };

  itemsRef = el => {
    this.items = el;
  };

  /** @override */
  render() {
    const hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    const innerStyles = {};
    const topPaddingStyles = {};
    const bottomPaddingStyles = {};
    const fadeStyles = hint ? {bottom: Dimension.ITEM_HEIGHT} : null;

    if (this.props.maxHeight) {
      innerStyles.maxHeight = this.getVisibleListHeight(this.props);
      topPaddingStyles.height = this.state.renderOptimizationPaddingTop;
      bottomPaddingStyles.height = this.state.renderOptimizationPaddingBottom;
    }
    const classes = classnames(styles.list, this.props.className, {
      [styles.scrolling]: this.state.scrolling
    });

    return (
      <div
        className={classes}
        onMouseMove={this.mouseHandler}
        onMouseOut={this.props.onMouseOut}
      >
        <div
          className={styles.inner}
          onScroll={this.scrollHandler}
          ref={this.innerRef}
          style={innerStyles}
        >
          <div style={topPaddingStyles}/>
          <div
            className={styles.items}
            ref={this.itemsRef}
          >
            {this.state.data.map((item, index) => {
              const props = Object.assign({rgItemType: DEFAULT_ITEM_TYPE}, item);
              const realIndex = this.state.renderOptimizationSkip + index;

              if (props.url) {
                props.href = props.url;
              }
              if (props.href) {
                props.rgItemType = Type.LINK;
              }

              // Probably unique enough key
              props.key = props.key || props.rgItemType + (props.label || props.description);

              props.hover = (realIndex === this.state.activeIndex);
              props.onMouseOver = this.hoverHandler(realIndex);
              props.tabIndex = -1;


              const selectHandler = this.selectHandler(realIndex);

              if (this.props.useMouseUp) {
                props.onMouseUp = selectHandler;
              } else {
                props.onClick = selectHandler;
              }

              let element;
              switch (props.rgItemType) {
                case Type.SEPARATOR:
                  element = ListSeparator;
                  break;
                case Type.LINK:
                  element = ListLink;
                  break;
                case Type.ITEM:
                  element = ListItem;
                  break;
                case Type.CUSTOM:
                  element = ListCustom;
                  break;
                case Type.TITLE:
                  element = ListTitle;
                  break;
                default:
                  throw new Error(`Unknown menu element type: ${props.rgItemType}`);
              }
              return createElement(element, props, null);
            })}
          </div>
          <div style={bottomPaddingStyles}/>
        </div>
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
