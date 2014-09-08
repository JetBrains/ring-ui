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
 * @constructor
 * @extends {ReactComponent}
 */
var Alerts = React.createClass({
  /** @override */
  getInitialState: function() {
    return {
      /** @type {$.Deferred} */
      'animationDeferred': null,

      /** @type {Array.<Alert>} */
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

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    return (<div className="ring-alerts">
      <ReactCSSTransitionGroup transitionName="alert">
        {this.state.childElements}
      </ReactCSSTransitionGroup>
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

    // NB! Reverse array is needed because we use this component as a stack
    // of messages. New message appears at the top of the list. This is also
    // a reason why I use unshift instead of push in ```add```.
    children.reverse();

    this.setState({ 'childElements': children });
  },

  /**
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   */
  add: function(caption, type, timeout) {
    // NB! If animation is proceeded new alert comes to the end of the
    // queue.
    if (this.state['animationDeferred']) {
      this.state['animationDeferred'].done(function() {
        this.add(caption, type, timeout);
      }.bind(this));

      return;
    }

    var childElements = this.state['childElements'].slice(0);
    var index = childElements.length;
    var animationDeferred = new $.Deferred();

    childElements.unshift(<Alert
        animationDeferred={animationDeferred}
        caption={caption}
        key={index}
        type={type} />);

    this.setState({
      'animationDeferred': animationDeferred,
      'childElements': childElements,
      'lastInserted': index
    });

    if (timeout) {
      setTimeout(function() {
        this.remove(index);
      }.bind(this), timeout)
    }

    animationDeferred.done(function() {
      this.setState({ 'animationDeferred': null });
    }.bind(this));
  },

  /**
   * @param {number} index
   */
  remove: function(index) {
    var childElements = this.state['childElements'].slice(0);
    var element = childElements[index];
    childElements = _.without(childElements, element);

    this.setState({ 'childElements': childElements });
  }
});


/** @type {Alerts} */
module.exports = Alerts;
