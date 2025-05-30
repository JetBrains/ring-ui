import {Component} from 'react';

import Link from '../link/link';
import Button from '../button/button';

import {AlertItem} from '../alert-service/alert-service';

import Alert, {Container} from './alert';

export default {
  title: 'Components/Alert',

  component: Alert,
};

export const simple = () => {
  class AlertDemo extends Component {
    state = {
      show: true,
      isClosing: false,
    };

    onClose = () => {
      this.setState({show: false});
    };

    onCloseRequest = () => {
      this.setState({isClosing: true});
    };

    render() {
      const {show, isClosing} = this.state;
      if (!show) {
        return null;
      }

      return (
        <Alert
          type={Alert.Type.SUCCESS}
          onClose={this.onClose}
          showWithAnimation={false}
          onCloseRequest={this.onCloseRequest}
          isClosing={isClosing}
        >
          Sample alert <Link>with link</Link>
        </Alert>
      );
    }
  }

  return <AlertDemo />;
};

simple.storyName = 'simple';

interface AlertContainerState {
  alerts: Array<AlertItem>;
}
export const alertContainer = () => {
  class AlertContainerDemo extends Component<Record<string, never>, AlertContainerState> {
    state = {
      alerts: [
        {type: Alert.Type.ERROR, key: 0, message: 'Test error', isClosing: false},
        {type: Alert.Type.WARNING, key: 1, message: 'Test warning', isClosing: false},
        {type: Alert.Type.LOADING, key: 2, message: 'Test loading', isClosing: false},
        {type: Alert.Type.MESSAGE, key: 3, message: 'Test message', isClosing: false},
        {
          type: Alert.Type.MESSAGE,
          key: 4,
          message: (
            <span>
              Message <Link href="#">with link</Link>
            </span>
          ),
          isClosing: false,
        },
      ],
    };

    yetAnotherMessage = () => {
      this.setState(prevState => ({
        ...prevState,
        alerts: [
          {
            type: Alert.Type.MESSAGE,
            key: Date.now(),
            message: `Another message at ${new Date()}`,
          },
          ...prevState.alerts,
        ],
      }));
    };

    onCloseAlert = (closedAlert: AlertItem) => {
      this.setState(prevState => ({
        ...prevState,
        alerts: prevState.alerts.filter(alert => alert !== closedAlert),
      }));
    };

    onCloseAlertClick = (alert: AlertItem) => {
      const alertToClose = this.state.alerts.filter(it => alert.key === it.key)[0];
      alertToClose.isClosing = true;
      this.setState(prevState => ({
        ...prevState,
        alerts: [...prevState.alerts],
      }));
    };

    render() {
      return (
        <div>
          <Button onClick={this.yetAnotherMessage}>Create another message</Button>

          <Container>
            {this.state.alerts.map(alert => {
              const {message, key, ...rest} = alert;
              return (
                <Alert
                  key={key}
                  {...rest}
                  onCloseRequest={() => this.onCloseAlertClick(alert)}
                  onClose={() => this.onCloseAlert(alert)}
                >
                  {message}
                </Alert>
              );
            })}
          </Container>
        </div>
      );
    }
  }

  return <AlertContainerDemo />;
};

alertContainer.parameters = {
  screenshots: {
    captureSelector: '*[data-test="alert-container"]',
  },
  a11y: {context: '#storybook-root,*[data-test="alert-container"]'},
};
