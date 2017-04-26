import React, {PureComponent} from 'react';
import getEventKey from 'react-dom/lib/getEventKey';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Portal from '@hypnosphi/react-portal';

import {AdaptiveIsland} from '../island/island';

import ScrollPreventer from './dialog__body-scroll-preventer';
import styles from './dialog.css';

/**
 * @name Dialog
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description The Dialog component is a simple way to present content above an enclosing view.
 * @example-file ./dialog.examples.html
 */

export default class Dialog extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    show: PropTypes.bool.isRequired,
    onOverlayClick: PropTypes.func,
    onEscPress: PropTypes.func,
    // onCloseAttempt is a common callback for ESC pressing and overlay clicking.
    // Use it if you don't need different behaviors for this cases.
    onCloseAttempt: PropTypes.func
  };

  static defaultProps = {
    onOverlayClick: () => {},
    onEscPress: () => {},
    onCloseAttempt: () => {}
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick = event => {
    if (event.target !== this.dialog) {
      return;
    }
    this.props.onOverlayClick(event);
    this.props.onCloseAttempt(event);
  }

  handleKeyDown = event => {
    if (getEventKey(event) !== 'Escape' || !this.props.show) {
      return;
    }
    this.props.onEscPress(event);
    this.props.onCloseAttempt(event);
  }

  dialogRef = el => {
    this.dialog = el;
  }

  render() {
    // eslint-disable-next-line no-unused-vars, max-len
    const {show, onOverlayClick, onCloseAttempt, onEscPress, children, className, contentClassName, ...restProps} = this.props;
    const classes = classnames(styles.container, className);

    return (
      <Portal
        isOpen={show}
        onOpen={ScrollPreventer.prevent}
        onClose={ScrollPreventer.reset}
      >
        <div
          ref={this.dialogRef}
          className={classes}
          onClick={this.handleClick}
          {...restProps}
        >
          <AdaptiveIsland
            className={classnames(styles.content, contentClassName)}
            data-test="ring-dialog"
          >
            {children}
          </AdaptiveIsland>
        </div>
      </Portal>
    );
  }
}
