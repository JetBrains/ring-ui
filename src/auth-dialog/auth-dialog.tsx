import {Component} from 'react';
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
  className?: string | undefined
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
  tryAgainLabel: string
  onConfirm: () => void
  onCancel: () => void
  onTryAgain?: () => void
}

export default class AuthDialog extends Component<AuthDialogProps> {
  static defaultProps = {
    loginCaption: 'Log in',
    loginToCaption: 'Log in to %serviceName%',
    tryAgainLabel: 'Try again',
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

  componentDidMount() {
    window.addEventListener('online', this.onRetryPress);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.onRetryPress);
  }

  onEscPress = () => {
    if (this.props.cancelOnEsc) {
      this.props.onCancel();
    }
  };

  onRetryPress = async () => {
    if (!this.props.onTryAgain || this.state.retrying) {
      return;
    }
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
    const title = (this.props.title || defaultTitle).
      replace('%serviceName%', serviceName ?? '').
      replace('{{serviceName}}', serviceName ?? '');

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

