import {Component} from 'react';
import {type StoryFn} from '@storybook/react-webpack5';

import alert from '../alert-service/alert-service';
import UserAgreement, {type UserAgreementAttrs} from './user-agreement';
import UserAgreementService, {type Agreement, type Consent, type ConsentResponse} from './service';
import text from './toolbox.eula';

export default {
  title: 'Components/User Agreement',

  component: UserAgreement,
  parameters: {
    screenshots: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {context: '#storybook-root,*[data-test~=ring-dialog]'},
  },
};

export const dialog: StoryFn<UserAgreementAttrs> = args => (
  <div>
    <UserAgreement {...args} />
  </div>
);

dialog.args = {
  show: true,
  children: <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>,
  onRemindLater: null,
};
dialog.argTypes = {
  onRemindLater: {},
};
dialog.parameters = {
  actions: {argTypesRegex: '^on(?!RemindLater).*'},
};
dialog.storyName = 'dialog';

function noop() {}
interface ServiceArgs {
  onGetUserAgreement?: ((agreement: Agreement) => void) | undefined;
  onGetUserConsent?: ((response: ConsentResponse) => void) | undefined;
  onSetUserConsent?: ((consent: Consent) => void) | undefined;
  onAccept?: (() => void) | null | undefined;
  onDecline?: (() => void) | null | undefined;
  onDialogShow?: (() => void) | null | undefined;
  onDialogHide?: (() => void) | null | undefined;
}
export const service: StoryFn<ServiceArgs> = ({
  onGetUserAgreement = noop,
  onGetUserConsent = noop,
  onSetUserConsent = noop,
  onAccept,
  onDecline,
  onDialogShow,
  onDialogHide,
}) => {
  const fakeUserAgreement: Agreement = {
    enabled: true,
    majorVersion: 1.0,
    content: <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>,
  };

  const fakeUserConsent: Consent = {
    accepted: false,
  };

  const fakeUserConsentResponse: ConsentResponse = {
    guest: true,
    endUserAgreementConsent: fakeUserConsent,
  };

  const agreementService = new UserAgreementService({
    getUserAgreement: () => {
      onGetUserAgreement(fakeUserAgreement);
      return fakeUserAgreement;
    },
    getUserConsent: () => {
      onGetUserConsent(fakeUserConsentResponse);
      return fakeUserConsentResponse;
    },
    setUserConsent: () => {
      onSetUserConsent(fakeUserConsent);
      return fakeUserConsent;
    },
    onAccept,
    onDecline,
    onDialogShow,
    onDialogHide,
    interval: 10000,
  });

  class UserAgreementServiceDemo extends Component {
    componentDidMount() {
      agreementService.startChecking();
    }

    componentWillUnmount() {
      agreementService.stopChecking();
      // eslint-disable-next-line no-underscore-dangle
      alert._getShowingAlerts().forEach(item => alert.removeWithoutAnimation(item.key));
    }

    render() {
      return null;
    }
  }

  return <UserAgreementServiceDemo />;
};

service.argTypes = {
  onGetUserAgreement: {},
  onGetUserConsent: {},
  onSetUserConsent: {},
  onAccept: {},
  onDecline: {},
  onDialogShow: {},
  onDialogHide: {},
};
service.storyName = 'service';
service.parameters = {
  screenshots: {skip: true},
  a11y: {context: '#storybook-root,*[data-test="alert-container"]'},
};
