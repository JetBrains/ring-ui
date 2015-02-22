/**
 * @fileoverview Item List.
 * @jsx React.DOM
 */

var React = require('react/addons');
var mixIn = require('mout/object/mixIn');
var debounce = require('mout/function/debounce');

var Shortcuts = require('shortcuts/shortcuts');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-list-');

require('./list.scss');
// We have to use webpack's requires instead of scss' import
// for now to avoid double imports
require('../link/link.scss');

/**
 * @enum {number}
 */
var Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2,
  HINT: 3
};

var Dimensions = {
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

  /** @override */
  render: function () {
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'ring-list__item_active': this.props.active
    });

    return this.transferPropsTo(
      <span className={classes}>
        {this.props.description &&
            <div className="ring-list__description">{this.props.description}</div>}
        {this.props.icon &&
          <div className="ring-list__icon" style={{'background-image': 'url("' + this.props.icon + '")'}}></div>}
        {this.props.label}
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
      Dimensions: Dimensions
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
 * @constructor
 * @mixes {Shortcuts.Mixin}
 * @extends {ReactComponent}
 * @example
   <example name="List">
     <file name="index.html">
       <div id='list'></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var List = require('./list.jsx');

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
 */
var List = React.createClass({
  mixins: [Shortcuts.Mixin, ListMixin],

  statics: {
    Mixin: ListMixin
  },

  getDefaultProps: function () {
    return {
      data: [],
      onSelect: function(){},
      shortcuts: false
    };
  },

  getInitialState: function () {
    return {
      activeIndex: null
    };
  },

  hoverHandler: function (index) {
    this.setState({
      activeIndex: index
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
    this.setState({activeIndex: index, scrolling: true}, function() {
      if (this.props.data[index].type === Type.HINT || this.props.data[index].type === Type.SEPARATOR) {
        retryCallback(e);
        return;
      }

      var innerContainer = this.refs.inner.getDOMNode();

      if (innerContainer.scrollHeight !== innerContainer.clientHeight) {
        innerContainer.scrollTop = index * Dimensions.ITEM_HEIGHT - Math.floor(this.props.maxHeight / 2);

        this.scrollEndHandler();
      }

      e.preventDefault();
    });
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
      return true; // propagate event to for ex. QuerryAssist
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
      document.location.href = this.refs['item' + this.state.activeIndex].getDOMNode().href;
    }
  },

  getSelected: function () {
    return this.props.data[this.state.activeIndex];
  },

  componentDidMount: function() {
    var self = this;

    this.scrollEndHandler = debounce(function() {
      self.setState({scrolling: false});
    }, 150);
  },

  componentWillReceiveProps: function (props) {
    if (props.data) {
      this.setState({
        activeIndex: null
      });
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
      innerStyles.maxHeight = this.props.maxHeight - Dimensions.ITEM_HEIGHT - Dimensions.INNER_PADDING;
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

            // Probably unqiue enough key
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
