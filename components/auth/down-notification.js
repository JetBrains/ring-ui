import React from 'react';

import alertService from '../alert-service/alert-service';
import Alert from '../alert/alert';
import Link from '../link/link';
import Group from '../group/group';

import styles from './down-notification.css';

let key = null;

function renderAlert(message, type = Alert.Type.WARNING) {
  const existingAlert = alertService.showingAlerts.filter(alert => alert.key === key)[0];

  if (!existingAlert) {
    key = alertService.addAlert(message, type, 0, {closeable: false});
  } else {
    existingAlert.message = message;
    existingAlert.type = type;
    alertService.renderAlerts();
  }
}

// eslint-disable-next-line react/prop-types
function Message({backendError, translations, onCheckAgain}) {
  const {backendIsNotAvailable, checkAgain} = translations;

  const errorMessage = backendError.message ||
    (backendError.toString ? backendError.toString() : null);

  return (
    <div data-test="ring-backend-down-notification">
      <Group>
        <span className={styles.title}>{backendIsNotAvailable}</span>
        <Link onClick={onCheckAgain} data-test="check-again">{checkAgain}</Link>
      </Group>
      <div className={styles.error}>{errorMessage}</div>
    </div>
  );
}

export default function onBackendDown({backendError, onCheckAgain, translations}) {
  async function checkAgainWithoutClosing(e) {
    // Alert has weird behaviour of handling clicks by "a" tags
    e.stopPropagation();
    try {
      renderAlert('Connecting...', Alert.Type.LOADING);
      await onCheckAgain();
    } catch (err) {
      renderAlert(
        <Message
          backendError={err}
          translations={translations}
          onCheckAgain={checkAgainWithoutClosing}
        />
      );
    }
  }

  renderAlert(
    <Message
      backendError={backendError}
      translations={translations}
      onCheckAgain={checkAgainWithoutClosing}
    />
  );

  return () => alertService.remove(key);
}
