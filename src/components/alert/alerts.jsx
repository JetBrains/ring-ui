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

    return (<div className="ring-alerts">
      <React.addons.CSSTransitionGroup transitionName="alert">
        {this.state.childElements.slice(0).reverse()}
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
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   */
  add: function(caption, type, timeout) {
    // NB! If animation is proceeded new alert comes to the end of the
    // queue.
    if (this._animationDeferred) {
      this._animationDeferred.done(function() {
        this.add(caption, type, timeout);
      }.bind(this));

      return;
    }

    var childElements = this.state['childElements'].slice(0);
    var index = childElements.length;
    var animationDeferred = new $.Deferred();

    childElements.push(<Alert
        animationDeferred={animationDeferred}
        caption={caption}
        closeable={true}
        inline={false}
        key={index}
        onClick={function(evt) { this._handleClick(evt, index); }.bind(this)}
        type={type} />);

    this.setState({
      'childElements': childElements,
      'lastInserted': index
    });

    // NB!(igor.alexeenko) I don't use this.setState['animationDeferred'] here
    // to prevent rerendering of component, because every update of component's
    // state unfortunately causes second render. So I've decided to change
    // state of component only if it's really needed: when I change the number
    // of child components. In other cases it's better to use private properties.
    /**
     * @type {jQuery.Deferred}
     * @private
     */
    this._animationDeferred = animationDeferred;

    if (timeout) {
      setTimeout(function() {
        this.remove(index);
      }.bind(this), timeout)
    }

    animationDeferred.done(function() {
      this._animationDeferred = null;
    }.bind(this));
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
    evt.preventDefault();
    this.remove(i);
  }
});


/** @type {Alerts} */
module.exports = Alerts;
