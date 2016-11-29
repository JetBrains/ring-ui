import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Portal from 'react-portal';
import ScrollPreventer from './dialog__body-scroll-preventer';
import RingComponent from '../ring-component/ring-component';
import './dialog.scss';

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
    const classes = classNames('ring-dialog__wrapper', 'active', className);

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
          <div className="ring-dialog__container">
            {children}
          </div>
          <div
            className="ring-dialog__layer"
            onClick={this.props.onOutsideClick}
          />
        </div>
      </Portal>
    );
  }
}

export class DialogHeader extends RingComponent {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-dialog__header', className);

    return (
      <div
        className={classes}
        {...restProps}
      >
        <span className="ring-dialog__header__title">{children}</span>
      </div>
    );
  }
}

export class DialogBody extends RingComponent {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-dialog__content', className);

    return (
      <div
        className={classes}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

export class DialogFooter extends RingComponent {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-dialog__footer', className);

    return (
      <div
        className={classes}
        {...restProps}
      >
        <div className="ring-dialog__footer__spacer"></div>
        {children}
      </div>
    );
  }
}
