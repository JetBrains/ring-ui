import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Content} from '../island/island';
import Dialog from '../dialog/dialog';
import Button from '../button/button';

import {H2} from '../heading/heading';

import styles from './auth-dialog.css';

/**
 * @name Auth Dialog
 */

export interface AuthDialogProps {
  className?: string | null | undefined
  title?: string | null | undefined
  errorMessage?: string | null | undefined
  serviceImage?: string | null | undefined
  serviceName?: string | null | undefined
  loginCaption: string
  loginToCaption: string
  show: boolean
  cancelOnEsc: boolean
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default class AuthDialog extends Component<AuthDialogProps> {
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
    const title = (this.props.title || defaultTitle).replace('%serviceName%', serviceName ?? '');

    return (
      <Dialog
        label={title}
        data-test="ring-auth-dialog"
        className={className}
        contentClassName={classNames(className, styles.dialog)}
        onEscPress={this.onEscPress}
        show={show}
        trapFocus
      >
        <Content>
          <div className={styles.content}>
            {serviceImage && (
              <img
                alt={`${serviceName} logo`}
                className={styles.logo}
                src={serviceImage}
              />
            )}
            <H2 className={styles.title}>{title}</H2>
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
        </Content>
      </Dialog>
    );
  }
}

