import React from 'react';
import {render} from 'react-dom';
import Alert from '../alert/alert';
import AlertContainer from '../alert-container/alert-container';
import guid from 'mout/random/guid';

/**
 * @name Alert Service
 * @constructor
 * @category Components
 * @description Service which incapsulates alerts stack management
 * @extends {RingComponent}
 * @example-file ./alert-service.examples.html
 */

let showingAlerts = [];
const containerElement = document.createElement('div');

function getShowingAlerts() {
  return [...showingAlerts];
}

/**
 * Renders alert container into virtual node to skip mantaining container
 */
function renderAlerts(alerts) {
  const renderAlertContainer = () => {
    if (alerts.length === 0) {
      return <span></span>;
    }

    return (
      <AlertContainer>
        {alerts.map(alert => {
          const {message, ...rest} = alert;
          return <Alert {...rest}>{message}</Alert>;
        })}
      </AlertContainer>
    );
  };

  render(renderAlertContainer(), containerElement);
}

function findSameAlert(message, type) {
  return showingAlerts.filter(it => it.type === type && it.message === message)[0];
}

function startAlertClosing(alert) {
  alert.isClosing = true;
  renderAlerts(showingAlerts);
}

function remove(key) {
  const alertToClose = showingAlerts.filter(alert => alert.key === key)[0];
  if (!alertToClose) {
    return;
  }
  startAlertClosing(alertToClose);
}

function removeWithoutAnimation(key) {
  showingAlerts = showingAlerts.filter(alert => alert.key !== key);
  renderAlerts(showingAlerts);
}

function addAlert(message, type, timeout) {
  const sameAlert = findSameAlert(message, type);
  if (sameAlert) {
    sameAlert.count++;
    renderAlerts(showingAlerts);
    return sameAlert.key;
  }

  const alert = {
    key: guid(),
    message,
    type,
    timeout,
    isClosing: false,
    onCloseRequest: () => startAlertClosing(alert),
    onClose: () => removeWithoutAnimation(alert.key),
    count: 1
  };

  showingAlerts.push(alert);
  renderAlerts(showingAlerts);
  return alert.key;
}

function showError(message, timeout = 0) {
  return addAlert(message, Alert.Type.ERROR, timeout);
}

function showMessage(message, timeout = 0) {
  return addAlert(message, Alert.Type.MESSAGE, timeout);
}

function showWarning(message, timeout = 0) {
  return addAlert(message, Alert.Type.WARNING, timeout);
}

function showSuccessMessage(message, timeout = 0) {
  return addAlert(message, Alert.Type.SUCCESS, timeout);
}

function showLoadingMessage(message, timeout = 0) {
  return addAlert(message, Alert.Type.LOADING, timeout);
}

export {
  showError,
  showMessage,
  showWarning,
  showSuccessMessage,
  showLoadingMessage,
  remove,
  removeWithoutAnimation,

  getShowingAlerts
};
