import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import Storage from '../storage/storage';

import UserAgreement from './user-agreement';

const GUEST_SESSION_KEY = 'end-user-agreement-consent';
const ONE_HOUR = 60 * 60 * 1000; // eslint-disable-line no-magic-numbers

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

  userConsent = {
    accepted: false,
    majorVersion: 0,
    minorVersion: 0
  };

  startChecking = () => {
    this.checkConsentAndShowDialog();
    this.intervalId = setInterval(this.checkConsentAndShowDialog, this.interval);
  }

  stopChecking = () => {
    clearInterval(this.intervalId);
    this.hideDialog();
  }

  getUserAgreement = async () => {
    this.userAgreement = await this.config.getUserAgreement() || this.userAgreement;
    return this.userAgreement;
  }

  getUserConsent = async () => {
    const {guest, endUserAgreementConsent} = await this.config.getUserConsent();

    this.guest = guest;

    if (guest) {
      this.userConsent = await this.storage.get(GUEST_SESSION_KEY) || this.userConsent;
    } else {
      this.userConsent = endUserAgreementConsent || this.userConsent;
    }

    return this.userConsent;
  }

  checkConsentAndShowDialog = async () => {
    const accepted = await this.checkConsent();
    if (!accepted) {
      this.showDialog();
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

  showDialog = () => {
    const {onAccept, onDecline} = this;
    const {translations, onDialogShow} = this.config;
    const {text} = this.userAgreement;
    const show = true;

    const props = {text, show, onAccept, onDecline, translations};

    render(
      <UserAgreement {...props}/>,
      this.container
    );

    if (onDialogShow) {
      onDialogShow();
    }
  }

  hideDialog = () => {
    const {onDialogHide} = this.config;

    unmountComponentAtNode(this.container);

    if (onDialogHide) {
      onDialogHide();
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
