import React from 'react';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';

import Auth from '../auth/auth';
import HTTP from '../http/http';
import Button from '../button/button';
import hubConfig from '../../.storybook/hub-config';

import showAuthDialog from './auth-dialog-service';


storiesOf('Services|Auth Dialog Service', module).
  addParameters({
    notes: 'A wrapper for the AuthDialog component. Allows showing the auth dialog without mounting the AuthDialog component first. Can be used outside React.',
    hermione: {skip: true}
  }).
  addDecorator(reactDecorator()).
  add('basic', () => {
    const auth = new Auth(hubConfig);
    const http = new HTTP(auth, auth.getAPIPath());

    class AuthDialogDemo extends React.Component {
      componentDidMount() {
        auth.init();
        http.get('services/0-0-0-0-0?fields=name,iconUrl').then(serviceDetails => {
          this.setState({serviceDetails});
          this.showAuthDialog();
        });
      }

      componentWillUnmount() {
        if (this.hideAuthDialog) {
          this.hideAuthDialog();
        }
      }

      showAuthDialog = () => {
        const {serviceDetails} = this.state;

        this.hideAuthDialog = showAuthDialog({
          serviceDetails,
          errorMessage: 'Error message',
          onConfirm: action('onConfirm'),
          onCancel: action('onCancel')
        });
      };

      render() {
        return (
          <div>
            <Button onClick={this.showAuthDialog}>Show auth dialog</Button>
          </div>
        );
      }
    }

    return <AuthDialogDemo/>;
  });
