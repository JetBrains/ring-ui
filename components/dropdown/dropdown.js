import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Anchor from './anchor';
import styles from './dropdown.css';

/**
 * @name Dropdown
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @constructor
 * @description A stateful popup with a clickable anchor.
 * @example-file ./dropdown.examples.html
 */

export default class Dropdown extends Component {
  static propTypes = {
    anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.string]).isRequired,
    children: PropTypes.element.isRequired,
    initShown: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    hoverMode: PropTypes.bool,
    hoverShowTimeOut: PropTypes.number,
    hoverHideTimeOut: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func
  };

  static defaultProps = {
    initShown: false,
    hoverMode: false,
    hoverShowTimeOut: 300,
    hoverHideTimeOut: 600,
    onShow: () => {},
    onHide: () => {}
  };

  state = {show: this.props.initShown};

  hideByClick = false;

  onClick = () => {
    const {show} = this.state;

    if (this.props.hoverMode) {
      if (!this.hideByClick) {
        this.hideByClick = true;

        if (show) {
          return;
        }
      } else {
        this.hideByClick = false;
      }
    }

    this._toggle(!show);
  };

  onChildCloseAttempt = () => {
    this.hideByClick = false;
    this._toggle(false);
  };

  onMouseEnter = () => {
    this._clearTimer();

    this.hoverTimer = setTimeout(() => {
      if (!this.state.show) {
        this._toggle(true);
      }
    }, this.props.hoverShowTimeOut);
  };

  onMouseLeave = () => {
    if (this.hideByClick) {
      return;
    }

    this._clearTimer();

    this.hoverTimer = setTimeout(() => {
      if (this.state.show) {
        this._toggle(false);
      }
    }, this.props.hoverHideTimeOut);
  };

  _toggle(show) {
    this.setState({show}, () => (show ? this.props.onShow() : this.props.onHide()));
  }

  _clearTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  render() {
    const {show} = this.state;
    const {
      initShown, onShow, onHide, hoverShowTimeOut, hoverHideTimeOut, // eslint-disable-line no-unused-vars
      children, anchor, className, activeClassName, hoverMode, ...restProps
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
        anchorElement = anchor({active: show});
        break;

      default:
        anchorElement = anchor;
    }

    return (
      <div
        data-test="ring-dropdown"
        {...restProps}
        onClick={this.onClick}
        onMouseEnter={hoverMode ? this.onMouseEnter : undefined}
        onMouseLeave={hoverMode ? this.onMouseLeave : undefined}
        className={classes}
      >
        {anchorElement}
        {cloneElement(children, {
          hidden: !show,
          onCloseAttempt: this.onChildCloseAttempt,
          dontCloseOnAnchorClick: true,
          onMouseEnter: hoverMode ? this.onMouseEnter : undefined,
          onMouseLeave: hoverMode ? this.onMouseLeave : undefined
        })}
      </div>
    );
  }
}

export {Anchor};
