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
function Message({translations, onCheckAgain}) {
  const {backendIsNotAvailable, checkAgain, errorMessage} = translations;

  return (
    <div data-test="ring-backend-down-notification">
      <Group>
        <div className={styles.title}>{backendIsNotAvailable}</div>
      </Group>
      <span className={styles.error}>{errorMessage} </span>
      <Link onClick={onCheckAgain} data-test="check-again">{checkAgain}</Link>
    </div>
  );
}

export default function onBackendDown({onCheckAgain, translations}) {
  async function checkAgainWithoutClosing(e) {
    // Alert has weird behaviour of handling clicks by "a" tags
    e.stopPropagation();
    try {
      renderAlert('Connecting...', Alert.Type.LOADING);
      await onCheckAgain();
    } catch (err) {
      renderAlert(
        <Message
          translations={translations}
          onCheckAgain={checkAgainWithoutClosing}
        />
      );
    }
  }

  renderAlert(
    <Message
      translations={translations}
      onCheckAgain={checkAgainWithoutClosing}
    />
  );

  return () => alertService.remove(key);
}
