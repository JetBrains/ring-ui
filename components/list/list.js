/**
 * @fileoverview Item List.
 */

import 'core-js/modules/es6.array.find';
import React, { PropTypes, createElement, DOM } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import debounce from 'mout/function/debounce';

import RingComponent from 'ring-component/ring-component';
import RingComponentWithShortcuts from 'ring-component/ring-component_with-shortcuts';
import Icon from 'icon/icon';

import './list.scss';
// We have to use require instead of SCSS import for now to avoid double imports
import '../link/link.scss';

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
  INNER_PADDING: 8
};

/**
 * @constructor
 * @extends {RingComponent}
 */
class ListSeparator extends RingComponent {
  /** @override */
  render() {
    let classes = classNames({
      'ring-list__separator': true,
      'ring-list__separator_empty': !this.props.description
    });

    return (
      <span className={classes}>{this.props.description}</span>
      );
  }
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
class ListItem extends RingComponent {
  /** @override */
  static defaultProps = {
    active: false
  };

  getCheckbox() {
    if (this.props.checkbox !== undefined) {
      let cn = 'ring-list__checkbox' + (this.props.checkbox ? '' : ' ring-list__checkbox_hidden');
      return (<Icon className={cn} glyph="check" size={Icon.Size.Size18}/>);
    }
  }

  /** @override */
  render() {
    let classes = classNames({
      'ring-list__item': true,
      'ring-list__item_action': !this.props.disabled,
      'ring-list__item_active': this.props.active && !this.props.disabled
    }, this.props.className);

    let style = {
      'paddingLeft': ((+this.props.level || 0) * 8 + 16) + 'px'
    };

    return (
      <span {...this.props} className={classes} style={style}>
        {this.getCheckbox()}
        {this.props.icon &&
          <div className="ring-list__icon" style={{'backgroundImage': 'url("' + this.props.icon + '")'}}></div>}
        {this.props.description &&
          <div className="ring-list__description">{this.props.description}</div>}
        {this.props.label}
      </span>
    );
  }
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
class ListCustom extends RingComponent {
  /** @override */
  static defaultProps = {
    active: false
  };

  /** @override */
  render() {
    let classes = classNames({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'ring-list__item_active': this.props.active
    }, this.props.className);

    return (
      <span {...this.props} className={classes}>
        {this.props.template}
      </span>
    );
  }
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
class ListLink extends RingComponent {
  /** @override */
  render() {
    let classes = classNames({
      'ring-list__item': true,
      'ring-link': true,
      'ring-link_focus': this.props.active && this.props.scrolling
    });

    let el = this.props.href ? DOM.a : DOM.span;
    return el(Object.assign({}, this.props, {className: classes}), this.props.label);
  }
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
class ListHint extends RingComponent {
  /** @override */
  render() {
    return <span className="ring-list__item ring-list__item_hint">{this.props.label}</span>;
  }
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
class ListTitle extends RingComponent {
  /** @override */
  render() {
    return (
      <span className="ring-list__title">
        <div className="ring-list__description">{this.props.description}</div>
        <span className="ring-list__title-text">{this.props.label}</span>
      </span>
    );
  }
}

const DEFAULT_ITEM_TYPE = Type.ITEM;

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
};

var ListMixin = {
  statics: {
    isItemType: isItemType,
    ListProps: {
      Type: Type,
      Dimension: Dimension
    }
  },

  propTypes: {
    className: React.PropTypes.string,
    hint: React.PropTypes.string,
    hintOnSelection: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.object),
    maxHeight: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    shortcuts: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    visible: React.PropTypes.bool
  }
};

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
       var List = require('list/list');

       var listData = [
        {'label': 'One',   'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Two',   'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Three', 'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Four',  'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Five',  'rgItemType': List.ListProps.Type.ITEM}
       ];

       render(List.factory({
         data: listData,
         shortcuts: true,
         onSelect: console.log.bind(console)
       }), document.getElementById('list'));
     </file>
   </example>

