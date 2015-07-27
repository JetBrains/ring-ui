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
       var Alerts = require('alert/alerts');

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
      childElements: [],

      /**
       * Remove handler on close alert.
       * @type {?function(AlertInstance):undefined}
       */
      onRemove: null
    };
  },

  /** @override */
  render: function() {
    if (!this.state.childElements) {
      this._getChildElements();
    }

    return (<div className="ring-alerts">
      <React.addons.CSSTransitionGroup transitionName="alert">
        {this.state.childElements.reverse().map(function(child, i) {
          return (
            <Alert
              animationDeferred={child.animationDeferred}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onCloseClick={function() {
                this.remove(child);
              }.bind(this)}
              ref={'alert-' + i}
              type={child.type} />
          );
        }, this)}
      </React.addons.CSSTransitionGroup>
    </div>);
  },

  componentDidMount: function() {
    this.animationPromise = when();
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

    this.animationPromise = this.animationPromise.then(function () {
      this._addElement(caption, type, animationDeferred, timeout);

      return animationDeferred.promise;
    }.bind(this));

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
    var captionText = typeof caption === 'string' ? caption : 'composite';

    var element = {
      animationDeferred: animationDeferred,
      caption: caption,
      key: captionText + type + Date.now(),
      type: type
    };
    childElements.push(element);

    this.setState({
      childElements: childElements
    });

    if (timeout) {
      setTimeout(function() {
        this.remove(element);
      }.bind(this), timeout);
    }
  },

  /**
   * @param {Object} element
   */
  remove: function(element) {
    var childElements = this.state.childElements.slice(0);
    var elementIndex = childElements.indexOf(element);

    if (elementIndex === -1) {
      return;
    }

    if (this.props.onRemove){
      this.props.onRemove(element);
    }

    childElements.splice(elementIndex, 1);
    this.setState({
      childElements: childElements
    });
  },

  /**
   * @private
   */
  _cleanupStyles: function() {
    while (_stylesheet.cssRules.length) {
      _stylesheet.deleteRule(0);
    }
  }
});


/** @type {Alerts} */
module.exports = Alerts;
