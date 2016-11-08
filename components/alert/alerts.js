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
 * @category Components
 * @description Displays a stack of alerts on top of the page.
 * @extends {RingComponent}
 * @example-file ./alerts.examples.html
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
        {this.state.childElements.map(function (child, i) {
          return (
            <Alert
              animationResolver={child.animationResolver}
              caption={child.caption}
              closeable={true}
              inline={false}
              key={child.key}
              onCloseClick={() => this.remove(child)}
              ref={`alert-${i}`}
              type={child.type}
              count={child.count}
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

    this._stylesheet.insertRule(`.alert-enter { margin-top: -${heightToCompensate + this._gap}px }`, 0);

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
    Children.forEach(this.props.children, child => {
      children.unshift(child);
    });

    this.setState({childElements: children});
  }

  lastAlert = {};

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
        if (this.lastAlert.caption === caption && this.lastAlert.type === type) {
          this._updateElement(this.lastAlert, this.lastAlert.count + 1, caption, type, timeout);
          return undefined;
        } else {
          this.lastAlert = this._addElement(caption, type, resolve, timeout);
          return animationPromise;
        }
      });
    });

    return animationPromise;
  }

  _updateElement(targetElement, count, caption, type, timeout) {
    const childElements = this.state.childElements.slice(0);

    for (let i = 0; i < childElements.length; i++) {
      const element = childElements[i];
      if (element === targetElement) {
        element.caption = caption;
        element.count = count;
        element.type = type;

        if (element.timeout) {
          clearTimeout(element.timeout);
        }

        element.timeout = setTimeout(() => this.remove(element), timeout);

        break;
      }
    }

    this.setState({childElements});
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
    const key = captionText + type + Date.now();

    const element = {
      animationResolver,
      caption,
      key,
      type,
      timeout: null,
      count: 1
    };

    if (timeout) {
      element.timeout = setTimeout(() => this.remove(element), timeout);
    }

    childElements.unshift(element);

    this.setState({childElements});

    return element;
  }

  /**
   * @param {Object} element
   */
  remove(element) {
    const childElements = this.state.childElements.slice(0);
    const elementIndex = childElements.indexOf(element);

    if (element === this.lastAlert) {
      this.lastAlert = {};
    }

    if (elementIndex === -1) {
      return;
    }

    if (this.props.onRemove) {
      this.props.onRemove(element);
    }

    childElements.splice(elementIndex, 1);
    this.setState({childElements});
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
