import {ReactNode} from 'react';

import {createRoot} from 'react-dom/client';

import Storage from '../storage/storage';
import alertService from '../alert-service/alert-service';
import Link from '../link/link';
import Alert from '../alert/alert';
import Group from '../group/group';

import {ControlsHeightContext, getGlobalControlsHeight} from '../global/controls-height';

import UserAgreement, {UserAgreementAttrs, UserAgreementTranslations} from './user-agreement';

const GUEST_SESSION_KEY = 'end-user-agreement-consent';
const ONE_HOUR = 60 * 60 * 1000; // eslint-disable-line @typescript-eslint/no-magic-numbers

const storageKey = 'userAgreementKey';
export const showMessage = 'userAgreementShow';
export const hideMessage = 'userAgreementHide';

export interface Consent {
  accepted?: boolean | null | undefined;
  majorVersion?: number | null | undefined;
  minorVersion?: number | null | undefined;
}
const DEFAULT_CONSENT: Consent = {
  accepted: false,
  majorVersion: 0,
  minorVersion: 0,
};

export interface ConsentResponse {
  guest?: boolean | null | undefined;
  endUserAgreementConsent?: Consent | null | undefined;
}

export interface Agreement {
  content: ReactNode;
  enabled?: boolean | null | undefined;
  majorVersion?: number | null | undefined;
  minorVersion?: number | null | undefined;
  requiredForREST?: boolean | null | undefined;
}
const DEFAULT_AGREEMENT: Agreement = {
  enabled: false,
  majorVersion: 0,
  minorVersion: 0,
  requiredForREST: false,
  content: '',
};

export interface UserAgreementServiceTranslations extends UserAgreementTranslations {
  reviewNow: string;
}

function ignorePostponedCatchReason(reason: unknown) {
  if (reason === 'Postponed') {
    return;
  }
  throw reason;
}

