import React, {cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Anchor from './anchor';
import styles from './dropdown.css';

/**
 * @name Dropdown
 * @category Components
 * @framework React
 * @constructor
 * @description A stateful popup with a clickable anchor.
 * @example-file ./dropdown.examples.html
 */

export default class Dropdown extends Component {
  static propTypes = {
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
    onHide: PropTypes.func
  };

  static defaultProps = {
    initShown: false,
    clickMode: true,
    hoverMode: false,
    hoverShowTimeOut: 300,
    hoverHideTimeOut: 600,
    onShow: () => {},
    onHide: () => {}
  };

  state = {show: this.props.initShown};

  pinnedByClick = false;

  onClick = () => {
    const {show} = this.state;

    if (this.props.hoverMode) {
      if (!this.pinnedByClick) {
        this.pinnedByClick = true;

        if (show) {
          return;
        }
      } else {
        this.pinnedByClick = false;
      }
    }

    this._toggle(!show);
  };

  onChildCloseAttempt = () => {
    const {clickMode, hoverMode} = this.props;
    if (clickMode && hoverMode) {
      this.pinnedByClick = false;
    }

    this._toggle(false);
  };

  onMouseOver = () => {
    this._clearTimer();

    this.hoverTimer = setTimeout(() => {
      if (!this.state.show) {
        this._toggle(true);
      }
    }, this.props.hoverShowTimeOut);
  };

  onMouseOut = () => {
    if (this.pinnedByClick) {
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
      children, anchor, className, activeClassName, hoverMode, clickMode, ...restProps
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
        onClick={clickMode ? this.onClick : undefined}
        onMouseOver={hoverMode ? this.onMouseOver : undefined}
        onMouseOut={hoverMode ? this.onMouseOut : undefined}
        className={classes}
      >
        {anchorElement}
        {cloneElement(children, {
          hidden: !show,
          onCloseAttempt: this.onChildCloseAttempt,
          dontCloseOnAnchorClick: true,
          onMouseOver: hoverMode ? this.onMouseOver : undefined,
          onMouseOut: hoverMode ? this.onMouseOut : undefined
        })}
      </div>
    );
  }
}

export {Anchor};
