import {Component} from 'react';

import Button from '../button/button';
import AuthDialog from './auth-dialog';

// eslint-disable-next-line import/order
import youtrackLogo from '!file-loader!@jetbrains/logos/youtrack/youtrack.svg';

export default {
  title: 'Components/Auth Dialog',

  parameters: {
    notes: 'A component that shows an authentication dialog.',
    screenshots: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {context: '#storybook-root,*[data-test~=ring-dialog]'},
  },
};

interface AuthDialogArgs {
  onConfirm: () => void;
  onCancel: () => void;
}
export const authDialog = ({onConfirm, onCancel}: AuthDialogArgs) => {
  class AuthDialogDemo extends Component {
    state = {
      confirm: {
        show: true,
        onConfirm: () => {},
        onReject: () => {},
      },
    };

    componentDidMount() {
      this.showAuthDialog();
    }

    hideAuthDialog = () => {
      this.setState({confirm: {show: false}});
    };

    showAuthDialog = () =>
      new Promise<void>((resolve, reject) => {
        this.setState({
          confirm: {
            show: true,
            errorMessage: 'Authorization is required',
            serviceName: 'YouTrack',
            onConfirm: () => {
              this.hideAuthDialog();
              resolve();
            },
            onCancel: () => {
              this.hideAuthDialog();
              reject();
            },
          },
        });
      })
        .then(onConfirm)
        .catch(onCancel);

    render() {
      return (
        <div>
          <div>
            <Button onClick={this.showAuthDialog}>Show dialog</Button>
          </div>
          <AuthDialog
            {...this.state.confirm}
            serviceImage={youtrackLogo}
            confirmLabel='Log in'
            cancelLabel='Stay a guest'
          />
        </div>
      );
    }
  }

  return <AuthDialogDemo />;
};

authDialog.argTypes = {onConfirm: {}, onCancel: {}};
