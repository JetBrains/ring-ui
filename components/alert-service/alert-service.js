import React from 'react';
import {render} from 'react-dom';
import guid from 'mout/random/guid';

import Alert, {Container as AlertContainer} from '../alert/alert';

/**
 * @name Alert Service
 * @category Components
 * @description Service which incapsulates alerts stack management
 * @example-file ./alert-service.examples.html
 */

class AlertService {
  defaultTimeout = 0;
  showingAlerts = [];
  containerElement = document.createElement('div');

  _getShowingAlerts() {
    return [...this.showingAlerts];
  }

  renderAlertContainer(alerts) {
    if (alerts.length === 0) {
      return <span />;
    }

    return (
      <AlertContainer>
        {alerts.map(alert => {
          const {message, ...rest} = alert;
          return <Alert {...rest}>{message}</Alert>;
        })}
      </AlertContainer>
    );
  }

  /**
   * Renders alert container into virtual node to skip mantaining container
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

  addAlert(message, type, timeout = this.defaultTimeout) {
    const sameAlert = this.findSameAlert(message, type);
    if (sameAlert) {
      sameAlert.count++;
      this.renderAlerts();
      return sameAlert.key;
    }

    const alert = {
      key: guid(),
      message,
      type,
      timeout,
      isClosing: false,
      onCloseRequest: () => this.startAlertClosing(alert),
      onClose: () => this.removeWithoutAnimation(alert.key),
      count: 1
    };

    this.showingAlerts.push(alert);
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
