/**
 * @fileoverview Stack of alerts at the top of the page.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

require('./alert.scss');
var Alert = require('./alert');
var React = require('react/addons');
var when = require('when');


/**
 * List of all executed animations.
 * @type {Array.<Deferred>}
 * @private
 */
var _animationQueue = [];


/**
 * @type {Element}
 * @private
 */
var _containerClone = null;


/**
 * @type {CSSStyleSheet}
 * @private
 */
var _stylesheet = null;


/**
 * @type {number}
 * @private
 */
var _gap = null;


/**
 * @name Alerts
 * @constructor
 * @description Alerts component
 * @extends {ReactComponent}
 * @example
   <example name="Alerts">
     <file name="index.html">
       <div id="alerts-container"></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Alerts = require('./alerts.jsx');

       var alertsContainer = React.renderComponent(Alerts(null),
           document.getElementById('alerts-container'));

       alertsContainer.add('Test message');
       alertsContainer.add('Another test message', Alerts.Type.MESSAGE, 1000);
       alertsContainer.add('Test warning', Alerts.Type.WARNING);
     </file>
   </example>
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
      'lastInserted': null,

      /**
       * Remove handler on close alert.
       * @type {?function(AlertInstance):undefined}
       */
      onRemove: null
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
          return (
            <Alert
              animationDeferred={child.animationDeferred}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onCloseClick={child.onCloseClick}
              ref={'alert-' + child.key}
              type={child.type} />
          );
        })}
      </React.addons.CSSTransitionGroup>
    </div>);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (_gap === null) {
      var computedStyle = window.getComputedStyle(this.getDOMNode());
      _gap = parseInt(computedStyle.paddingTop, 10);
    }

    var childElements = nextState.childElements;
    var lastAddedElement = childElements[childElements.length - 1];

    if (!_containerClone) {
      _containerClone = this.getDOMNode().cloneNode(false);
      _containerClone.style.visibility = 'hidden';
      _containerClone.style.top = '-900em';
      document.body.appendChild(_containerClone);
    }

    if (!_stylesheet) {
      /**
       * @type {HTMLStyleElement}
       */
      var styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(''));
      document.body.appendChild(styleElement);

      _stylesheet = styleElement.sheet;
    }

    this._cleanupStyles();

    var alertToAppend = React.renderComponent(new Alert(lastAddedElement), _containerClone);
    var heightToCompensate = alertToAppend.getDOMNode().offsetHeight;

    // todo(igor.alexeenko): Merge vertical animation to element's height with animation from Header.
    _stylesheet.insertRule('.alert-enter { margin-top: -' + (heightToCompensate + _gap) + 'px }', 0);

    React.unmountComponentAtNode(_containerClone);
  },

  componentWillUnmount: function() {
    this._cleanupStyles();

    document.body.removeChild(_containerClone);
    document.body.removeChild(_stylesheet.ownerNode);
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
   * Creates a Deferred and enqueues it.
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   * @return {Deferred}
   */
  add: function(caption, type, timeout) {
    var animationDeferred = when.defer();

    _animationQueue.push(animationDeferred);
    var currentAnimationIndex = _animationQueue.indexOf(animationDeferred);

    if (currentAnimationIndex > 0) {
      _animationQueue[currentAnimationIndex - 1].promise.then(function() {
        this._addElement(caption, type, animationDeferred, timeout);
      }.bind(this));
    } else {
      this._addElement(caption, type, animationDeferred, timeout);
    }

    return animationDeferred;
  },

  /**
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {Deferred} animationDeferred
   * @param {number=} timeout
   * @private
   */
  _addElement: function(caption, type, animationDeferred, timeout) {
    var childElements = this.state.childElements.slice(0);
    var index = childElements.length;

    childElements.push({
      animationDeferred: animationDeferred,
      caption: caption,
      key: index,
      onCloseClick: function(evt) {
        this._handleClick(evt, index);
      }.bind(this),
      type: type
    });

    this.setState({
      childElements: childElements,
      lastInserted: index
    });

    if (timeout) {
      setTimeout(function() {
        this.remove(index);
      }.bind(this), timeout);
    }

    animationDeferred.promise.then(function() {
      _animationQueue.shift();
    });
  },

  /**
   * @param {number} index
   */
  remove: function(index) {
    var childElements = this.state.childElements.slice(0);

    if (this.props.onRemove){
      this.props.onRemove(childElements[index]);
    }

    // NB!(igor.alexeenko): I don't delete item, but set it as undefined
    // because all custom click handlers are bound to element's index in array
    // of child elements.
    delete childElements[index];

    this.setState({ childElements: childElements });
  },

  /**
   * @private
   */
  _cleanupStyles: function() {
    while (_stylesheet.cssRules.length) {
      _stylesheet.deleteRule(0);
    }
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @param {number} i
   * @private
   */
  _handleClick: function(evt, i) {
    this.remove(i);
  }
});


/** @type {Alerts} */
module.exports = Alerts;
