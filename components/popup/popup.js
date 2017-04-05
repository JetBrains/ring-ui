/**
 * @name Popup
 * @category Components
 * @tags 3.0
 * @description Displays a popup.
 */

import React, {PropTypes, cloneElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import Portal from '@hypnosphi/react-portal';
import classNames from 'classnames';
import 'dom4';
import 'core-js/modules/es7.array.includes';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import position, {DEFAULT_DIRECTIONS, Directions, Dimension, Display, positionPropKeys, MaxHeight, MinWidth} from './position.js';
import {Listeners} from '../global/dom';

import styles from './popup.css';

const legacyPopups = new Set();

const Messages = {
  STOP_RENDERING: 'Stop rendering the Popup element if you want it to disappear',
  RENDER_DIRECTLY: 'Render Popup directly as a child',
  SHOW: 'Pass "hidden" property to control popup visibility',
  ON_CLOSE_ATTEMPT: 'Use "onCloseAttempt" callback to react to close attempts',
  CUT_EDGE_RENAMED: '"cutEdge" property has been renamed to "attached" with default of false'
};

function legacyProp(propType, message) {
  return function check(props, propName, ...restArgs) {
    if (!props.legacy && propName in props) {
      return new Error(`"${propName}" prop is deprecated. ${message}`);
    }
    return propType(props, propName, ...restArgs);
  };
}

function deprecateString(old, replacement) {
  return function check(props, propName, ...restArgs) {
    const isNumber = PropTypes.number(props, propName, ...restArgs);
    if (isNumber instanceof Error) {
      return new Error(`${propName}="${old}" is deprecated. use Popup.PopupProps.${replacement} instead`);
    }
    return isNumber;
  };
}

/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 * @example-file ./popup.examples.html
 */
export default class Popup extends RingComponentWithShortcuts {
  static propTypes = {
    anchorElement: PropTypes.instanceOf(Node),
    className: PropTypes.string,
    hidden: PropTypes.bool.isRequired,
    onOutsideClick: PropTypes.func,
    onEscPress: PropTypes.func,
    // onCloseAttempt is a common callback for ESC pressing and outside clicking.
    // Use it if you don't need different behaviors for this cases.
    onCloseAttempt: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    dontCloseOnAnchorClick: PropTypes.bool,
    shortcuts: PropTypes.bool,
    keepMounted: PropTypes.bool, // pass this prop to preserve the popup's DOM state while hidden

    directions: PropTypes.arrayOf(PropTypes.string),
    autoPositioning: PropTypes.bool,
    left: PropTypes.number,
    top: PropTypes.number,
    maxHeight: deprecateString('screen', 'MaxHeight.SCREEN'),
    minWidth: deprecateString('target', 'MinWidth.TARGET'),
    sidePadding: PropTypes.number,

    attached: PropTypes.bool, // Popup adjacent to an input, without upper border and shadow

    legacy: PropTypes.bool,
    autoRemove: legacyProp(PropTypes.bool, Messages.STOP_RENDERING),
    onClose: legacyProp(PropTypes.func, Messages.ON_CLOSE_ATTEMPT),
    cutEdge(props) {
      if ('cutEdge' in props) {
        return new Error(Messages.CUT_EDGE_RENAMED);
      }
      return null;
    }
  };

  static contextTypes = {
    parentPopupUid: PropTypes.string
  };

  static childContextTypes = {
    parentPopupUid: PropTypes.string
  };

  static defaultProps = {
    ['data-test']: 'ring-popup',
    shortcuts: true,
    hidden: false,
    onOutsideClick() {},
    onEscPress() {},
    onCloseAttempt() {},
    dontCloseOnAnchorClick: false,
    keepMounted: false,

    directions: DEFAULT_DIRECTIONS,
    autoPositioning: true,
    left: 0,
    top: 0,
    sidePadding: 8,

    attached: false,

    legacy: false
  };

  static PopupProps = {
    Directions,
    Dimension,
    MinWidth,
    MaxHeight
  };

  static hideAllPopups() {
    // eslint-disable-next-line no-console
    console.warn(`Popup.hideAllPopups is deprecated. ${Messages.SHOW}`);
    legacyPopups.forEach(instance => instance.hide());
  }

  /**
   * @static
   * @param {ReactComponent} component
   * @param {Function} callback Callback to execute after rendering
   * @param {Object=} params Optional params
   * @param {Function} params.onRender Callback to run after rendering
   * @return {HTMLElement}
   */
  static renderPopup(element, {onRender} = {}) {
    // eslint-disable-next-line no-console
    console.warn(`Popup.renderPopup is deprecated. ${Messages.RENDER_DIRECTLY}`);
    const wrapperElement = document.createElement('span');
    const container = element.props && element.props.anchorElement || document.body;
    container.appendChild(wrapperElement);
    const cloned = cloneElement(element, {
      legacy: true
    });

    const popupInstance = render(cloned, wrapperElement, onRender);
    return popupInstance;
  }

  listeners = new Listeners();
  redrawScheduler = scheduleRAF();
  uid = getUID('popup-');

  calculateDisplay = prevState => ({
    ...prevState,
    display: this.props.hidden
        ? Display.SHOWING
        : Display.SHOWN
  });

  state = {
    display: Display.SHOWING
  }

  getShortcutsProps() {
    return {
      map: {
        esc: this._onEscPress
      },
      scope: this.uid
    };
  }

  getChildContext() {
    return {
      parentPopupUid: this.uid
    };
  }

  /** @override */
  componentWillMount() {
    this.setShortcutsEnabled(this.props.shortcuts && !this.props.hidden);
  }

  didMount() {
    if (!this.props.hidden) {
      this._setListenersEnabled(true);
    }
    if (this.props.legacy) {
      legacyPopups.add(this);
    }
  }

  /** @override */
  componentWillUpdate(nextProps) {
    this.setShortcutsEnabled(nextProps.shortcuts && !nextProps.hidden);
  }

  didUpdate(prevProps) {
    if (this.props !== prevProps) {
      const {hidden} = this.props;

      if (prevProps.hidden !== hidden) {
        this._setListenersEnabled(!hidden);
      }

      this._redraw();
    }
  }

  willUnmount() {
    if (this.props.legacy) {
      legacyPopups.delete(this);
    }
    this._setListenersEnabled(false);
    this.popup = null;
  }

  portalRef = el => {
    this.parent = el && el.parentElement;
    if (el && this.context.parentPopupUid) {
      this._redraw();
    }
  }

  popupRef = el => {
    this.popup = el;
    this._redraw();
  }

  render() {
    const {className, hidden, attached, keepMounted, legacy, cutEdge, onMouseDown, onMouseUp} = this.props;
    const showing = this.state.display === Display.SHOWING;

    const classes = classNames(className, styles.popup, {
      [styles.attached]: attached || legacy && cutEdge !== false,
      [styles.hidden]: hidden,
      [styles.showing]: showing
    });

    return (
      <span
        ref={this.portalRef}
      >
        <Portal
          isOpen={keepMounted || !hidden}
          target={this.context.parentPopupUid}
        >
          <div
            data-portaltarget={this.uid}
            ref={el => {
              this.container = el;
            }}
          >
            <div
              data-test={this.props['data-test']}
              data-test-shown={!hidden && !showing}
              ref={this.popupRef}
              className={classes}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            >
              {this.getInternalContent()}
            </div>
          </div>
        </Portal>
      </span>
    );
  }

  position() {
    const positionProps = positionPropKeys.reduce((acc, key) => {
      acc[key] = this.props[key];
      return acc;
    }, {});

    return position({
      popup: this.popup,
      anchor: this._getAnchor(),
      ...positionProps
    });
  }

  _updatePosition = () => {
    if (this.popup) {
      if (this.isVisible()) {
        const style = this.position();
        Object.keys(style).forEach(key => {
          const value = style[key];
          if (typeof value === 'number') {
            this.popup.style[key] = `${value}px`;
          } else {
            this.popup.style[key] = value.toString();
          }
        });
      }
      this.setState(this.calculateDisplay);
    }
  }

  _redraw = () => this.redrawScheduler(this._updatePosition);

  _legacyOnly(method, message = Messages.SHOW) {
    if (!this.props.legacy) {
      throw new Error(`Popup#${method} is deprecated. ${message}`);
    }
  }

  /**
   * Closes the popup and (optionally) removes it from the document
   */
  close(evt) {
    this._legacyOnly('close');

    let onCloseResult;

    if (typeof this.props.onClose === 'function') {
      onCloseResult = this.props.onClose(evt);

      if (onCloseResult === false) {
        return onCloseResult;
      }
    }

    if (this.props.autoRemove !== false) {
      this.remove();
    } else {
      this.hide();
    }

    return onCloseResult;
  }

  hide(cb) {
    this._legacyOnly('hide');

    this.node && this.node.parentNode && this.rerender({
      hidden: true
    }, cb);
  }

  show(cb) {
    this._legacyOnly('show');

    this.node && this.node.parentNode && this.rerender({
      hidden: false
    }, cb);
  }

  _getAnchor() {
    return this.props.anchorElement || this.parent;
  }

  /**
   * @param {boolean} enable
   * @private
   */
  _setListenersEnabled(enable) {
    if (enable && !this._listenersEnabled) {
      setTimeout(() => {
        this._listenersEnabled = true;
        this.listeners.add(window, 'resize', this._redraw);
        this.listeners.add(window, 'scroll', this._redraw);
        this.listeners.add(document, 'click', this._onDocumentClick);
        let el = this._getAnchor();
        while (el) {
          this.listeners.add(el, 'scroll', this._redraw);
          el = el.parentElement;
        }
      }, 0);

      return;
    }

    if (!enable && this._listenersEnabled) {
      this.listeners.removeAll();
      this._listenersEnabled = false;
    }
  }

  /**
   * Returns visibility state
   * @return {boolean}
   */
  isVisible() {
    return !this.props.hidden;
  }

  /**
   * Removes the popup from the document
   */
  remove() {
    this._legacyOnly('remove', Messages.STOP_RENDERING);

    const {parent} = this;

    if (!parent) {
      return;
    }

    unmountComponentAtNode(parent);

    if (parent.parentNode) {
      parent.parentNode.removeChild(parent);
    }
  }

  _onCloseAttempt(evt, isEsc) {
    if (this.props.legacy) {
      this.close(evt);
    }
    this.props.onCloseAttempt(evt, isEsc);
  }

  _onEscPress = evt => {
    this.props.onEscPress(evt);
    this._onCloseAttempt(evt, true);
  }

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  _onDocumentClick = evt => {
    if (
      this.container && this.container.contains(evt.target) ||
      !this._listenersEnabled ||
      this.props.dontCloseOnAnchorClick && this._getAnchor() && this._getAnchor().contains(evt.target)
    ) {
      return;
    }

    this.props.onOutsideClick(evt);
    this._onCloseAttempt(evt, false);
  }

  getInternalContent() {
    return this.props.children;
  }
}
