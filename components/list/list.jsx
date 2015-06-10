/**
 * @fileoverview Item List.
 * @jsx React.DOM
 */

var React = require('react/addons');
var mixIn = require('mout/object/mixIn');
var arrayFind = require('mout/array/find');
var debounce = require('mout/function/debounce');

var ShortcutsMixin = require('shortcuts/shortcuts__mixin');
var Global = require('global/global');
var Icon = require('icon/icon');

var generateUniqueId = Global.getUIDGenerator('ring-list-');

require('./list.scss');

// We have to use require instead of SCSS import for now to avoid double imports
require('../link/link.scss');

/**
 * @enum {number}
 */
var Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2,
  HINT: 3,
  CUSTOM: 4
};

var Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 24,
  INNER_PADDING: 8
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListSeparator = React.createClass({
  /** @override */
  render: function () {
    var classes = React.addons.classSet({
      'ring-list__separator': true,
      'ring-list__separator_empty': !this.props.description
    });

    return (
      <span className={classes}>{this.props.description}</span>
      );
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListItem = React.createClass({
  /** @override */
  getDefaultProps: function () {
    return {active: false};
  },

  getCheckbox: function() {
    if (this.props.checkbox !== undefined) {
      var cn = 'ring-list__checkbox' + (this.props.checkbox ? '' : ' ring-list__checkbox_hidden');
      return (<Icon className={cn} glyph="check" size={Icon.Size.Size18}/>);
    }
  },

  /** @override */
  render: function () {
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': !this.props.disabled,
      'ring-list__item_active': this.props.active && !this.props.disabled
    });

    var style = {
      'padding-left': ((+this.props.level || 0) * 8 + 16) + 'px'
    };

    return this.transferPropsTo(
      <span className={classes} style={style}>
        {this.getCheckbox()}
        {this.props.icon &&
          <div className="ring-list__icon" style={{'background-image': 'url("' + this.props.icon + '")'}}></div>}
        {this.props.description &&
          <div className="ring-list__description">{this.props.description}</div>}
        {this.props.label}
      </span>
    );
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListCustom = React.createClass({
  /** @override */
  getDefaultProps: function () {
    return {
      active: false
    };
  },

  /** @override */
  render: function () {
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'ring-list__item_active': this.props.active
    });

    return this.transferPropsTo(
      <span className={classes}>
        {this.props.template}
      </span>
    );
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListLink = React.createClass({
  /** @override */
  render: function () {
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-link': true,
      'ring-link_focus': this.props.active && this.props.scrolling
    });

    var el = this.props.href ? React.DOM.a : React.DOM.span;
    return this.
      transferPropsTo(el({className: classes}, this.props.label));
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListHint = React.createClass({
  /** @override */
  render: function () {
    return <span className="ring-list__item ring-list__item_hint">{this.props.label}</span>;
  }
});

var ListMixin = {
  statics: {
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
 * @mixes {ShortcutsMixin}
 * @extends {ReactComponent}
 * @example
   <example name="List">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var List = require('list/list');

       var listData = [
        {'label': 'One', 'type': List.ListProps.Type.ITEM},
        {'label': 'Two', 'type': List.ListProps.Type.ITEM},
        {'label': 'Three', 'type': List.ListProps.Type.ITEM},
        {'label': 'Four', 'type': List.ListProps.Type.ITEM},
        {'label': 'Five', 'type': List.ListProps.Type.ITEM}
       ];

       React.renderComponent(List({
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
       var React = require('react');
       var List = require('list/list');

       var listData = [
        {'label': 'One', 'type': List.ListProps.Type.ITEM},
        {'label': 'Two', 'type': List.ListProps.Type.ITEM},
        {'label': 'Active as default', 'type': List.ListProps.Type.ITEM},
        {'label': 'Four', 'type': List.ListProps.Type.ITEM},
        {'label': 'Five', 'type': List.ListProps.Type.ITEM}
       ];

       React.renderComponent(List({
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
       var React = require('react');
       var List = require('list/list');

       var listData = [
        {'label': 'One', 'type': List.ListProps.Type.ITEM},
        {'label': 'Two', 'type': List.ListProps.Type.ITEM},
        {'label': 'Active as default', 'type': List.ListProps.Type.ITEM},
        {'label': 'Four', 'type': List.ListProps.Type.ITEM},
        {'label': 'Five', 'type': List.ListProps.Type.ITEM}
       ];

       React.renderComponent(List({
         shortcuts: true,
         onSelect: console.log.bind(console),
       }), document.getElementById('list')).setProps({
         data: listData,
         activeIndex: 2
       });
     </file>
   </example>

   <example name="ListX">
     <file name="index.html">
      <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var List = require('list/list');

       var listData = [
         {'type': List.ListProps.Type.SEPARATOR, 'description': 'First separator'},
         {'label': 'Item', 'type': List.ListProps.Type.ITEM},
         {'type': List.ListProps.Type.SEPARATOR, 'description': 'Second sep'}
       ];

       React.renderComponent(List({
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
      var React = require('react');
      var List = require('list/list');

      var listData = [
        {label: 'Some item', key: '1', 'type': List.ListProps.Type.ITEM, icon: 'http://joomlasocial.ru/jomsocial/images/content/arrowchat/icon(2).png'},
        {label: 'Some item', key: '2', 'type': List.ListProps.Type.ITEM, description: 'Test item', icon: 'http://gruzimfile.ru/files/russia-flag-icon.png'},
        //Link doesn't support icons
        {label: 'Some item', key: '3', 'type': List.ListProps.Type.LINK, description: 'Test item', icon: 'http://www.thg.ru/forum/images/icons/icon6.gif'}
      ];

      React.renderComponent(List({
        data: listData,
        shortcuts: true,
        onSelect: console.log.bind(console)
    }), document.getElementById('list'));
    </file>
  </example>
*/
var List = React.createClass({
  mixins: [ShortcutsMixin, ListMixin],

  statics: {
    Mixin: ListMixin
  },

  getDefaultProps: function () {
    return {
      data: [],
      restoreActiveIndex: false,  // restore active item using its "key" property
      activateSingleItem: false,  // if there is only one item, activate it
      onSelect: function() {},
      shortcuts: false
    };
  },

  getInitialState: function () {
    return {
      activeIndex: null,
      activeItem: null
    };
  },

  _activatableItems: false,

  haveActivatableItems: function() {
    return this._activatableItems;
  },

  checkActivatableItems: function(items) {
    this._activatableItems = false;
    for (var i = 0; i < items.length; i++) {
      if (this.isActivatable(items[i])) {
        this._activatableItems = true;
        return;
      }
    }
  },

  isActivatable: function(item) {
    return !(item.type === Type.HINT || item.type === Type.SEPARATOR || item.disabled);
  },

  hoverHandler: function (index) {
    this.ignoreAutoscroll = true;
    this.setState({
      activeIndex: index,
      activeItem: this.props.data[index]
    });
  },

  upHandler: function (e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (index === null || index === 0) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, this.upHandler, e);
  },

  downHandler: function (e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (index === null || index + 1 === this.props.data.length) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    this.moveHandler(newIndex, this.downHandler, e);
  },

  moveHandler: function (index, retryCallback, e) {
    if (this.props.data.length === 0 || !this.haveActivatableItems()) {
      return;
    } else if (this.props.data.length === 1) {
      index = 0;
    }

    var item = this.props.data[index];
    this.setState({activeIndex: index, activeItem: item, scrolling: true}, function() {
      if (!this.isActivatable(item)) {
        retryCallback(e);
        return;
      }

      this.scrollToIndex(this.state.activeIndex);

      e.preventDefault();
    });
  },

  scrollToIndex: function(index) {
    var innerContainer = this.refs.inner.getDOMNode();

    if (innerContainer.scrollHeight !== innerContainer.clientHeight) {
      innerContainer.scrollTop = index * Dimension.ITEM_HEIGHT - Math.floor(this.props.maxHeight / 2);

      this.scrollEndHandler();
    }
  },

  mouseHandler: function() {
    this.setState({scrolling: false});
  },

  scrollHandler: function() {
    this.setState({scrolling: true}, this.scrollEndHandler);
  },

  enterHandler: function () {
    if (this.state.activeIndex !== null) {
      this.setState({scrolling: false}, function () {
        this.selectHandler(this.props.data[this.state.activeIndex], true);
      });
      return false; // do no propagate event
    } else {
      return true;  // propagate event to, e.g., QueryAssist
    }
  },

  selectHandler: function(item, isKeyboardEvent) {
    if (typeof item.onClick === 'function') {
      item.onClick.apply(item, arguments);
    }

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }

    if (item.type === Type.LINK && isKeyboardEvent) {
      window.location.href = this.refs['item' + this.state.activeIndex].getDOMNode().href;
    }
  },

  getFirst: function () {
    return arrayFind(this.props.data, {type: Type.ITEM});
  },

  getSelected: function () {
    return this.props.data[this.state.activeIndex];
  },

  componentWillMount: function() {
    this.checkActivatableItems(this.props.data);

    if (this.props.activeIndex && this.props.data[this.props.activeIndex]) {
      this.setState({
        activeIndex: this.props.activeIndex,
        activeItem: this.props.data[this.props.activeIndex]
      });
    }
  },

  componentWillReceiveProps: function (props) {
    if (props.data) {
      this.checkActivatableItems(props.data);

      var activeIndex = null;
      var activeItem = null;

      if (this.props.restoreActiveIndex && this.state.activeItem && this.state.activeItem.key) {
        for (var i = 0; i < props.data.length; i++) {
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
  },

  componentDidMount: function() {
    var self = this;

    this.scrollEndHandler = debounce(function() {
      self.setState({scrolling: false});
    }, 150);
    this.autoscroll();
  },

  componentDidUpdate: function() {
    this.autoscroll();
  },

  autoscroll: function() {
    if (this.state.activeIndex && !this.ignoreAutoscroll) {
      this.scrollToIndex(this.state.activeIndex);
      this.ignoreAutoscroll = false;
    }
  },

  getShortcutsProps: function () {
    return {
      map: {
        up: this.upHandler,
        down: this.downHandler,
        enter: this.enterHandler
      },
      scope: generateUniqueId()
    };
  },

  /** @override */
  render: function () {
    var hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
    var innerStyles = {};
    if (this.props.maxHeight) {
      innerStyles.maxHeight = this.props.maxHeight - Dimension.ITEM_HEIGHT - Dimension.INNER_PADDING;
    }
    var classes = React.addons.classSet({
      'ring-list': true,
      'ring-list_scrolling': this.state.scrolling
    });

    return (
      <div className={classes} onMouseMove={this.mouseHandler}>
        <div className="ring-list__i" ref="inner" onScroll={this.scrollHandler} style={innerStyles}>
          {this.props.data.map(function (item, index) {
            var props = mixIn({'type': Type.ITEM}, item);
            if (props.url) {
              props.href = props.url;
            }
            if (props.href) {
              props.type = Type.LINK;
            }

            // Probably unique enough key
            props.key = props.key || props.type + props.label;

            props.active = (index === this.state.activeIndex);
            props.onMouseOver = this.hoverHandler.bind(this, index);
            props.tabIndex = -1;
            props.scrolling = this.state.scrolling;
            props.ref = 'item' + index;

            props.onClick = function () {
              this.selectHandler(item);
            }.bind(this);

            var element;
            switch (props.type) {
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
              default:
                throw new Error('Unknown menu element type: ' + props.type);
            }
            return element(props, null);
          }.bind(this))}
        </div>
        {hint && <ListHint key={this.props.hint + Type.ITEM} label={hint} />}
      </div>
    );
  }
});

module.exports = List;