export interface UserAgreementServiceConfig {
  getUserAgreement: () => Promise<Agreement | null | undefined> | Agreement | null | undefined;
  getUserConsent: () => Promise<ConsentResponse> | ConsentResponse;
  setUserConsent: () => Promise<Consent> | Consent;
  interval?: number | null | undefined;
  translations?: UserAgreementServiceTranslations | undefined;
  onDialogShow?: (() => void) | null | undefined;
  onDialogHide?: (() => void) | null | undefined;
  onRemindLater?: (() => void) | null | undefined;
  onAccept?: (() => void) | null | undefined;
  onDecline?: (() => void) | null | undefined;
}
export default class UserAgreementService {
  config: UserAgreementServiceConfig;
  constructor(config: UserAgreementServiceConfig) {
    if (!config) {
      throw new Error('Please pass a config to UserAgreementService');
    }

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

  private _dialogPromise: Promise<unknown> | null = null;
  private _alertPromise: Promise<unknown> | null = null;
  tabId = Math.random();
  interval = ONE_HOUR;
  container = document.createElement('div');
  reactRoot = createRoot(this.container);
  storage = new Storage();
  checkingPromise: Promise<[Agreement, Consent]> | null = null;
  guest: boolean | null | undefined = false;

  userAgreement = DEFAULT_AGREEMENT;
  userConsent = DEFAULT_CONSENT;

  intervalId?: number;
  startChecking = () => {
    this.intervalId = window.setInterval(
      () => this.checkConsentAndShowDialog().catch(ignorePostponedCatchReason),
      this.interval,
    );

    window.addEventListener('storage', this.onStorageEvent);
    this.checkConsentAndShowDialog().catch(ignorePostponedCatchReason);
  };

  stopChecking = () => {
    clearInterval(this.intervalId);
    window.removeEventListener('storage', this.onStorageEvent);
    this.hideDialog();
  };

  onStorageEvent = (event: StorageEvent) => {
    if (event.key === storageKey && event.newValue != null) {
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

  private _notifyAboutShowing = () => {
    localStorage.setItem(storageKey, JSON.stringify({command: showMessage, tabId: this.tabId}));
  };

  private _notifyAboutHiding = () => {
    localStorage.setItem(storageKey, JSON.stringify({command: hideMessage, tabId: this.tabId}));
  };

  getUserAgreement = async () => {
    this.userAgreement = (await this.config.getUserAgreement()) || DEFAULT_AGREEMENT;
    return this.userAgreement;
  };

  getUserConsent = async () => {
    const {guest, endUserAgreementConsent} = await this.config.getUserConsent();

    this.guest = guest;

    if (guest) {
      this.userConsent = (await this.storage.get(GUEST_SESSION_KEY)) || this.userConsent;
    } else {
      this.userConsent = endUserAgreementConsent || this.userConsent;
    }

    return this.userConsent;
  };

  checkConsentAndShowDialog = async (withoutNotifications?: boolean) => {
    if (await this.checkConsent()) {
      return this.hideDialogAndAlert(withoutNotifications);
    } else {
      return this.showDialogOrAlert(withoutNotifications);
    }
  };

  checkConsent = async () => {
    if (!this.checkingPromise) {
      this.checkingPromise = Promise.all([this.getUserAgreement(), this.getUserConsent()]);
    }

    const [userAgreement, userConsent] = await this.checkingPromise;
    this.checkingPromise = null;

    const {enabled, majorVersion: actualVersion} = userAgreement;
    const {accepted, majorVersion: acceptedVersion} = userConsent;

    return !enabled || (accepted && actualVersion === acceptedVersion);
  };

  alertKey?: string | number | null;
  showAlert = (withoutNotifications?: boolean) => {
    if (this._alertPromise) {
      return this._alertPromise;
    }
    this._alertPromise = new Promise<void>((resolve, reject) => {
      const {userAgreement, reviewNow, remindLater} = this.config.translations || {};
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
          <Link onClick={onReview} data-test="review">
            {reviewNow || 'Review now'}
          </Link>
          <Link onClick={onRemind} data-test="later">
            {remindLater || 'Remind me later'}
          </Link>
        </Group>
      );
      this.alertKey = alertService.addAlert(message, Alert.Type.WARNING, 0, {closeable: false});
    });

    if (!withoutNotifications) {
      this._notifyAboutShowing();
    }

    return this._alertPromise;
  };

  hideAlert = (withoutNotifications?: boolean) => {
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

  showDialog = (withoutNotifications?: boolean, preview = false, restOptions?: Partial<UserAgreementAttrs>) => {
    const {translations, onDialogShow} = this.config;
    const {content} = this.userAgreement;
    const show = true;

    if (!this._dialogPromise) {
      this._dialogPromise = new Promise<void>((resolve, reject) => {
        const onAccept = async () => {
          await this.onAccept();
          resolve();
        };

        const onDecline = async () => {
          await this.onDecline();
          reject();
        };

        const onClose = this.hideDialogAndAlert;

        const props: UserAgreementAttrs = {
          children: content,
          show,
          onAccept,
          onDecline,
          onClose,
          translations,
          preview,
          ...restOptions,
        };

        this.reactRoot.render(
          <ControlsHeightContext.Provider value={getGlobalControlsHeight()}>
            <UserAgreement {...props} />
          </ControlsHeightContext.Provider>,
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

  hideDialog = (withoutNotifications?: boolean) => {
    const {onDialogHide} = this.config;

    this.reactRoot.render(null);

    if (onDialogHide) {
      onDialogHide();
      this._dialogPromise = null;

      if (!withoutNotifications) {
        this._notifyAboutHiding();
      }
    }
  };

  showDialogOrAlert = (
    withoutNotifications?: boolean,
    preview?: boolean,
    restOptions?: Partial<UserAgreementAttrs>,
  ) => {
    if (this.guest && !this.userAgreement.requiredForREST) {
      return this.showAlert(withoutNotifications);
    }
    return this.showDialog(withoutNotifications, preview, restOptions);
  };

  hideDialogAndAlert = (withoutNotifications?: boolean) => {
    this.hideAlert(withoutNotifications);
    this.hideDialog(withoutNotifications);
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

  onDecline = () => {
    const {onDecline} = this.config;

    this.hideDialog();

    if (onDecline) {
      onDecline();
    }
  };
}
