import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Portal from 'react-portal';
import ScrollPreventer from './dialog__body-scroll-preventer';
import RingComponent from '../ring-component/ring-component';
import styles from './dialog.css';
import getEventKey from 'react/lib/getEventKey';

/**
 * @name Dialog
 * @category Components
 * @framework React
 * @constructor
 * @description The Dialog component is a simple way to present content above an enclosing view.
 * @example-file ./dialog.examples.html
 */

export default class Dialog extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
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

  didMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  willUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick = event => {
    if (event.target !== this.refs.dialog) {
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

  render() {
    const {show, onOverlayClick, onCloseAttempt, onEscPress, children, className, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const classes = classNames(styles.container, className);

    return (
      <Portal
        isOpen={show}
        onOpen={() => ScrollPreventer.prevent()}
        onClose={() => ScrollPreventer.reset()}
      >
        <div
          ref="dialog"
          className={classes}
          onClick={this.handleClick}
          {...restProps}
        >
          <div
            className={styles.content}
            data-test="ring-dialog"
          >
            {children}
          </div>
        </div>
      </Portal>
    );
  }
}
