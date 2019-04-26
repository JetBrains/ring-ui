import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';
import alert from '../alert-service/alert-service';

import UserAgreement from './user-agreement';
import UserAgreementService from './service';
import text from './toolbox.eula';

storiesOf('Components|User Agreement', module).
  addDecorator(reactDecorator()).
  add('dialog', () => (
    <div>
      <UserAgreement
        show
        text={text}
        onAccept={action('onAccept')}
        onDecline={action('onDecline')}
        onClose={action('onClose')}
      />
    </div>
  )).
  add('service', () => {
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
        alert._getShowingAlerts().
          forEach(item => alert.removeWithoutAnimation(item.key));
      }

      render() {
        return null;
      }
    }

    return <UserAgreementServiceDemo/>;
  });
