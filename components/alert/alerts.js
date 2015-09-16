/**
 * @fileoverview Stack of alerts at the top of the page.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

import React, { createElement, Children } from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import when from 'when';

import RingComponent from 'ring-component/ring-component';
import Alert from './alert';

import './alert.scss';

const css = window.getComputedStyle;

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
       var render = require('react-dom').render;
       var Alerts = require('alert/alerts');

       var alertsContainer = render(Alerts.factory(), document.getElementById('alerts-container'));

       alertsContainer.add('Test message');
       alertsContainer.add('Another test message', Alerts.Type.MESSAGE, 1000);
       alertsContainer.add('Test warning', Alerts.Type.WARNING);
     </file>
   </example>
 */
export default class Alerts extends RingComponent {
  static Type = Alert.Type;

  /** @override */
  state = {
    /** @type {Array.<Object>} */
    childElements: [],

    /**
     * Remove handler on close alert.
     * @type {?function(AlertInstance):undefined}
     */
    onRemove: null
  };

  /**
   * @type {Element}
   * @private
   */
  _containerClone = null;

  /**
   * @type {CSSStyleSheet}
   * @private
   */
  _stylesheet = null;

  /**
   * @type {number}
   * @private
   */
  _gap = null;

  /** @override */
  render() {
    if (!this.state.childElements) {
      this._getChildElements();
    }

    return (<div className="ring-alerts">
      <CSSTransitionGroup transitionName="alert">
        {this.state.childElements.reverse().map(function(child, i) {
          return (
            <Alert
              animationDeferred={child.animationDeferred}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onCloseClick={() => this.remove(child)}
              ref={'alert-' + i}
              type={child.type} />
          );
        }, this)}
      </CSSTransitionGroup>
    </div>);
  }

  didMount() {
    this.animationPromise = when();
  }

  willUpdate(nextProps, nextState) {
    let node = findDOMNode(this);

    if (this._gap === null) {
      let computedStyle = css(node);
      this._gap = parseInt(computedStyle.paddingTop, 10);
    }

    let childElements = nextState.childElements;
    let lastAddedElement = childElements[childElements.length - 1];

    if (!this._containerClone) {
      this._containerClone = node.cloneNode(false);
      this._containerClone.style.visibility = 'hidden';
      this._containerClone.style.top = '-900em';
      document.body.appendChild(this._containerClone);
    }

    if (!this._stylesheet) {
      /**
       * @type {HTMLStyleElement}
       */
      let styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(''));
      document.body.appendChild(styleElement);

      this._stylesheet = styleElement.sheet;
    }

    this._cleanupStyles();

    let alertToAppend = render(createElement(Alert, lastAddedElement), this._containerClone);
    let heightToCompensate = findDOMNode(alertToAppend).offsetHeight;

    // todo(igor.alexeenko): Merge vertical animation to element's height with animation from Header.
    this._stylesheet.insertRule('.alert-enter { margin-top: -' + (heightToCompensate + this._gap) + 'px }', 0);

    unmountComponentAtNode(this._containerClone);
  }

  willUnmount() {
    this._cleanupStyles();

    this._containerClone.remove();
    this._stylesheet.ownerNode.remove();
  }

  /**
   * @private
   */
  _getChildElements() {
    let children = [];
    Children.forEach(this.props.children, function(child) {
      children.push(child);
    });

    this.setState({ 'childElements': children });
  }

  /**
   * Creates a Deferred and enqueues it.
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   * @return {Deferred}
   */
  add(caption, type, timeout) {
    let animationDeferred = when.defer();

    this.animationPromise = this.animationPromise.then(() => {
      this._addElement(caption, type, animationDeferred, timeout);
      return animationDeferred.promise;
    });

    return animationDeferred;
  }

  /**
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {Deferred} animationDeferred
   * @param {number=} timeout
   * @private
   */
  _addElement(caption, type, animationDeferred, timeout) {
    let childElements = this.state.childElements.slice(0);
    let captionText = typeof caption === 'string' ? caption : 'composite';

    let element = {
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
      setTimeout(() => this.remove(element), timeout);
    }
  }

  /**
   * @param {Object} element
   */
  remove(element) {
    let childElements = this.state.childElements.slice(0);
    let elementIndex = childElements.indexOf(element);

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
  }

  /**
   * @private
   */
  _cleanupStyles() {
    while (this._stylesheet.cssRules.length) {
      this._stylesheet.deleteRule(0);
    }
  }
}
