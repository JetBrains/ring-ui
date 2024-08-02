import {ReactNode, Ref} from 'react';

import {createRoot} from 'react-dom/client';

import getUID from '../global/get-uid';

import Alert, {
  AlertProps,
  AlertType,
  ANIMATION_TIME,
  Container as AlertContainer
} from '../alert/alert';

export interface AlertItem extends Partial<Omit<AlertProps, 'children'>> {
  key: string | number,
  message: ReactNode
  ref?: Ref<Alert>
}

/**
 * @name Alert Service
 */

class AlertService {
  defaultTimeout = 0;
  // This alerts are stored in inverse order (last shown is first in array)
  showingAlerts: AlertItem[] = [];
  containerElement = document.createElement('div');
  reactRoot = createRoot(this.containerElement);

  _getShowingAlerts() {
    return [...this.showingAlerts];
  }

  renderAlertContainer(alerts: readonly AlertItem[]) {
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
    this.reactRoot.render(this.renderAlertContainer(this.showingAlerts));
  }

  findSameAlert(message: ReactNode, type: AlertType | undefined) {
    return this.showingAlerts.filter(it => it.type === type && it.message === message)[0];
  }

  startAlertClosing(alert: AlertItem) {
    alert.isClosing = true;
    this.renderAlerts();
  }

  remove(key: string | number | null | undefined) {
    const alertToClose = this.showingAlerts.filter(alert => alert.key === key)[0];
    if (!alertToClose) {
      return;
    }
    this.startAlertClosing(alertToClose);
  }

  removeWithoutAnimation(key: string | number) {
    this.showingAlerts = this.showingAlerts.filter(alert => alert.key !== key);
    this.renderAlerts();
  }

  stopShakingWhenAnimationDone(shakingAlert: AlertItem) {
    setTimeout(() => {
      shakingAlert.showWithAnimation = false;
      shakingAlert.isShaking = false;
      this.renderAlerts();
    }, ANIMATION_TIME);
  }

  addAlert(
    message: ReactNode,
    type?: AlertType | undefined,
    timeout: number = this.defaultTimeout,
    options: Partial<AlertItem> = {}
  ) {
    const {onCloseRequest, onClose, ...restOptions} = options;
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
      onCloseRequest: () => {
        onCloseRequest?.();
        this.startAlertClosing(alert);
      },
      onClose: () => {
        onClose?.();
        this.removeWithoutAnimation(alert.key);
      },
      ...restOptions
    };

    this.showingAlerts = [alert, ...this.showingAlerts];
    this.renderAlerts();
    return alert.key;
  }

  setDefaultTimeout(timeout: number) {
    this.defaultTimeout = timeout;
  }

  error(message: ReactNode, timeout?: number) {
    return this.addAlert(message, Alert.Type.ERROR, timeout);
  }

  message(message: ReactNode, timeout?: number) {
    return this.addAlert(message, Alert.Type.MESSAGE, timeout);
  }

  warning(message: ReactNode, timeout?: number) {
    return this.addAlert(message, Alert.Type.WARNING, timeout);
  }

  successMessage(message: ReactNode, timeout?: number) {
    return this.addAlert(message, Alert.Type.SUCCESS, timeout);
  }

  loadingMessage(message: ReactNode, timeout?: number) {
    return this.addAlert(message, Alert.Type.LOADING, timeout);
  }
}

const alertService = new AlertService();
export default alertService;
