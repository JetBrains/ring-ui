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
    onShow: PropTypes.function,
    onHide: PropTypes.function
  };

  static defaultProps = {
    initShown: false,
    onShow: () => {},
    onHide: () => {}
  }

  state = {show: this.props.initShown};

  toggle = flag => {
    const show = typeof flag === 'boolean' ? flag : !this.state.show;
    this.setState({show}, () => (show ? this.props.onShow() : this.props.onHide()));
  };

  hide = () => this.toggle(false);

  render() {
    const {show} = this.state;
    const {children, anchor, initShown, className, activeClassName, ...restProps} = this.props; // eslint-disable-line no-unused-vars

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
        onClick={this.toggle}
        className={classes}
      >
        {anchorElement}
        {cloneElement(children, {
          hidden: !show,
          onCloseAttempt: this.hide,
          dontCloseOnAnchorClick: true
        })}
      </div>
    );
  }
}

export {Anchor};
