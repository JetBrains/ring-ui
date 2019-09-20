import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import Anchor from './anchor';
import styles from './dropdown.css';

/**
 * @name Dropdown
 */

export default class Dropdown extends Component {
  static propTypes = {
    /**
     * Can be string, React element, or a function accepting an object with {active, pinned} properties and returning a React element
     * React element should render some interactive HTML element like `button` or `a`
     */
    anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    children: PropTypes.element.isRequired,
    initShown: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    clickMode: PropTypes.bool,
    hoverMode: PropTypes.bool,
    hoverShowTimeOut: PropTypes.number,
    hoverHideTimeOut: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    'data-test': PropTypes.string
  };

  static defaultProps = {
    initShown: false,
    clickMode: true,
    hoverMode: false,
    hoverShowTimeOut: 300,
    hoverHideTimeOut: 600,
    onShow: () => {},
    onHide: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  };

  state = {
    show: this.props.initShown,
    pinned: false
  };

  onClick = () => {
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

  onMouseEnter = event => {
    this._clearTimer();
    this.props.onMouseEnter(event);

    this.hoverTimer = setTimeout(() => {
      if (!this.state.show) {
        this._toggle(true);
      }
    }, this.props.hoverShowTimeOut);
  };

  onMouseLeave = event => {
    this.props.onMouseLeave(event);
    if (this.state.pinned) {
      return;
    }

    this._clearTimer();

    this.hoverTimer = setTimeout(() => {
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

  _toggle(show, pinned = this.state.pinned) {
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
      initShown, onShow, onHide, hoverShowTimeOut, hoverHideTimeOut, // eslint-disable-line no-unused-vars
      children, anchor, className, activeClassName, hoverMode, clickMode, 'data-test': dataTest,
      ...restProps
    } = this.props;

    const classes = classNames(styles.dropdown, className, {
      [activeClassName]: activeClassName != null && show
    });

    let anchorElement;

    switch (typeof anchor) {
      case 'string':
        anchorElement = (<Anchor>{anchor}</Anchor>);
        break;
      case 'function':
        anchorElement = anchor({active: show, pinned});
        break;

      default:
        anchorElement = anchor;
    }

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
        {cloneElement(children, {
          hidden: !show,
          onCloseAttempt: this.onChildCloseAttempt,
          onMouseDown: hoverMode ? this.handlePopupInteraction : undefined,
          onContextMenu: hoverMode ? this.handlePopupInteraction : undefined,
          dontCloseOnAnchorClick: true
        })}
      </div>
    );
  }
}

export {Anchor};
