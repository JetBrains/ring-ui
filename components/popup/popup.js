/**
 * @name Popup
 */

import React, {PureComponent} from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'dom4';

import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import {Listeners, getStyles} from '../global/dom';
import Shortcuts from '../shortcuts/shortcuts';
import dataTests from '../global/data-tests';

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

const stop = e => e.stopPropagation();

/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 */
export default class Popup extends PureComponent {
  static PopupProps = {
    Directions,
    Dimension,
    MinWidth,
    MaxHeight
  };

  static propTypes = {
    anchorElement: PropTypes.instanceOf(Node),
    target: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
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
    'data-test': PropTypes.string,
    client: PropTypes.bool, // true means that it's never used in SSR

    directions: PropTypes.arrayOf(PropTypes.string),
    autoPositioning: PropTypes.bool,
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
    onDirectionChange: PropTypes.func
  };

  static contextTypes = {
    ringPopupTarget: PropTypes.string
  };

  static childContextTypes = {
    ringPopupTarget: PropTypes.string
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
    autoCorrectTopOverflow: true,
    left: 0,
    top: 0,
    offset: 0,
    sidePadding: 8,

    attached: false,

    legacy: false
  };

  state = {
    shortcuts: this.props.shortcuts && !this.props.hidden,
    display: Display.SHOWING
  };

  getChildContext() {
    return {
      ringPopupTarget: this.uid
    };
  }

  componentDidMount() {
    if (!this.props.client) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({client: true});
    }
    if (!this.props.hidden) {
      this._setListenersEnabled(true);
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const shortcuts = nextProps.shortcuts && !nextProps.hidden;
    if (this.state.shortcuts !== shortcuts) {
      this.setState({shortcuts});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const {hidden} = this.props;

      if (prevProps.hidden !== hidden) {
        this._setListenersEnabled(!hidden);
      }

      this._redraw();
    }
  }

  componentWillUnmount() {
    this._setListenersEnabled(false);
    this.popup = null;
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
    const target = this.props.target || this.context.ringPopupTarget;
    return target && document.querySelector(`[data-portaltarget=${target}]`);
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
  }

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
    return this.props.children;
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
      <span
        // prevent bubbling through portal
        onClick={stop}
        // This handler only blocks bubbling through React portal
        role="presentation"
        ref={this.portalRef}
      >
        {this.state.shortcuts &&
          (
            <Shortcuts
              map={this.shortcutsMap}
              scope={this.shortcutsScope}
            />
          )
        }

        {(client || this.state.client) && (keepMounted || !hidden) && createPortal(
          <div
            data-portaltarget={this.uid}
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
          </div>,
          this.getContainer() || document.body
        )}
      </span>
    );
  }
}
