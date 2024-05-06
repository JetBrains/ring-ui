/**
 * @name Popup
 */

import React, {PureComponent, ReactNode, CSSProperties, SyntheticEvent, ComponentType} from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getUID from '../global/get-uid';
import scheduleRAF from '../global/schedule-raf';
import {Listeners, getStyles} from '../global/dom';
import Shortcuts from '../shortcuts/shortcuts';
import dataTests from '../global/data-tests';

import TabTrap from '../tab-trap/tab-trap';

import position, {PositionStyles} from './position';
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

const isPossibleClientSideNavigation = (event: React.MouseEvent) => {
  const target = event.target as Element;
  const link = target.closest<HTMLAnchorElement>('a');
  // Taken from https://github.com/nanostores/router/blob/80a333db4cf0789fda21a02715ebabca15192642/index.js#L58-L69
  return link &&
    event.button === 0 && // Left mouse button
    link.target !== '_blank' && // Not for new tab
    link.origin === location.origin && // Not external link
    link.rel !== 'external' && // Not external link
    link.target !== '_self' && // Now manually disabled
    !link.download && // Not download link
    !event.altKey && // Not download link by user
    !event.metaKey && // Not open in new tab by user
    !event.ctrlKey && // Not open in new tab by user
    !event.shiftKey && // Not open in new window by user
    !event.defaultPrevented;
};

const stop = (event: React.MouseEvent) => {
  if (!isPossibleClientSideNavigation(event)) {
    event.stopPropagation();
  }
};

export const getPopupContainer = (target: string | Element) => (typeof target === 'string' ? document.querySelector(`[data-portaltarget=${target}]`) : target);

export interface BasePopupProps {
  hidden: boolean
  onOutsideClick: (e: PointerEvent) => void
  onEscPress: (e: KeyboardEvent) => void
  // onCloseAttempt is a common callback for ESC pressing and outside clicking.
  // Use it if you don't need different behaviors for this cases.
  onCloseAttempt: (e?: Event | SyntheticEvent, isEsc?: boolean | undefined) => void
  dontCloseOnAnchorClick: boolean
  shortcuts: boolean
  keepMounted: boolean, // pass this prop to preserve the popup's DOM state while hidde
  directions: readonly Directions[]
  autoPositioning: boolean
  autoPositioningOnScroll: boolean,
  autoCorrectTopOverflow: boolean
  left: number
  top: number
  sidePadding: number

  attached: boolean // Popup adjacent to an input, without upper border and shado
  // set to true whenever popup contains focusable and scrollable content
  trapFocus: boolean
  autoFocusFirst: boolean
  offset: number
  legacy: boolean
  withTail?: boolean
  tailOffset?: number

  anchorElement?: HTMLElement | null | undefined
  target?: string | Element | null | undefined
  className?: string | null | undefined
  style?: CSSProperties | undefined
  'data-test'?: string | null | undefined
  client?: boolean | null | undefined // true means that it's never used in SSR

  maxHeight?: number | 'screen' | null | undefined
  minWidth?: number | 'target' | null | undefined

  onMouseDown?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
  onMouseUp?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
  onMouseOver?: ((e: React.SyntheticEvent<HTMLElement>) => void) | undefined
  onMouseOut?: ((e: React.SyntheticEvent<HTMLElement>) => void) | undefined
  onContextMenu?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
  onDirectionChange?: ((direction: Directions) => void) | null | undefined
  onShow?: (() => void) | null | undefined
  children?: ReactNode
}

export interface PopupProps extends BasePopupProps {
  children: ReactNode
}

interface PopupState {
  display: Display
  client?: boolean
  direction?: Directions
}

/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 */
export default class Popup<
  P extends BasePopupProps = PopupProps
> extends PureComponent<P, PopupState> {
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

  state: PopupState = {
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

  componentDidUpdate(prevProps: BasePopupProps, prevState: PopupState) {
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
  }

  popup?: HTMLElement | null;
  node?: HTMLElement | null;
  parent?: HTMLElement | null;
  container?: HTMLElement | null;
  ringPopupTarget?: string | Element;

  shouldUseShortcuts() {
    const {shortcuts, hidden} = this.props;
    return shortcuts && !hidden;
  }

  listeners = new Listeners();
  redrawScheduler = scheduleRAF(true);
  uid = getUID('popup-');
  calculateDisplay = (prevState: PopupState) => ({
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

  portalRef = (el: HTMLElement | null) => {
    this.node = el;
    this.parent = el && el.parentElement;
    if (el && this.getContainer()) {
      this._redraw();
    }
  };

  popupRef = (el: HTMLElement | null) => {
    this.popup = el;
    this._redraw();
  };

  containerRef = (el: HTMLElement | null) => {
    this.container = el;
  };

  getContainer() {
    const target = this.props.target || this.ringPopupTarget;
    return target && getPopupContainer(target);
  }

  position() {
    const {
      directions,
      autoPositioning,
      autoCorrectTopOverflow,
      sidePadding,
      top,
      left,
      offset,
      maxHeight,
      minWidth
    } = this.props;
    const container = this.getContainer();

    return position({
      popup: this.popup,
      container: container && getStyles(container).position !== 'static' ? container : null,
      anchor: this._getAnchor(),
      directions,
      autoPositioning,
      autoCorrectTopOverflow,
      sidePadding,
      top,
      left,
      offset,
      maxHeight,
      minWidth
    });
  }

  private _updateDirection = (newDirection: Directions) => {
    if (this.state.direction !== newDirection) {
      this.setState({direction: newDirection});
      if (this.props.onDirectionChange) {
        this.props.onDirectionChange(newDirection);
      }
    }
  };

  private _updatePosition = () => {
    const popup = this.popup;
    if (popup) {
      popup.style.position = 'absolute';
      if (this.isVisible()) {
        const {styles: style, direction} = this.position();
        Object.entries(style).forEach(([key, value]) => {
          const propKey = key as keyof PositionStyles;
          if (typeof value === 'number') {
            popup.style[propKey] = `${value}px`;
          } else {
            popup.style[propKey] = value.toString();
          }
        });
        if (direction != null) {
          this._updateDirection(direction);
        }
      }
      this.setState(this.calculateDisplay);
    }
  };

  private _redraw = () => {
    if (this.isVisible()) {
      this.redrawScheduler(this._updatePosition);
    }
  };

  private _getAnchor() {
    return this.props.anchorElement || this.parent;
  }

  private _listenersEnabled?: boolean;
  /**
   * @param {boolean} enable
   * @private
   */
  private _setListenersEnabled(enable: boolean) {
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

  _onCloseAttempt(evt?: Event | SyntheticEvent, isEsc?: boolean) {
    this.props.onCloseAttempt(evt, isEsc);
  }

  private _onEscPress = (evt: KeyboardEvent) => {
    this.props.onEscPress(evt);
    this._onCloseAttempt(evt, true);
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  private _onDocumentClick = (evt: PointerEvent) => {
    if (
      this.container && evt.target instanceof Node && this.container.contains(evt.target) ||
      !this._listenersEnabled ||
      (
        this.props.dontCloseOnAnchorClick &&
        evt.target instanceof Node &&
        this._getAnchor()?.contains(evt.target)
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

(Popup as ComponentType<unknown>).propTypes = {
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
  autoCorrectTopOverflow: PropTypes.bool,
  left: PropTypes.number,
  top: PropTypes.number,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

export type PopupAttrs = JSX.LibraryManagedAttributes<typeof Popup, PopupProps>
export type BasePopupAttrs = JSX.LibraryManagedAttributes<typeof Popup, BasePopupProps>;
