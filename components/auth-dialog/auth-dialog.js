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
    tryAgainLabel: PropTypes.string,

    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onTryAgain: PropTypes.func
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

  state = {
    retrying: false
  };

  onEscPress = () => {
    if (this.props.cancelOnEsc) {
      this.props.onCancel();
    }
  };

  onRetryPress = async () => {
    this.setState({retrying: true});
    try {
      await this.props.onTryAgain();
    } catch (e) {
      // do nothing, error is handled in onTryAgain
    } finally {
      this.setState({retrying: false});
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
      tryAgainLabel,
      onConfirm,
      onCancel,
      onTryAgain
    } = this.props;

    const {retrying} = this.state;

    const defaultTitle = serviceName ? loginToCaption : loginCaption;
    const title = (this.props.title || defaultTitle).replace('%serviceName%', serviceName);

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
            {onTryAgain && (
              <Button
                className={styles.button}
                data-test="auth-dialog-retry-button"
                onClick={() => this.onRetryPress()}
                loader={retrying}
                disabled={retrying}
              >
                {tryAgainLabel}
              </Button>
            )}
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

