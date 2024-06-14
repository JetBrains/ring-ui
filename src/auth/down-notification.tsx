import {ReactNode} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';

import alertService from '../alert-service/alert-service';
import Alert from '../alert/alert';
import Link from '../link/link';
import Group from '../group/group';

import styles from './down-notification.css';

let key: string | number | null = null;

function renderAlert(message: ReactNode, type = Alert.Type.WARNING) {
  const existingAlert = alertService.showingAlerts.filter(alert => alert.key === key)[0];

  if (!existingAlert) {
    key = alertService.addAlert(message, type, 0, {closeable: false});
  } else {
    existingAlert.message = message;
    existingAlert.type = type;
    alertService.renderAlerts();
  }
}

export interface BackendDownTranslations {
  backendIsNotAvailable: string
  checkAgain: string
  errorMessage: string
}
export interface BackendDownMessageProps {
  translations: BackendDownTranslations
  onCheckAgain: (e: React.MouseEvent) => void
}

function Message({translations, onCheckAgain}: BackendDownMessageProps) {
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
Message.propTypes = {
  translations: PropTypes.shape({
    backendIsNotAvailable: PropTypes.string,
    checkAgain: PropTypes.string,
    errorMessage: PropTypes.string
  }),
  onCheckAgain: PropTypes.func
};

export interface OnBackendDownParams {
  translations: BackendDownTranslations
  onCheckAgain: () => void
}

export default function onBackendDown({onCheckAgain, translations}: OnBackendDownParams) {
  async function checkAgainWithoutClosing(e: React.MouseEvent) {
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
