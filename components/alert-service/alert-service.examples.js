import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import ButtonToolbar from '../button-toolbar/button-toolbar';

import alert from './alert-service';

export default {
  title: 'Services|Alert Service',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Service for managing a stack of alerts.',
    hermione: {skip: true}
  }
};

export const simple = () => {
  const MSG_TIMEOUT = 5000;
  const MSG_LONG_TIMEOUT = 30000;

  class AlertServiceDemo extends React.Component {
    componentDidMount() {
      setTimeout(() => {
        alert.message('A initial message', MSG_TIMEOUT);
        alert.error('Error message');
      });
    }

    componentWillUnmount() {
      alert._getShowingAlerts().forEach(item => alert.removeWithoutAnimation(item.key));
    }

    showError = () => {
      this.lastKey = alert.error('Something wrong happened');
    };

    showRandomWarning = () => {
      this.lastKey = alert.warning(
        `Warning! Something bad is going to happen (${Math.random()})`,
        MSG_LONG_TIMEOUT
      );
    };

    showMessage = () => {
      this.lastKey = alert.message('This is just a message', MSG_TIMEOUT);
    };

    removeLastAlert = () => {
      alert.remove(this.lastKey);
    };

    render() {
      return (
        <ButtonToolbar>
          <Button onClick={this.showError}>Show error</Button>
          <Button onClick={this.showMessage} primary>
            Show message
          </Button>
          <Button onClick={this.showRandomWarning}>Show warning</Button>
          <Button onClick={this.removeLastAlert}>Remove last alert</Button>
        </ButtonToolbar>
      );
    }
  }

  return <AlertServiceDemo/>;
};

simple.story = {
  name: 'simple'
};
