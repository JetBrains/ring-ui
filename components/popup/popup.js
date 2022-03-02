/**
 * @name Popup
 */

import React, {PureComponent} from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import {Listeners, getStyles} from '../global/dom';
import Shortcuts from '../shortcuts/shortcuts';
import dataTests from '../global/data-tests';

import TabTrap from '../tab-trap/tab-trap';

import position, {positionPropKeys} from './position';
import styles from './popup.css';
import {
  DEFAULT_DIRECTIONS,
  Dimension,
  Directions,
  Display,
  MaxHeight,
  MinWidth
} from './popup.consts';
import {PopupTargetContext, PopupTarget} from './popup.target';

export {PopupTargetContext, PopupTarget};

const stop = e => e.stopPropagation();

export const getPopupContainer = target => (typeof target === 'string' ? document.querySelector(`[data-portaltarget=${target}]`) : target);

/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 */
export default class Popup extends PureComponent {
  static propTypes = {
    anchorElement: PropTypes.instanceOf(Node),
    target: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
    className: PropTypes.string,
    style: PropTypes.object,
    hidden: PropTypes.bool.isRequired,
    onOutsideClick: PropTypes.func,
    onEscPress: PropTypes.func,
    // onCloseAttempt is a common callback for ESC pressing and outside clicking.
    // Use it if you don't need different behaviors for this cases.
    onCloseAttempt: PropTypes.func,
    children: PropTypes.node.isRequired,
    dontCloseOnAnchorClick: PropTypes.bool,
    shortcuts: PropTypes.bool,
    keepMounted: PropTypes.bool, // pass this prop to preserve the popup's DOM state while hidden
    'data-test': PropTypes.string,
    client: PropTypes.bool, // true means that it's never used in SSR

    directions: PropTypes.arrayOf(PropTypes.string),
    autoPositioning: PropTypes.bool,
    autoPositioningOnScroll: PropTypes.bool,
    autoCorrectTopOverflow: PropTypes.bool,
    left: PropTypes.number,
    top: PropTypes.number,
    maxHeight: PropTypes.number,
    minWidth: PropTypes.number,
    sidePadding: PropTypes.number,

    attached: PropTypes.bool, // Popup adjacent to an input, without upper border and shadow

    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onContextMenu: PropTypes.func,
    onDirectionChange: PropTypes.func,
    onShow: PropTypes.func,
    // set to true whenever popup contains focusable and scrollable content
    trapFocus: PropTypes.bool,
    autoFocusFirst: PropTypes.bool
  };

  static defaultProps = {
    shortcuts: true,
    hidden: false,
    onOutsideClick() {},
    onEscPress() {},
    onCloseAttempt() {},
    dontCloseOnAnchorClick: false,
    keepMounted: false,

    directions: DEFAULT_DIRECTIONS,
    autoPositioning: true,
    autoPositioningOnScroll: true,
    autoCorrectTopOverflow: true,
    left: 0,
    top: 0,
    offset: 0,
    sidePadding: 8,

    attached: false,
    trapFocus: false,
    autoFocusFirst: false,

    legacy: false
  };

  state = {
    display: Display.SHOWING
  };

