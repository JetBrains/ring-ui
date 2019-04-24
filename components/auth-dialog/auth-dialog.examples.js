import React from 'react';
import {render} from 'react-dom';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import Button from '../button/button';

import youtrackLogo from '!file-loader!@jetbrains/logos/youtrack/youtrack.svg';

import AuthDialog from './auth-dialog';

storiesOf('Components|Auth Dialog', module).
  add('dialog', () => {
    class AuthDialogDemo extends React.Component {
      state = {
        confirm: {
          show: true,
          onConfirm: () => {},
          onReject: () => {}
        }
      };

      componentDidMount() {
        this.showAuthDialog();
      }

      hideAuthDialog = () => {
        this.setState({confirm: {show: false}});
      }

      showAuthDialog = () => (
        new Promise((resolve, reject) => {
          this.setState({
            confirm: {
              show: true,
              errorMessage: 'Authorization is required',
              serviceName: 'YouTrack',
              onConfirm: () => this.hideAuthDialog() || resolve(),
              onCancel: () => this.hideAuthDialog() || reject()
            }
          });
        }).
          then(action('confirm')).
          catch(action('cancel'))
      )

      render() {
        return (
          <div>
            <div>
              <Button onClick={this.showAuthDialog}>Show dialog</Button>
            </div>
            <AuthDialog
              {...this.state.confirm}
              serviceImage={youtrackLogo}
              confirmLabel="Log in"
              cancelLabel="Stay a guest"
            />
          </div>
        );
      }
    }

    const node = document.createElement('div');
    render(<AuthDialogDemo/>, node);
    return node;
  });
