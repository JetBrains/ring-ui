import React, {Component} from 'react';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';

import alert from '@jetbrains/ring-ui/components/alert-service/alert-service';

import UserAgreement from '@jetbrains/ring-ui/components/user-agreement/user-agreement';
import UserAgreementService from '@jetbrains/ring-ui/components/user-agreement/service';
import text from '@jetbrains/ring-ui/components/user-agreement/toolbox.eula';

export default {
  title: 'Components/User Agreement',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component that displays a user agreement dialog.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {element: '*[data-test~=ring-dialog]'}
  }
};

export const dialog = () => (
  <div>
    <UserAgreement
      show
      text={text}
      onAccept={action('onAccept')}
      onDecline={action('onDecline')}
      onClose={action('onClose')}
    />
  </div>
);

dialog.story = {
  name: 'dialog'
};

export const service = () => {
  const fakeUserAgreement = {
    enabled: true,
    majorVersion: 1.0,
    text
  };

  const fakeUserConsent = {
    guest: true,
    accepted: false
  };

  const agreementService = new UserAgreementService({
    getUserAgreement: async () => {
      action('getUserAgreement')(fakeUserAgreement);
      return fakeUserAgreement;
    },
    getUserConsent: async () => {
      action('getUserConsent')(fakeUserConsent);
      return fakeUserConsent;
    },
    setUserConsent: action('User consent has been set'),
    onAccept: action('Agreement accepted'),
    onDecline: action('Agreement declined'),
    onDialogShow: action('Dialog shown'),
    onDialogHide: action('Dialog hidden'),
    interval: 10000
  });

  class UserAgreementServiceDemo extends Component {
    componentDidMount() {
      agreementService.startChecking();
    }

    componentWillUnmount() {
      agreementService.stopChecking();
      alert._getShowingAlerts().forEach(item => alert.removeWithoutAnimation(item.key));
    }

    render() {
      return null;
    }
  }

  return <UserAgreementServiceDemo/>;
};

service.story = {
  name: 'service',
  parameters: {hermione: {skip: true}, a11y: {element: '*[data-test="alert-container"]'}}
};
