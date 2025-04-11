import {cloneElement, Component, HTMLAttributes, ReactNode, ReactElement} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import {PopupAttrs} from '../popup/popup';

import {isArray} from '../global/typescript-utils';

import Anchor from './anchor';
import styles from './dropdown.css';

export interface AnchorProps {
  active: boolean;
  pinned: boolean;
}

export interface DropdownChildProps {
  hidden: boolean;
  onCloseAttempt: () => void;
  onMouseDown?: () => void | undefined;
  onContextMenu?: () => void | undefined;
  dontCloseOnAnchorClick: boolean;
}

export type DropdownChildrenFunction = (props: Omit<PopupAttrs, 'children'>) => ReactNode;

export type DropdownChildren = ReactElement<PopupAttrs> | DropdownChildrenFunction;

export interface DropdownProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Can be string, React element, or a function accepting an object with {active, pinned} properties and returning a React element
   * React element should render some interactive HTML element like `button` or `a`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchor: ReactElement<any> | readonly ReactElement<any>[] | string | ((props: AnchorProps) => ReactNode);
  children: DropdownChildren;
  initShown: boolean;
  disabled?: boolean | null | undefined;
  clickMode: boolean;
  hoverMode: boolean;
  hoverShowTimeOut: number;
  hoverHideTimeOut: number;
  onShow: () => void;
  onHide: () => void;
  activeClassName?: string | null | undefined;
  'data-test'?: string | null | undefined;
}

interface DropdownState {
  show: boolean;
  pinned: boolean;
}

/**
 * @name Dropdown
 */

export default class Dropdown extends Component<DropdownProps, DropdownState> {
  static defaultProps = {
    initShown: false,
    clickMode: true,
    hoverMode: false,
    hoverShowTimeOut: 300,
    hoverHideTimeOut: 600,
    disabled: false,
    onShow: () => {},
    onHide: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  state = {
    show: this.props.initShown,
    pinned: false,
  };

  onClick = () => {
    if (this.props.disabled) {
      return;
    }
    const {show, pinned} = this.state;
    let nextPinned = pinned;

    if (this.props.hoverMode) {
      if (!pinned) {
        nextPinned = true;

        if (show) {
          this.setState({pinned: true});
          return;
        }
      } else {
        nextPinned = false;
      }
    }

    this._toggle(!show, nextPinned);
  };

  onChildCloseAttempt = () => {
    let nextPinned = this.state.pinned;
    if (this.props.hoverMode) {
      nextPinned = false;
    }

    this._toggle(false, nextPinned);
  };

  hoverTimer?: number | null;

  onMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (this.props.disabled) {
      return;
    }
    this._clearTimer();
    this.props.onMouseEnter?.(event);

    this.hoverTimer = window.setTimeout(() => {
      if (!this.state.show) {
        this._toggle(true);
      }
    }, this.props.hoverShowTimeOut);
  };

  onMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    if (this.props.disabled) {
      return;
    }
    this.props.onMouseLeave?.(event);
    if (this.state.pinned) {
      return;
    }

    this._clearTimer();

    this.hoverTimer = window.setTimeout(() => {
      if (this.state.show) {
        this._toggle(false);
      }
    }, this.props.hoverHideTimeOut);
  };

  handlePopupInteraction = () => {
    this.setState(({pinned}) => (pinned ? null : {pinned: true}));
  };

  toggle(show = !this.state.show) {
    this._toggle(show);
  }

  _toggle(show: boolean, pinned = this.state.pinned) {
    this.setState({show, pinned}, () => (show ? this.props.onShow() : this.props.onHide()));
  }

  _clearTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  render() {
    const {show, pinned} = this.state;
    const {
      initShown,
      onShow,
      onHide,
      hoverShowTimeOut,
      hoverHideTimeOut,
      children,
      anchor,
      className,
      activeClassName,
      hoverMode,
      clickMode,
      'data-test': dataTest,
      disabled,
      ...restProps
    } = this.props;

    const classes = classNames(styles.dropdown, className, {
      [activeClassName ?? '']: activeClassName != null && show,
    });

    let anchorElement;

    const active = hoverMode ? pinned : show;

    switch (typeof anchor) {
      case 'string':
        anchorElement = <Anchor active={active}>{anchor}</Anchor>;
        break;
      case 'function':
        anchorElement = anchor({active: show, pinned});
        break;

      default:
        if (isArray(anchor) || typeof anchor.type === 'string') {
          anchorElement = anchor;
        } else {
          anchorElement = cloneElement(anchor, {active});
        }
    }

    const childProps: DropdownChildProps = {
      hidden: !show,
      onCloseAttempt: this.onChildCloseAttempt,
      onMouseDown: hoverMode ? this.handlePopupInteraction : undefined,
      onContextMenu: hoverMode ? this.handlePopupInteraction : undefined,
      dontCloseOnAnchorClick: true,
    };

    return (
      <div
        data-test={dataTests('ring-dropdown', dataTest)}
        {...restProps}
        onClick={clickMode ? this.onClick : undefined}
        // anchorElement should be a `button` or an `a`
        role="presentation"
        onMouseEnter={hoverMode ? this.onMouseEnter : undefined}
        onMouseLeave={hoverMode ? this.onMouseLeave : undefined}
        className={classes}
      >
        {anchorElement}
        {typeof children === 'function'
          ? children(childProps)
          : cloneElement(children as ReactElement<PopupAttrs>, childProps)}
      </div>
    );
  }
}

export type DropdownAttrs = React.JSX.LibraryManagedAttributes<typeof Dropdown, DropdownProps>;

export {Anchor};
