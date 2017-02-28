import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import Portal from '@hypnosphi/react-portal';
import ScrollPreventer from './dialog__body-scroll-preventer';
import {AdaptiveIsland} from '../island/island';
import styles from './dialog.css';
import getEventKey from 'react-dom/lib/getEventKey';

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
          <AdaptiveIsland
            className={styles.content}
            data-test="ring-dialog"
          >
            {children}
          </AdaptiveIsland>
        </div>
      </Portal>
    );
  }
}
