import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import styles from './alert-service.examples.css';

import Button from '@jetbrains/ring-ui/components/button/button';
import ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';

import alert from '@jetbrains/ring-ui/components/alert-service/alert-service';

export default {
  title: 'Services/Alert Service',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Service for managing a stack of alerts.',
    hermione: {skip: true}
  }
};

export const alertService = () => {
  const MSG_TIMEOUT = 5000;
  const MSG_LONG_TIMEOUT = 30000;

  class AlertServiceDemo extends React.Component {
    componentDidMount() {
      setTimeout(() => {
        alert.message('A initial message', MSG_TIMEOUT);
        alert.error('Error message');
        this.showCustomMessage();
      });
    }

    componentWillUnmount() {
      alert._getShowingAlerts().forEach(item => alert.removeWithoutAnimation(item.key));
    }

    lastKey?: string | number;

    showCustomMessage = () => {
      this.lastKey = alert.addAlert(
        <div className={styles.customAlert}>
          <h1>Hello!</h1>
          <p>{'This is a custom message'}</p>
        </div>,
        undefined,
        0,
        {
          className: styles.customAlert,
          closeButtonClassName: styles.closeButton
        }
      );
    };

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
          <Button onClick={this.showCustomMessage}>
            Show custom message
          </Button>
          <Button onClick={this.showRandomWarning}>Show warning</Button>
          <Button onClick={this.removeLastAlert}>Remove last alert</Button>
        </ButtonToolbar>
      );
    }
  }

  return <AlertServiceDemo/>;
};
