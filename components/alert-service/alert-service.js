import React from 'react';
import {render} from 'react-dom';
import Alert, {Container as AlertContainer} from '../alert/alert';
import guid from 'mout/random/guid';

/**
 * @name Alert Service
 * @category Components
 * @description Service which incapsulates alerts stack management
 * @example-file ./alert-service.examples.html
 */

let defaultTimeout = 0;
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

function setDefaultTimeout(timeout) {
  defaultTimeout = timeout;
}

function showError(message, timeout = defaultTimeout) {
  return addAlert(message, Alert.Type.ERROR, timeout);
}

function showMessage(message, timeout = defaultTimeout) {
  return addAlert(message, Alert.Type.MESSAGE, timeout);
}

function showWarning(message, timeout = defaultTimeout) {
  return addAlert(message, Alert.Type.WARNING, timeout);
}

function showSuccessMessage(message, timeout = defaultTimeout) {
  return addAlert(message, Alert.Type.SUCCESS, timeout);
}

function showLoadingMessage(message, timeout = defaultTimeout) {
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
  setDefaultTimeout,

  getShowingAlerts
};
