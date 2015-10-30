/**
 * @fileoverview Stack of alerts at the top of the page.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

import React, {createElement, Children} from 'react';
import {render, findDOMNode, unmountComponentAtNode} from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import RingComponent from '../ring-component/ring-component';
import {getStyles, isMounted} from '../dom/dom';
import Alert from './alert';

import './alert.scss';

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
       var Alerts = require('ring-ui/components/alert/alerts');

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
      <CSSTransitionGroup
        transitionName="alert"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
      >
        {this.state.childElements.reverse().map(function (child, i) {
          return (
            <Alert
              animationResolver={child.animationResolver}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onCloseClick={() => this.remove(child)}
              ref={'alert-' + i}
              type={child.type}
            />
          );
        }, this)}
      </CSSTransitionGroup>
    </div>);
  }

  didMount() {
    this.animationPromise = Promise.resolve();
  }

  willUpdate(nextProps, nextState) {
    if (this._gap === null && isMounted(this.node)) {
      this._gap = parseInt(getStyles(this.node).paddingTop, 10);
    }

    const childElements = nextState.childElements;
    const lastAddedElement = childElements[childElements.length - 1];

    if (!this._containerClone) {
      this._containerClone = this.node.cloneNode(false);
      this._containerClone.style.visibility = 'hidden';
      this._containerClone.style.top = '-900em';
      document.body.appendChild(this._containerClone);
    }

    if (!this._stylesheet) {
      /**
       * @type {HTMLStyleElement}
       */
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(''));
      document.body.appendChild(styleElement);

      this._stylesheet = styleElement.sheet;
    }

    this._cleanupStyles();

    const alertToAppend = render(createElement(Alert, lastAddedElement), this._containerClone);
    const heightToCompensate = findDOMNode(alertToAppend).offsetHeight;

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
    const children = [];
    Children.forEach(this.props.children, function (child) {
      children.push(child);
    });

    this.setState({childElements: children});
  }

  /**
   * Creates a Deferred and enqueues it.
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {number=} timeout
   * @return {Deferred}
   */
  add(caption, type, timeout) {
    const animationPromise = new Promise(resolve => {
      this.animationPromise = this.animationPromise.then(() => {
        this._addElement(caption, type, resolve, timeout);
        return animationPromise;
      });
    });

    return animationPromise;
  }

  /**
   * @param {ReactComponent|string} caption
   * @param {Alert.Type=} type
   * @param {Deferred} animationResolver
   * @param {number=} timeout
   * @private
   */
  _addElement(caption, type, animationResolver, timeout) {
    const childElements = this.state.childElements.slice(0);
    const captionText = typeof caption === 'string' ? caption : 'composite';

    const element = {
      animationResolver: animationResolver,
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
    const childElements = this.state.childElements.slice(0);
    const elementIndex = childElements.indexOf(element);

    if (elementIndex === -1) {
      return;
    }

    if (this.props.onRemove) {
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
