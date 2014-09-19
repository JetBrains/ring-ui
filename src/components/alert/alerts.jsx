/**
 * @fileoverview Stack of alerts at the top of the page.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

require('./alert.scss');
var $ = require('jquery');
var _ = require('underscore');
var Alert = require('./alert');
var React = require('react/addons');


/**
 * List of all executed animations.
 * @type {Array.<jQuery.Deferred>}
 * @private
 */
var _animationQueue = [];



/**
 * @constructor
 * @extends {ReactComponent}
 * @example
 * <example>
 *   <div class="alerts-container"></div>
 *
 *   <script>
 *     var alertsContainer = React.renderComponent(<Alerts />, document.querySelector('.alerts-container');
 *
 *     alertsContainer.add('Test message');
 *     alertsContainer.add('Another test message');
 *     alertsContainer.add('Test warning', Alert.Type.WARNING);
 *   </script>
 * </example>
 */
var Alerts = React.createClass({
  statics: {
    Type: Alert.Type
  },

  /** @override */
  getInitialState: function() {
    return {
      /** @type {Array.<Object>} */
      'childElements': [],

      /** @type {?number} */
      'lastInserted': null
    };
  },

  /** @override */
  render: function() {
    if (!this.state['childElements']) {
      this._getChildElements();
    }

    return (<div className="ring-alerts">
      <React.addons.CSSTransitionGroup transitionName="alert">
        {this.state.childElements.slice(0).reverse().map(function(child) {
          return <Alert
              animationDeferred={child.animationDeferred}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onClick={child.onClick}
              ref={'alert-' + child.key}
              type={child.type} />;
        })}
      </React.addons.CSSTransitionGroup>
    </div>);
  },

  /**
   * @private
   */
  _getChildElements: function() {
    var children = [];
    React.Children.forEach(this.props.children, function(child) {
      children.push(child);
    });

    this.setState({ 'childElements': children });
  },

  /**
   * Creates a deferred and puts it into a queue.
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   * @return {jQuery.Deferred}
   */
  add: function(caption, type, timeout) {
    var animationDeferred = new $.Deferred();
    _animationQueue.push(animationDeferred);
    var currentAnimationIndex = _animationQueue.indexOf(animationDeferred);

    if (currentAnimationIndex > 0) {
      _animationQueue[currentAnimationIndex - 1].done(function() {
        this._addElement(caption, type, animationDeferred, timeout);
      }.bind(this));
    } else {
      this._addElement(caption, type, animationDeferred, timeout);
    }

    return animationDeferred;
  },

  /**
   * @param {ReactComponent|string} caption
   * @param {Alert.Type} type
   * @param {jQuery.Deferred} animationDeferred
   * @param {number=} timeout
   * @private
   */
  _addElement: function(caption, type, animationDeferred, timeout) {
    var childElements = this.state['childElements'].slice(0);
    var index = childElements.length;

    childElements.push({
      'animationDeferred': animationDeferred,
      'caption': caption,
      'key': index,
      'onClick': function(evt) {
        this._handleClick(evt, index);
      }.bind(this),
      'type': type
    });

    this.setState({
      'childElements': childElements,
      'lastInserted': index
    });

    if (timeout) {
      setTimeout(function() {
        this.remove(index);
      }.bind(this), timeout);
    }

    animationDeferred.done(function() {
      animationDeferred.resolve();
      _animationQueue.shift();
    });
  },

  /**
   * @param {number} index
   */
  remove: function(index) {
    var childElements = this.state['childElements'].slice(0);

    // NB!(igor.alexeenko): I don't delete item completely, but set it as undefined
    // because all custom click handlers are bound to element's index in array
    // of child elements.
    delete childElements[index];

    this.setState({ 'childElements': childElements });
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @param {number} i
   * @private
   */
  _handleClick: function(evt, i) {
    if (evt.target.classList.contains('ring-alert__close')) {
      evt.preventDefault();
      this.remove(i);
    }
  }
});


/** @type {Alerts} */
module.exports = Alerts;
