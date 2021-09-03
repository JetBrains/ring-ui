import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import confirm, {hideConfirm} from '@jetbrains/ring-ui/components/confirm-service/confirm-service';

export default {
  title: 'Services/Confirm Service',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      ' wrapper for the Confirm component. Allows showing the confirmation dialog * without mounting the Confirm component first. Can be used outside React.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {element: '*[data-test~=ring-dialog]'}
  }
};

interface ConfirmServiceArgs {
  onConfirm: () => void
  onCancel: () => void
}
export const confirmService = ({onConfirm, onCancel}: ConfirmServiceArgs) => {
  class ConfirmDemo extends React.Component {
    componentDidMount() {
      this.showConfirm();
    }

    componentWillUnmount() {
      hideConfirm();
    }

    showConfirm = () =>
      confirm({text: 'Do you really wish to proceed?'}).
        then(onConfirm).
        catch(onCancel);

    showWithAnotherText = () =>
      confirm({
        text: 'There is another confirmation',
        description: 'Confirmation description',
        confirmLabel: 'OK',
        rejectLabel: 'Cancel',
        cancelIsDefault: true,
        onBeforeConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))
      }).
        then(onConfirm).
        catch(onCancel);

    render() {
      return (
        <div>
          <Button onClick={this.showConfirm}>Show confirm</Button>
          <Button onClick={this.showWithAnotherText}>Show another message</Button>
        </div>
      );
    }
  }

  return <ConfirmDemo/>;
};

confirmService.argTypes = {onConfirm: {}, onCancel: {}};
