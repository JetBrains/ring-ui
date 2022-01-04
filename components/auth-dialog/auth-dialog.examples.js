import React from 'react';

import youtrackLogo from '!file-loader!@jetbrains/logos/youtrack/youtrack.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import AuthDialog from '@jetbrains/ring-ui/components/auth-dialog/auth-dialog';

export default {
  title: 'Components/Auth Dialog',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component that shows an authentication dialog.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {element: '*[data-test~=ring-dialog]'}
  }
};

export const authDialog = ({onConfirm, onCancel}) => {
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
    };

    showAuthDialog = () =>
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
        then(onConfirm).
        catch(onCancel);

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

  return <AuthDialogDemo/>;
};

authDialog.argTypes = {onConfirm: {}, onCancel: {}};