   <example name="List2">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('list/list');

       var listData = [
        {'label': 'One',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Two',               'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Active as default', 'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Four',              'rgItemType': List.ListProps.Type.ITEM},
        {'label': 'Five',              'rgItemType': List.ListProps.Type.ITEM}
       ];

       render(List.factory({
         data: listData,
         shortcuts: true,
         onSelect: console.log.bind(console),
         activeIndex: 2
       }), document.getElementById('list'));
     </file>
   </example>

   <example name="List3">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var List = require('list/list');

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
       var List = require('list/list');

       var listData = [
         {                   'rgItemType': List.ListProps.Type.SEPARATOR, 'description': 'First separator'},
         {'label': 'Item 1', 'rgItemType': List.ListProps.Type.ITEM},
         {                   'rgItemType': List.ListProps.Type.SEPARATOR, 'description': 'Second sep'},
         {'label': 'Item 2', 'rgItemType': List.ListProps.Type.ITEM},
         {                   'rgItemType': List.ListProps.Type.TITLE, 'label': 'Group title', 'description': 'With description'},
         {'label': 'Item 3', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Foo bar'},
         {'label': 'Item 4', 'rgItemType': List.ListProps.Type.ITEM, 'description': 'Item description'},
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
      var List = require('list/list');

      var listData = [
        {label: 'Some item', key: '1', 'rgItemType': List.ListProps.Type.ITEM, icon: 'http://joomlasocial.ru/jomsocial/images/content/arrowchat/icon(2).png'},
        {label: 'Some item', key: '2', 'rgItemType': List.ListProps.Type.ITEM, description: 'Test item', icon: 'http://gruzimfile.ru/files/russia-flag-icon.png'},
        //Link doesn't support icons
        {label: 'Some item', key: '3', 'rgItemType': List.ListProps.Type.LINK, description: 'Test item', icon: 'http://www.thg.ru/forum/images/icons/icon6.gif'}
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
     var List = require('list/list');

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
*/
export default class List extends RingComponentWithShortcuts {
  static isItemType = isItemType;

  static ListProps = {
    Type: Type,
    Dimension: Dimension
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
    visible: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    restoreActiveIndex: false,  // restore active item using its "key" property
    activateSingleItem: false,  // if there is only one item, activate it
    onMouseOut: function() {},
    onSelect: function() {},
    shortcuts: false
  };

  static ListHint = ListHint;

  state = {
    activeIndex: null,
    activeItem: null
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
    this.ignoreAutoscroll = true;
    this.setState({
      activeIndex: index,
      activeItem: this.props.data[index]
    });
  }

  upHandler(e) {
    let index = this.state.activeIndex;
    let newIndex;

    if (index === null || index === 0) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, ::this.upHandler, e);
  }

  downHandler(e) {
    let index = this.state.activeIndex;
    let newIndex;

    if (index === null || index + 1 === this.props.data.length) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    this.moveHandler(newIndex, ::this.downHandler, e);
  }

  moveHandler(index, retryCallback, e) {
    if (this.props.data.length === 0 || !this.haveActivatableItems()) {
      return;
    } else if (this.props.data.length === 1) {
      index = 0;
    }

    let item = this.props.data[index];
    this.setState({activeIndex: index, activeItem: item, scrolling: true}, function() {
      if (!this.isActivatable(item)) {
        retryCallback(e);
        return;
      }

      this.scrollToIndex(this.state.activeIndex);

      e.preventDefault();
    });
  }

  scrollToIndex(index) {
    let innerContainer = findDOMNode(this.refs.inner);

    if (innerContainer.scrollHeight !== innerContainer.clientHeight) {
      innerContainer.scrollTop = index * Dimension.ITEM_HEIGHT - Math.floor(this.props.maxHeight / 2);

      this.scrollEndHandler();
    }
  }

  mouseHandler() {
    this.setState({scrolling: false});
  }

  scrollHandler() {
    this.setState({scrolling: true}, this.scrollEndHandler);
  }

  enterHandler() {
    if (this.state.activeIndex !== null) {
      this.setState({scrolling: false}, function () {
        this.selectHandler(this.props.data[this.state.activeIndex], true);
      });
      return false; // do no propagate event
    } else {
      return true;  // propagate event to, e.g., QueryAssist
    }
  }

  selectHandler(item, isKeyboardEvent) {
    if (typeof item.onClick === 'function') {
      item.onClick.apply(item, arguments);
    }

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }

    if (item.rgItemType === Type.LINK && isKeyboardEvent) {
      window.location.href = findDOMNode(this.refs['item' + this.state.activeIndex]).href;
    }
  }

  getFirst() {
    return this.props.data.find(function (item) {
      return item.rgItemType === Type.ITEM;
    });
  }

  getSelected () {
    return this.props.data[this.state.activeIndex];
  }

  clearSelected () {
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
    function normalizeListItemType(listItem) {
      if (Object.keys(Type).some(key => Type[key] === listItem.type)) {
        listItem.rgItemType = listItem.type;
      }

      return listItem;
    };

    if (props.data) {
      //TODO починить (см. https://youtrack.jetbrains.com/issue/RG-772)
      //props.data = props.data.map(normalizeListItemType);

      this.checkActivatableItems(props.data);

      let activeIndex = null;
      let activeItem = null;

      if (this.props.restoreActiveIndex && this.state.activeItem && this.state.activeItem.key) {
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
      } else if (props.activeIndex && props.data[props.activeIndex]) {
        activeIndex = props.activeIndex;
        activeItem = props.data[props.activeIndex];
      }

      this.setState({
        activeIndex: activeIndex,
        activeItem: activeItem
      });
    }
  }

  didMount() {
    this.scrollEndHandler = debounce(() => {
      this.setState({scrolling: false});
    }, 150);
    this.autoscroll();
  }

  didUpdate() {
    this.autoscroll();
  }

  autoscroll() {
    if (this.state.activeIndex && !this.ignoreAutoscroll) {
      this.scrollToIndex(this.state.activeIndex);
      this.ignoreAutoscroll = false;
    }
  }

  getShortcutsProps() {
    return {
      map: {
        up: ::this.upHandler,
        down: ::this.downHandler,
        enter: ::this.enterHandler
      },
      scope: ::this.constructor.getUID()
    };
  }

  /** @override */
  render() {
    let hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    let innerStyles = {};
    if (this.props.maxHeight) {
      innerStyles.maxHeight = this.props.maxHeight - Dimension.ITEM_HEIGHT - Dimension.INNER_PADDING;
    }
    let classes = classNames({
      'ring-list': true,
      'ring-list_scrolling': this.state.scrolling
    });

    return (
      <div className={classes}
           onMouseMove={::this.mouseHandler}
           onMouseOut={this.props.onMouseOut}>
        <div className="ring-list__i" ref="inner" onScroll={::this.scrollHandler} style={innerStyles}>
          {this.props.data.map((item, index) => {
            let props = Object.assign({'rgItemType': DEFAULT_ITEM_TYPE}, item);
            if (props.url) {
              props.href = props.url;
            }
            if (props.href) {
              props.rgItemType = Type.LINK;
            }

            // Probably unique enough key
            props.key = props.key || props.rgItemType + (props.label || props.description);

            props.active = (index === this.state.activeIndex);
            props.onMouseOver = this.hoverHandler.bind(this, index);
            props.tabIndex = -1;
            props.scrolling = this.state.scrolling;
            props.ref = 'item' + index;

            props.onClick = () => {
              this.selectHandler(item);
            };

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
                throw new Error('Unknown menu element type: ' + props.rgItemType);
            }
            return createElement(element, props, null);
          })}
        </div>
        {hint && <ListHint key={this.props.hint + Type.ITEM} label={hint} />}
      </div>
    );
  }
}
