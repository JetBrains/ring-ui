import React, {PropTypes, Component, cloneElement} from 'react';
import classNames from 'classnames';

import styles from './dropdown.css';
import '../link/link.scss';

/**
 * @name Dropdown
 * @category Components
 * @framework React
 * @constructor
 * @description A stateful popup with clickable anchor
 * @example-file ./dropdown.examples.html
 */

export default class Dropdown extends Component {
  static propTypes = {
    anchor: PropTypes.node.isRequired,
    children: PropTypes.element.isRequired,
    initShown: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string
  };

  static defaultProps = {
    initShown: false
  }

  state = {show: this.props.initShown};

  toggle = flag => {
    const show = typeof flag === 'boolean' ? flag : !this.state.show;
    this.setState({show});
  };

  hide = () => this.toggle(false);

  render() {
    const {children, anchor, initShown, className, activeClassName, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    const classes = classNames(styles.dropdown, className, {
      [activeClassName]: this.state.show
    });

    const anchorElement = typeof anchor === 'string'
      // TODO: replace with text action in 3.0
      ? <span className="ring-link ring-link_pseudo">{anchor}</span>
      : anchor;

    return (
      <div
        {...restProps}
        data-test="ring-dropdown"
        onClick={this.toggle}
        className={classes}
      >
        {anchorElement}
        {cloneElement(children, {
          hidden: !this.state.show,
          onCloseAttempt: this.hide,
          dontCloseOnAnchorClick: true
        })}
      </div>
    );
  }
}

