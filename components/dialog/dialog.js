import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Portal from 'react-portal';
import scrollbarWidth from 'scrollbar-width';
import RingComponent from '../ring-component/ring-component';
import './dialog.scss';

const BODY_MODAL_CLASS = 'ring-dialog-modal';

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
    children: PropTypes.element.isRequired,
    show: PropTypes.bool.isRequired,
    onOutsideClick: PropTypes.func
  };

  defaultProps = {
    onOutsideClick: () => {}
  }

  preventBodyScrolling() {
    document.body.classList.add(BODY_MODAL_CLASS);

    const scrollWidth = scrollbarWidth();
    const bodyHasScroll = document.body.scrollHeight > window.innerHeight;
    if (bodyHasScroll && scrollWidth > 0) {
      this.previousBodyWidth = document.body.style.width;
      document.body.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  }

  resetBodyScrollPrevention() {
    document.body.classList.remove(BODY_MODAL_CLASS);
    if (this.previousBodyWidth !== null) {
      document.body.style.width = this.previousBodyWidth;
      this.previousBodyWidth = null;
    }
  }

  render() {
    const {show, children, className, ...restProps} = this.props;
    const classes = classNames('ring-dialog__wrapper', 'active', className);

    return (
      <Portal
        closeOnEsc={true}
        isOpened={show}
        onOpen={() => this.preventBodyScrolling()}
        onClose={() => this.resetBodyScrollPrevention()}
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
