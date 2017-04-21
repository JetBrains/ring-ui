import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../icon/icon';
import Dialog from '../dialog/dialog';
import Button from '../button/button';

import styles from './auth-dialog.css';

/**
 * @name Auth Dialog
 * @category Components
 * @framework React
 * @constructor
 * @description A component to show authentification dialog
 * @example-file ./auth-dialog.examples.html
 */

export default class AuthDialog extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    error: PropTypes.string,
    serviceIcon: PropTypes.string,
    serviceImage: PropTypes.string,
    serviceName: PropTypes.string,

    show: PropTypes.bool,
    rejectOnEsc: PropTypes.bool,
    confirmLabel: PropTypes.string,
    rejectLabel: PropTypes.string,

    onConfirm: PropTypes.func,
    onReject: PropTypes.func
  };

  static defaultProps = {
    show: false,
    rejectOnEsc: true,
    cancelIsDefault: false,
    confirmLabel: 'Log in',
    rejectLabel: 'Remain a guest',
    onConfirm: () => {},
    onReject: () => {}
  }

  onEscPress = () => {
    if (this.props.rejectOnEsc) {
      this.props.onReject();
    }
  }

  render() {
    const {
      show,
      className,
      title,
      error,
      serviceIcon,
      serviceImage,
      serviceName,
      confirmLabel,
      rejectLabel,
      onConfirm,
      onReject
    } = this.props;

    const defaultTitle = serviceName ? 'Log in to %s' : 'Log in';

    return (
      <Dialog
        data-test="ring-auth-dialog"
        className={className}
        contentClassName={classnames(className, styles.dialog)}
        onEscPress={this.onEscPress}
        show={show}
      >
        <div className={styles.content}>
          {serviceIcon && (
            <Icon
              className={styles.logo}
              glyph={serviceIcon}
              size={Icon.Size.Size96}
            />
          )}
          {serviceImage && (
            <img
              className={styles.logo}
              src={serviceImage}
            />
          )}
          <div className={styles.title}>{(title || defaultTitle).replace('%s', serviceName)}</div>
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          <Button
            primary={true}
            className={styles.firstButton}
            data-test="auth-dialog-login-button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            className={styles.button}
            data-test="auth-dialog-cancel-button"
            onClick={onReject}
          >
            {rejectLabel}
          </Button>
        </div>
      </Dialog>
    );
  }
}

