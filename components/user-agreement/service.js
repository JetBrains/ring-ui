import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import Storage from '../storage/storage';
import alertService from '../alert-service/alert-service';
import Link from '../link/link';
import Alert from '../alert/alert';
import Group from '../group/group';

import UserAgreement from './user-agreement';

const GUEST_SESSION_KEY = 'end-user-agreement-consent';
const ONE_HOUR = 60 * 60 * 1000; // eslint-disable-line no-magic-numbers

const storageKey = 'userAgreementKey';
export const showMessage = 'userAgreementShow';
export const hideMessage = 'userAgreementHide';

const DEFAULT_CONSENT = {
  accepted: false,
  majorVersion: 0,
  minorVersion: 0
};

const DEFAULT_AGREEMENT = {
  enabled: false,
  majorVersion: 0,
  minorVersion: 0,
  requiredForREST: false,
  text: ''
};

export default class UserAgreementService {
  constructor(config = {}) {
    if (!config.getUserAgreement) {
      throw new Error('Please pass a "getUserAgreement" option to UserAgreementService');
    }

    if (!config.getUserConsent) {
      throw new Error('Please pass a "getUserConsent" option to UserAgreementService');
    }

    if (!config.setUserConsent) {
      throw new Error('Please pass a "setUserConsent" option to UserAgreementService');
    }

    this.config = config;
    this.interval = config.interval || this.interval;
  }

  _dialogPromise = null;
  _alertPromise = null;
  tabId = Math.random();
  interval = ONE_HOUR;
  container = document.createElement('div');
  storage = new Storage();
  checkingPromise = null;
  guest = false;

  userAgreement = DEFAULT_AGREEMENT;
  userConsent = DEFAULT_CONSENT;

  startChecking = () => {
    this.intervalId = setInterval(this.checkConsentAndShowDialog, this.interval);
    window.addEventListener('storage', this.onStorageEvent);
    this.checkConsentAndShowDialog();
  };

  stopChecking = () => {
    clearInterval(this.intervalId);
    window.removeEventListener('storage', this.onStorageEvent);
    this.hideDialog();
  };

  onStorageEvent = event => {
    if (event.key === storageKey) {
      const {tabId, command} = JSON.parse(event.newValue);

      if (tabId !== this.tabId) {
        if (command === showMessage) {
          this.checkConsentAndShowDialog(true);
        } else if (command === hideMessage) {
          this.hideDialogAndAlert(true);
        }
      }
    }
  };

  _notifyAboutShowing = () => {
    localStorage.setItem(storageKey, JSON.stringify({command: showMessage, tabId: this.tabId}));
  };

  _notifyAboutHiding = () => {
    localStorage.setItem(storageKey, JSON.stringify({command: hideMessage, tabId: this.tabId}));
  };

  getUserAgreement = async () => {
    this.userAgreement = await this.config.getUserAgreement() || DEFAULT_AGREEMENT;
    return this.userAgreement;
  };

  getUserConsent = async () => {
    const {guest, endUserAgreementConsent} = await this.config.getUserConsent();

    this.guest = guest;

    if (guest) {
      this.userConsent = await this.storage.get(GUEST_SESSION_KEY) || this.userConsent;
    } else {
      this.userConsent = endUserAgreementConsent || this.userConsent;
    }

    return this.userConsent;
  };

  checkConsentAndShowDialog = async withoutNotifications => {
    if (await this.checkConsent()) {
      return this.hideDialogAndAlert(withoutNotifications);
    } else {
      return this.showDialogOrAlert(withoutNotifications);
    }
  };

  checkConsent = async () => {
    if (!this.checkingPromise) {
      this.checkingPromise = Promise.all([
        this.getUserAgreement(),
        this.getUserConsent()
      ]);
    }

    const [userAgreement, userConsent] = await this.checkingPromise;
    this.checkingPromise = null;

    const {enabled, majorVersion: actualVersion} = userAgreement;
    const {accepted, majorVersion: acceptedVersion} = userConsent;

    return !enabled || (accepted && actualVersion === acceptedVersion);
  };

  showAlert = withoutNotifications => {
    if (this._alertPromise) {
      return this._alertPromise;
    }
    this._alertPromise = new Promise((resolve, reject) => {
      const {userAgreement, reviewNow, remindLater} = (this.config.translations || {});
      const onRemind = () => {
        this.hideDialogAndAlert(withoutNotifications);
        reject('Postponed');
      };

      const onReview = async () => {
        await this.showDialog(true, false, {onRemindLater: onRemind});
        this.hideAlert(withoutNotifications);
        resolve();
      };

      const message = (
        <Group>
          <span>{userAgreement || 'User Agreement'}</span>
          <Link onClick={onReview} data-test="review">{reviewNow || 'Review now'}</Link>
          <Link onClick={onRemind} data-test="later">{remindLater || 'Remind me later'}</Link>
        </Group>
      );
      this.alertKey = alertService.addAlert(message, Alert.Type.WARNING, 0, {closeable: false});
    });

    if (!withoutNotifications) {
      this._notifyAboutShowing();
    }

    return this._alertPromise;
  };

  hideAlert = withoutNotifications => {
    const {onRemindLater} = this.config;

    alertService.remove(this.alertKey);
    this.alertKey = null;
    this._alertPromise = null;

    if (onRemindLater) {
      onRemindLater();
    }

    if (!withoutNotifications) {
      this._notifyAboutHiding();
    }
  };

  showDialog = (withoutNotifications, preview = false, restOptions) => {
    const {translations, onDialogShow} = this.config;
    const {text} = this.userAgreement;
    const show = true;

    if (!this._dialogPromise) {
      this._dialogPromise = new Promise((resolve, reject) => {
        const onAccept = async () => {
          await this.onAccept();
          resolve();
        };

        const onDecline = async () => {
          await this.onDecline();
          reject();
        };

        const onClose = this.hideDialogAndAlert;

        const props = {
          text,
          show,
          onAccept,
          onDecline,
          onClose,
          translations,
          preview, ...restOptions
        };

        render(
          <UserAgreement {...props}/>,
          this.container
        );

        if (onDialogShow) {
          onDialogShow();
        }
      });

      if (!withoutNotifications) {
        this._notifyAboutShowing();
      }
    }

    return this._dialogPromise;
  };

  hideDialog = withoutNotifications => {
    const {onDialogHide} = this.config;

    unmountComponentAtNode(this.container);

    if (onDialogHide) {
      onDialogHide();
      this._dialogPromise = null;

      if (!withoutNotifications) {
        this._notifyAboutHiding();
      }
    }
  };

  showDialogOrAlert = (...args) => {
    if (this.guest && !this.userAgreement.requiredForREST) {
      return this.showAlert(...args);
    }
    return this.showDialog(...args);
  };

  hideDialogAndAlert = (...args) => {
    this.hideAlert(...args);
    this.hideDialog(...args);
  };

  onAccept = async () => {
    const {setUserConsent, onAccept} = this.config;

    if (this.guest) {
      const {majorVersion, minorVersion} = this.userAgreement;
      this.userConsent = {majorVersion, minorVersion, accepted: true};
      await this.storage.set(GUEST_SESSION_KEY, this.userConsent);
    } else {
      this.userConsent = await setUserConsent();
    }

    this.hideDialog();

    if (onAccept) {
      onAccept();
    }
  };

  onDecline = async () => {
    const {onDecline} = this.config;

    this.hideDialog();

    if (onDecline) {
      onDecline();
    }
  };
}
