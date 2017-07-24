/**
 * @name Popup
 * @category Components
 * @description Displays a popup.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@hypnosphi/react-portal';
import classNames from 'classnames';
import 'dom4';
import 'core-js/modules/es7.array.includes';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import {Listeners} from '../global/dom';

import position, {
  DEFAULT_DIRECTIONS,
  Dimension,
  Directions,
  Display,
  MaxHeight,
  MinWidth,
  positionPropKeys
} from './position';
import styles from './popup.css';

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
    maxHeight: PropTypes.number,
    minWidth: PropTypes.number,
    sidePadding: PropTypes.number,

    attached: PropTypes.bool // Popup adjacent to an input, without upper border and shadow
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

    attached: true //TODO change to false in 3.0
  };

  static PopupProps = {
    Directions,
    Dimension,
    MinWidth,
    MaxHeight
  };

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

  containerRef = el => {
    this.container = el;
  };

  render() {
    // eslint-disable-next-line max-len
    const {className, hidden, attached, keepMounted, onMouseDown, onMouseUp} = this.props;
    const showing = this.state.display === Display.SHOWING;

    const classes = classNames(className, styles.popup, {
      [styles.attached]: attached,
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
            ref={this.containerRef}
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

  _onCloseAttempt(evt, isEsc) {
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
      (
        this.props.dontCloseOnAnchorClick &&
        this._getAnchor() &&
        this._getAnchor().contains(evt.target)
      )
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
