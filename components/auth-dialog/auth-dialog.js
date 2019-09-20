import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Dialog from '../dialog/dialog';
import Button from '../button/button';

import styles from './auth-dialog.css';

/**
 * @name Auth Dialog
 */

export default class AuthDialog extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    errorMessage: PropTypes.string,
    serviceImage: PropTypes.string,
    serviceName: PropTypes.string,
    loginCaption: PropTypes.string,
    loginToCaption: PropTypes.string,

    show: PropTypes.bool,
    cancelOnEsc: PropTypes.bool,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,

    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    loginCaption: 'Log in',
    loginToCaption: 'Log in to %serviceName%',
    show: false,
    cancelOnEsc: true,
    confirmLabel: 'Log in',
    cancelLabel: 'Remain a guest',
    onConfirm: () => {},
    onCancel: () => {}
  };

  onEscPress = () => {
    if (this.props.cancelOnEsc) {
      this.props.onCancel();
    }
  };

  render() {
    const {
      show,
      className,
      errorMessage,
      serviceImage,
      serviceName,
      loginCaption,
      loginToCaption,
      confirmLabel,
      cancelLabel,
      onConfirm,
      onCancel
    } = this.props;

    const defaultTitle = serviceName ? loginToCaption : loginCaption;
    const title = (this.props.title || defaultTitle).replace('%serviceName%', serviceName);

    return (
      <Dialog
        data-test="ring-auth-dialog"
        className={className}
        contentClassName={classNames(className, styles.dialog)}
        onEscPress={this.onEscPress}
        show={show}
        trapFocus
      >
        <div className={styles.content}>
          {serviceImage && (
            <img
              alt={`${serviceName} logo`}
              className={styles.logo}
              src={serviceImage}
            />
          )}
          <div className={styles.title}>{title}</div>
          {errorMessage && (
            <div className={styles.error}>{errorMessage}</div>
          )}
          <Button
            primary
            className={styles.firstButton}
            data-test="auth-dialog-confirm-button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            className={styles.button}
            data-test="auth-dialog-cancel-button"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        </div>
      </Dialog>
    );
  }
}

