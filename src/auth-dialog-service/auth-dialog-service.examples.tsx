import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import hubConfig from '../../.storybook/hub-config';

import Auth from '../auth/auth';
import Button from '../button/button';

import showAuthDialog from './auth-dialog-service';

export default {
  title: 'Services/Auth Dialog Service',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'A wrapper for the AuthDialog component. Allows showing the auth dialog without mounting the AuthDialog component first. Can be used outside React.',
    hermione: {skip: true}
  }
};

interface AuthDialogServiceArgs {
  onConfirm: () => void
  onCancel: () => void
}

interface AuthDialogDemoState {
  serviceDetails: unknown
}
export const authDialogService = ({onConfirm, onCancel}: AuthDialogServiceArgs) => {
  const auth = new Auth(hubConfig);

  class AuthDialogDemo extends React.Component<{}, AuthDialogDemoState> {
    componentDidMount() {
      auth.init();
      this.showAuthDialog();
    }

    componentWillUnmount() {
      if (this.hideAuthDialog) {
        this.hideAuthDialog();
      }
    }

    hideAuthDialog?: () => void;
    showAuthDialog = () => {
      this.hideAuthDialog = showAuthDialog({
        errorMessage: 'Error message',
        onConfirm,
        onCancel
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
};

authDialogService.argTypes = {onConfirm: {}, onCancel: {}};