  componentDidMount() {
    if (!this.props.client) {
      this.setState({client: true});
    }
    if (!this.props.hidden) {
      this._setListenersEnabled(true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {hidden} = this.props;
    if (this.props !== prevProps) {

      if (prevProps.hidden !== hidden) {
        this._setListenersEnabled(!hidden);
      }

      this._redraw();
    }

    if (
      this.props.onShow &&
      !hidden &&
      this.state.display === Display.SHOWN &&
      (prevProps.hidden || prevState.display !== Display.SHOWN)
    ) {
      this.props.onShow();
    }
  }

  componentWillUnmount() {
    this._setListenersEnabled(false);
    this.popup = null;
  }

  shouldUseShortcuts() {
    const {shortcuts, hidden} = this.props;
    return shortcuts && !hidden;
  }

  listeners = new Listeners();
  redrawScheduler = scheduleRAF(true);
  uid = getUID('popup-');
  calculateDisplay = prevState => ({
    ...prevState,
    display: this.props.hidden
      ? Display.SHOWING
      : Display.SHOWN
  });

  static PopupProps = {
    Directions,
    Dimension,
    MinWidth,
    MaxHeight
  };

  portalRef = el => {
    this.node = el;
    this.parent = el && el.parentElement;
    if (el && this.getContainer()) {
      this._redraw();
    }
  };

  popupRef = el => {
    this.popup = el;
    this._redraw();
  };

  containerRef = el => {
    this.container = el;
  };

  getContainer() {
    const target = this.props.target || this.ringPopupTarget;
    return target && getPopupContainer(target);
  }

  position() {
    const positionProps = positionPropKeys.reduce((acc, key) => {
      acc[key] = this.props[key];
      return acc;
    }, {});
    const container = this.getContainer();

    return position({
      popup: this.popup,
      container: container && getStyles(container).position !== 'static' ? container : null,
      anchor: this._getAnchor(),
      ...positionProps
    });
  }

  _updateDirection = newDirection => {
    if (this.state.direction !== newDirection) {
      this.setState({direction: newDirection});
      if (this.props.onDirectionChange) {
        this.props.onDirectionChange(newDirection);
      }
    }
  };

  _updatePosition = () => {
    if (this.popup) {
      this.popup.style.position = 'absolute';
      if (this.isVisible()) {
        const {styles: style, direction} = this.position();
        Object.keys(style).forEach(key => {
          const value = style[key];
          if (typeof value === 'number') {
            this.popup.style[key] = `${value}px`;
          } else {
            this.popup.style[key] = value.toString();
          }
        });
        this._updateDirection(direction);
      }
      this.setState(this.calculateDisplay);
    }
  };

  _redraw = () => {
    if (this.isVisible()) {
      this.redrawScheduler(this._updatePosition);
    }
  };

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
        if (this.props.autoPositioningOnScroll) {
          this.listeners.add(window, 'scroll', this._redraw);
        }
        this.listeners.add(document, 'pointerdown', this._onDocumentClick, true);
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
  };

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
  };

  getInternalContent() {
    const {trapFocus, autoFocusFirst, children} = this.props;
    return trapFocus
      ? (
        <TabTrap autoFocusFirst={autoFocusFirst} focusBackOnExit>
          {children}
        </TabTrap>
      )
      : children;
  }

  shortcutsScope = this.uid;
  shortcutsMap = {
    esc: this._onEscPress
  };

  render() {
    const {
      className, style, hidden, attached, keepMounted, client,
      onMouseDown, onMouseUp, onMouseOver, onMouseOut, onContextMenu, 'data-test': dataTest
    } = this.props;
    const showing = this.state.display === Display.SHOWING;

    const classes = classNames(className, styles.popup, {
      [styles.attached]: attached,
      [styles.hidden]: hidden,
      [styles.showing]: showing
    });

    const direction = (this.state.direction || '').
      toLowerCase().replace(/[_]/g, '-');

    return (
      <PopupTargetContext.Consumer>
        {value => {
          this.ringPopupTarget = value;
          return (
            <span
              // prevent bubbling through portal
              onClick={stop}
              // This handler only blocks bubbling through React portal
              role="presentation"
              ref={this.portalRef}
            >
              {this.shouldUseShortcuts() &&
              (
                <Shortcuts
                  map={this.shortcutsMap}
                  scope={this.shortcutsScope}
                />
              )
              }

              {(client || this.state.client) && (keepMounted || !hidden) && createPortal(
                <PopupTarget
                  id={this.uid}
                  ref={this.containerRef}
                  onMouseOver={onMouseOver}
                  onFocus={onMouseOver}
                  onMouseOut={onMouseOut}
                  onBlur={onMouseOut}
                  onContextMenu={onContextMenu}
                >
                  <div
                    data-test={dataTests('ring-popup', dataTest)}
                    data-test-shown={!hidden && !showing}
                    data-test-direction={direction}
                    ref={this.popupRef}
                    className={classes}
                    style={style}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    // mouse handlers are used to track clicking on inner elements
                    role="presentation"
                  >
                    {this.getInternalContent()}
                  </div>
                </PopupTarget>,
                this.getContainer() || document.body
              )}
            </span>
          );
        }}
      </PopupTargetContext.Consumer>
    );
  }
}
