import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Portal from 'react-portal';
import ScrollPreventer from './dialog__body-scroll-preventer';
import RingComponent from '../ring-component/ring-component';
import styles from './dialog.css';

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
    onOutsideClick: PropTypes.func
  };

  defaultProps = {
    onOutsideClick: () => {}
  }

  render() {
    const {show, children, className, ...restProps} = this.props;
    const classes = classNames(styles.container, className);

    return (
      <Portal
        closeOnEsc={true}
        isOpened={show}
        onOpen={() => ScrollPreventer.prevent()}
        onClose={() => ScrollPreventer.reset()}
        closeOnOutsideClick={true}
      >
        <div
          ref="dialog"
          className={classes}
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
