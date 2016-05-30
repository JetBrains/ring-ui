/**
 * @fileoverview Item List.
 */

import 'core-js/modules/es6.array.find';
import React, {PropTypes, createElement} from 'react';
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';
import throttle from 'mout/function/throttle';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';

import './list.scss';
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

const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 27,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8
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
   * If an item does not have rgItemType set, then by default
   * it has a type of Type.ITEM. This is needed for the select to work correctly.
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
 * @example
   <example name="List">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('ring-ui/components/list/list');

       var listData = [];
       for (var i = 0; i < 1000; i++) {
          listData.push({'label': 'Item ' + i, 'rgItemType': List.ListProps.Type.ITEM});
       }

       render(List.factory({
         data: listData,
         shortcuts: true,
         onSelect: console.log.bind(console)
       }), document.getElementById('list'));
     </file>
   </example>

   <example name="List2-with-hint">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('ring-ui/components/list/list');

       var listData = [
        {'label': 'One',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Two',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Active as default', 'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Four',              'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Five (disabled)',   'rgItemType': List.ListProps.Type.ITEM, disabled: true}
       ];

       render(List.factory({
         data: listData,
         shortcuts: true,
         onSelect: console.log.bind(console),
         activeIndex: 2,
         hint: 'test hint message'
       }), document.getElementById('list'));
     </file>
   </example>

   <example name="List3">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('ring-ui/components/list/list');

       var listData = [
        {'label': 'One',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Two',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Active as default', 'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Four',              'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Five',              'rgItemType': List.ListProps.Type.ITEM}
       ];

       render(List.factory({
         data: listData,
         activeIndex: 2,
         shortcuts: true,
         onSelect: console.log.bind(console),
       }), document.getElementById('list'));
     </file>
   </example>

   <example name="ListX">
     <file name="index.html">
      <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('ring-ui/components/list/list');

       var listData = [
         {                   'rgItemType': List.ListProps.Type.SEPARATOR, 'description': 'First separator'},
         {'label': 'Item 1', 'rgItemType': List.ListProps.Type.ITEM},
         {                   'rgItemType': List.ListProps.Type.SEPARATOR, 'description': 'Second sep'},
         {'label': 'Item 2', 'rgItemType': List.ListProps.Type.ITEM},
         {                   'rgItemType': List.ListProps.Type.TITLE, 'label': 'Group title', 'description': 'With description'},
         {'label': 'Item 3', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Foo bar'},
         {'label': 'Item 4', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Item description'},
         {'label': 'Item 5', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Item description', details: 'Additional details line'},
         {'label': 'Item 6', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Item description', details: 'Additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text.'},
       ];

       render(List.factory({
         data: listData,
         shortcuts: true,
         onSelect: console.log.bind(console)
       }), document.getElementById('list'));
     </file>
   </example>

  <example name="List Icons">
    <file name="index.html">
      <div id='list' style="width: 300px;"></div>
    </file>

    <file name="index.js" webpack="true">
      var render = require('react-dom').render;
      var List = require('ring-ui/components/list/list');

      var listData = [
        {label: 'Some item', key: '1', 'rgItemType': List.ListProps.Type.ITEM, icon: 'http://joomlasocial.ru/jomsocial/images/content/arrowchat/icon(2).png'},
        {label: 'Some item', key: '2', 'rgItemType': List.ListProps.Type.ITEM, description: 'Test item', icon: 'http://gruzimfile.ru/files/russia-flag-icon.png'},
        //Link doesn't support icons
        {label: 'Some item', key: '3', 'rgItemType': List.ListProps.Type.LINK, description: 'Test item', icon: 'http://www.thg.ru/forum/images/icons/icon6.gif'},
        {label: 'Some item', key: '4', href: 'http://localhost:9999', description: 'Test item', icon: 'http://www.thg.ru/forum/images/icons/icon6.gif'}
      ];

      render(List.factory({
        data: listData,
        shortcuts: true,
        onSelect: console.log.bind(console)
      }), document.getElementById('list'));
    </file>
  </example>

  <example name="List should support deprecated item.type">
   <file name="index.html">
     <div id='list'></div>
   </file>

   <file name="index.js" webpack="true">
     var render = require('react-dom').render;
     var List = require('ring-ui/components/list/list');

     var listData = [
      {'label': 'One',   'type': List.ListProps.Type.ITEM},
      {'label': 'Two',   'type': List.ListProps.Type.ITEM},
      {'label': 'Three', 'type': List.ListProps.Type.ITEM},
      {'label': 'Four',  'type': List.ListProps.Type.ITEM},
      {'label': 'Five',  'type': List.ListProps.Type.ITEM}
     ];

     render(List.factory({
       data: listData,
       shortcuts: true,
       onSelect: console.log.bind(console)
     }), document.getElementById('list'));
   </file>
  </example>

 <example name="List with custom items">
    <file name="index.html">
     <div id='list'></div>
   </file>
   <file name="index.js" webpack="true">
     var render = require('react-dom').render;
     var List = require('ring-ui/components/list/list');
     var React = require('react');

     var listData = [
        {key: '1', rgItemType: List.ListProps.Type.CUSTOM, template: React.createElement('span', {}, 'custom item')},
        {key: '2', rgItemType: List.ListProps.Type.CUSTOM, template: React.createElement('span', {}, 'custom item (disabled)'), disabled: true},
        {key: '3', rgItemType: List.ListProps.Type.CUSTOM, template: React.createElement('span', {}, 'custom item 3')},
    ];

     render(List.factory({
       data: listData,
       shortcuts: true,
       onSelect: console.log.bind(console)
     }), document.getElementById('list'));
   </file>
  </example>
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
    onMouseOut: React.PropTypes.func,
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
    renderOptimizationPaddingBottom: 0
  };

  _activatableItems = false;

  haveActivatableItems() {
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

  hoverHandler(index) {
    this.setState({
      activeIndex: index,
      activeItem: this.props.data[index]
    });
  }

  upHandler(e) {
    const index = this.state.activeIndex;
    let newIndex;

    if (index === null || index === 0) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, ::this.upHandler, e);
  }

  downHandler(e) {
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

    this.moveHandler(newIndex, ::this.downHandler, e);
  }

  moveHandler(index, retryCallback, e) {
    let correctedIndex;
    if (this.props.data.length === 0 || !this.haveActivatableItems()) {
      return;
    } else if (this.props.data.length === 1) {
      correctedIndex = 0;
    } else {
      correctedIndex = index;
    }

    const item = this.props.data[correctedIndex];
    this.setState({activeIndex: correctedIndex, activeItem: item, scrolling: true}, function () {
      if (!this.isActivatable(item)) {
        retryCallback(e);
        return;
      }

      this.recalculateVisibleOptions(true);
      e.preventDefault();
    });
  }

  mouseHandler() {
    this.setState({scrolling: false});
  }

  scrollHandler() {
    this.setState({scrolling: true}, this.scrollEndHandler);
  }

  enterHandler(event) {
    if (this.state.activeIndex !== null) {
      this.setState({scrolling: false}, function () {
        const item = this.props.data[this.state.activeIndex];
        this.selectHandler({item, event});

        if (item.href) {
          window.location.href = item.href;
        }
      });
      return false; // do no propagate event
    } else {
      return true;  // propagate event to, e.g., QueryAssist
    }
  }

  selectHandler({item, event}) {
    if (!this.props.useMouseUp && item.onClick) {
      item.onClick(item, event);
    }

    if (this.props.useMouseUp && item.onMouseUp) {
      item.onMouseUp(item, event);
    }

    if (this.props.onSelect) {
      this.props.onSelect(item, event);
    }
  }

  getFirst() {
    return this.props.data.find(function (item) {
      return item.rgItemType === Type.ITEM;
    });
  }

  getSelected() {
    return this.props.data[this.state.activeIndex];
  }

  clearSelected() {
    this.setState({activeIndex: null});
  }

  willMount() {
    this.checkActivatableItems(this.props.data);

    if (this.props.activeIndex && this.props.data[this.props.activeIndex]) {
      this.setState({
        activeIndex: this.props.activeIndex,
        activeItem: this.props.data[this.props.activeIndex]
      });
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
      //TODO investigate (см. https://youtrack.jetbrains.com/issue/RG-772)
      //props.data = props.data.map(normalizeListItemType);

      this.checkActivatableItems(props.data);

      let activeIndex = null;
      let activeItem = null;

      if (this.props.restoreActiveIndex && this.state.activeItem && this.state.activeItem.key !== undefined && this.state.activeItem.key !== null) {
        for (let i = 0; i < props.data.length; i++) {
          // Restore active index if there is an item with the same "key" property
          if (props.data[i].key !== undefined && props.data[i].key === this.state.activeItem.key) {
            activeIndex = i;
            activeItem = props.data[i];
            break;
          }
        }
      } else if (this.props.activateSingleItem && props.data.length === 1 && this.isActivatable(props.data[0])) {
        activeIndex = 0;
        activeItem = props.data[0];
      } else if (props.activeIndex !== null && props.activeIndex !== undefined && props.data[props.activeIndex]) {
        activeIndex = props.activeIndex;
        activeItem = props.data[props.activeIndex];
      }

      this.setState({activeIndex, activeItem}, this.recalculateVisibleOptions);
    }
  }

  didMount() {
    // we need throttle instead of debounce to recalculate visible elements when holding UP/DOWN key
    this.scrollEndHandler = throttle(() => {
      const innerContainer = findDOMNode(this.refs.inner);
      if (innerContainer) {
        const maxScrollingPositon = innerContainer.scrollHeight;
        const sensitivity = Dimension.ITEM_HEIGHT / 2;
        const currentScrollingPosition = innerContainer.scrollTop + innerContainer.clientHeight + sensitivity;
        if (currentScrollingPosition >= maxScrollingPositon) {
          this.props.onScrollToBottom();
        }
      }
      this.setState({scrolling: false}, () => {
        this.recalculateVisibleOptions(true, true);
      });
    }, 100);
  }

  componentWillMount() {
    this.recalculateVisibleOptions();
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

  recalculateVisibleOptions(fast, ignoreFocus) {
    const buffer = 10; // keep X items above and below of the visisble area
    const innerContainer = findDOMNode(this.refs.inner);

    if (this.props.renderOptimization && this.props.maxHeight) {
      const height = this.props.maxHeight;

      // Firstly we should calculate every item size and position
      if (!fast) {
        this.cachedSizes = [];
        for (let i = 0; i < this.props.data.length; i++) {
          let size;
          switch (this.props.data[i].rgItemType) {
            case Type.SEPARATOR:
              size = Dimension.SEPARATOR_HEIGHT;
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

          const begin = this.cachedSizes.length === 0 ? 0 : this.cachedSizes[this.cachedSizes.length - 1].end;

          const dimensions = {
            begin,
            end: begin + size
          };

          this.cachedSizes.push(dimensions);
        }
      }

      let startIndex = null;
      let stopIndex = null;

      let paddingTop = 0;
      let paddingBottom = 0;

      // Then we move scrollTop near active item if necessary
      if (innerContainer && !ignoreFocus && this.state.activeIndex !== null) {
        innerContainer.scrollTop = this.cachedSizes[this.state.activeIndex].begin - parseInt(height / 2, 10);
      }

      const scrollTop = innerContainer ? innerContainer.scrollTop : 0;

      // Then we calculate visible options
      for (let i = 0; i < this.cachedSizes.length; i++) {
        const cachedSizeItem = this.cachedSizes[i];
        if (startIndex === null && cachedSizeItem.begin >= scrollTop) {
          startIndex = i - buffer;
          if (startIndex < 0) {
            startIndex = 0;
          }
          paddingTop = this.cachedSizes[startIndex].begin;
        } else if (stopIndex === null && cachedSizeItem.end > (scrollTop + height)) {
          const fullHeight = this.cachedSizes[this.cachedSizes.length - 1].end;
          stopIndex = i + buffer;
          if (stopIndex >= this.cachedSizes.length) {
            stopIndex = this.cachedSizes.length - 1;
          }
          paddingBottom = fullHeight - this.cachedSizes[stopIndex].begin;
        }

        if (startIndex !== null && stopIndex !== null) {
          break;
        }
      }

      if (stopIndex === null) {
        stopIndex = this.cachedSizes.length;
        paddingBottom = 0;
      }

      // And splice these elements to state data
      const optimizedData = this.props.data.slice(startIndex, stopIndex + 1);

      this.setState({
        renderOptimizationSkip: startIndex,
        renderOptimizationPaddingTop: paddingTop,
        renderOptimizationPaddingBottom: paddingBottom,
        data: optimizedData
      });
    } else {
      this.setState({
        data: this.props.data
      });
    }
  }

  hasOverflow() {
    if (this.refs.inner && this.refs.inner.node) {
      const container = this.refs.inner.node;
      return container.scrollHeight > container.clientHeight;
    }
  }

  getShortcutsProps() {
    return {
      map: {
        up: ::this.upHandler,
        down: ::this.downHandler,
        enter: ::this.enterHandler
      },
      scope: ::this.constructor.getUID('ring-list-')
    };
  }

  /** @override */
  render() {
    const hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    const innerStyles = {};
    const topPaddingStyles = {};
    const bottomPaddingStyles = {};
    if (this.props.maxHeight) {
      innerStyles.maxHeight = this.props.maxHeight - Dimension.ITEM_HEIGHT - Dimension.INNER_PADDING;
      topPaddingStyles.height = this.state.renderOptimizationPaddingTop;
      bottomPaddingStyles.height = this.state.renderOptimizationPaddingBottom;
    }
    const classes = classnames({
      'ring-list': true,
      'ring-list_scrolling': this.state.scrolling
    });

    return (
      <div className={classes}
        onMouseMove={::this.mouseHandler}
        onMouseOut={this.props.onMouseOut}
      >
        <div
          className="ring-list__i"
          onScroll={::this.scrollHandler}
          ref="inner"
          style={innerStyles}
        >
          <div style={topPaddingStyles}></div>
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

            props.active = (realIndex === this.state.activeIndex);
            props.onMouseOver = this.hoverHandler.bind(this, realIndex);
            props.tabIndex = -1;
            props.scrolling = this.state.scrolling;

            const selectHander = event => this.selectHandler({item, event});

            if (this.props.useMouseUp) {
              props.onMouseUp = selectHander;
            } else {
              props.onClick = selectHander;
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
          <div style={bottomPaddingStyles}></div>
        </div>
        {this.hasOverflow() && <div className="ring-list__fade" />}
        {hint &&
          <ListHint
            key={this.props.hint + Type.ITEM}
            label={hint}
          />}
      </div>
    );
  }
}
