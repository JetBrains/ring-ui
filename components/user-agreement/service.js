import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import Storage from '../storage/storage';

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
  tabId = Math.random();
  interval = ONE_HOUR;
  container = document.createElement('div');
  storage = new Storage();
  checkingPromise = null;
  guest = false;

  userAgreement = {
    enabled: false,
    majorVersion: 0,
    minorVersion: 0,
    text: ''
  };

  userConsent = DEFAULT_CONSENT;

  startChecking = () => {
    this.intervalId = setInterval(this.checkConsentAndShowDialog, this.interval);
    window.addEventListener('storage', this.onStorageEvent);
    this.checkConsentAndShowDialog();
  }

  stopChecking = () => {
    clearInterval(this.intervalId);
    window.removeEventListener('storage', this.onStorageEvent);
    this.hideDialog();
  }

  onStorageEvent = event => {
    if (event.key === storageKey) {
      const {tabId, command} = JSON.parse(event.newValue);

      if (tabId !== this.tabId) {
        if (command === showMessage) {
          this.checkConsentAndShowDialog(true);
        } else if (command === hideMessage) {
          this.hideDialog(true);
        }
      }
    }
  }

  getUserAgreement = async () => {
    this.userAgreement = await this.config.getUserAgreement() || this.userAgreement;
    return this.userAgreement;
  }

  getUserConsent = async () => {
    const {guest, endUserAgreementConsent} = await this.config.getUserConsent();

    this.guest = guest;

    if (guest) {
      this.userConsent = await this.storage.get(GUEST_SESSION_KEY) || DEFAULT_CONSENT;
    } else {
      this.userConsent = endUserAgreementConsent || DEFAULT_CONSENT;
    }

    return this.userConsent;
  }

  checkConsentAndShowDialog = async withoutNotifications => {
    if (await this.checkConsent()) {
      return this.hideDialog(withoutNotifications);
    } else {
      return this.showDialog(withoutNotifications);
    }
  }

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
  }

  showDialog = (withoutNotifications, preview = false) => {
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

        const onClose = this.hideDialog;

        const props = {text, show, onAccept, onDecline, onClose, translations, preview};

        render(
          <UserAgreement {...props}/>,
          this.container
        );

        if (onDialogShow) {
          onDialogShow();
        }
      });

      if (!withoutNotifications) {
        localStorage.setItem(storageKey, JSON.stringify({command: showMessage, tabId: this.tabId}));
      }
    }

    return this._dialogPromise;
  }

  hideDialog = withoutNotifications => {
    const {onDialogHide} = this.config;

    unmountComponentAtNode(this.container);

    if (onDialogHide) {
      onDialogHide();
      this._dialogPromise = null;

      if (!withoutNotifications) {
        localStorage.setItem(storageKey, JSON.stringify({command: hideMessage, tabId: this.tabId}));
      }
    }
  }

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
