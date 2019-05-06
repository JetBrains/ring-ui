import React from 'react';
import {render} from 'react-dom';

import getUID from '../global/get-uid';

import Alert, {ANIMATION_TIME, Container as AlertContainer} from '../alert/alert';

/**
 * @name Alert Service
 */

class AlertService {
  defaultTimeout = 0;
  // This alerts are stored in inverse order (last shown is first in array)
  showingAlerts = [];
  containerElement = document.createElement('div');

  _getShowingAlerts() {
    return [...this.showingAlerts];
  }

  renderAlertContainer(alerts) {
    if (alerts.length === 0) {
      return <span/>;
    }

    return (
      <AlertContainer>
        {alerts.map(alert => {
          const {message, key, ...rest} = alert;
          return (
            <Alert
              key={key}
              {...rest}
            >{message}</Alert>
          );
        })}
      </AlertContainer>
    );
  }

  /**
   * Renders alert container into virtual node to skip maintaining container
   */
  renderAlerts() {
    render(this.renderAlertContainer(this.showingAlerts), this.containerElement);
  }

  findSameAlert(message, type) {
    return this.showingAlerts.filter(it => it.type === type && it.message === message)[0];
  }

  startAlertClosing(alert) {
    alert.isClosing = true;
    this.renderAlerts();
  }

  remove(key) {
    const alertToClose = this.showingAlerts.filter(alert => alert.key === key)[0];
    if (!alertToClose) {
      return;
    }
    this.startAlertClosing(alertToClose);
  }

  removeWithoutAnimation(key) {
    this.showingAlerts = this.showingAlerts.filter(alert => alert.key !== key);
    this.renderAlerts();
  }

  stopShakingWhenAnimationDone(shakingAlert) {
    setTimeout(() => {
      shakingAlert.showWithAnimation = false;
      shakingAlert.isShaking = false;
      this.renderAlerts();
    }, ANIMATION_TIME);
  }

  addAlert(message, type, timeout = this.defaultTimeout, restOptions = {}) {
    const sameAlert = this.findSameAlert(message, type);
    if (sameAlert) {
      sameAlert.isShaking = true;
      this.renderAlerts();
      this.stopShakingWhenAnimationDone(sameAlert);
      return sameAlert.key;
    }

    const alert = {
      key: getUID('alert-service-'),
      message,
      type,
      timeout,
      isClosing: false,
      onCloseRequest: () => this.startAlertClosing(alert),
      onClose: () => this.removeWithoutAnimation(alert.key),
      ...restOptions
    };

    this.showingAlerts = [alert, ...this.showingAlerts];
    this.renderAlerts();
    return alert.key;
  }

  setDefaultTimeout(timeout) {
    this.defaultTimeout = timeout;
  }

  error(message, timeout) {
    return this.addAlert(message, Alert.Type.ERROR, timeout);
  }

  message(message, timeout) {
    return this.addAlert(message, Alert.Type.MESSAGE, timeout);
  }

  warning(message, timeout) {
    return this.addAlert(message, Alert.Type.WARNING, timeout);
  }

  successMessage(message, timeout) {
    return this.addAlert(message, Alert.Type.SUCCESS, timeout);
  }

  loadingMessage(message, timeout) {
    return this.addAlert(message, Alert.Type.LOADING, timeout);
  }
}

const alertService = new AlertService();
export default alertService;
