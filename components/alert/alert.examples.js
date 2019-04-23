/* eslint-disable react/no-multi-comp,react/jsx-no-literals,react/jsx-no-bind */
import React from 'react';
import {render} from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {storiesOf} from '@storybook/html';

import Link from '../link/link';
import Button from '../button/button';

import Alert, {Container} from './alert';


// eslint-disable-next-line no-undef
storiesOf('Alert', module).
  add('simple', () => {
    class AlertDemo extends React.Component {
      state = {
        show: true,
        isClosing: false
      };

      onClose = () => {
        this.setState({show: false});
      }

      onCloseRequest = () => {
        this.setState({isClosing: true});
      }

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

    const node = document.createElement('div');
    render(<AlertDemo/>, node);
    return node;
  }).
  add('Alert Container', () => {
    class AlertContainerDemo extends React.Component {
      state = {
        alerts: [
          {type: Alert.Type.ERROR, key: 0, message: 'Test error', isClosing: false},
          {type: Alert.Type.WARNING, key: 1, message: 'Test warning', isClosing: false},
          {type: Alert.Type.LOADING, key: 2, message: 'Test loading', isClosing: false},
          {type: Alert.Type.MESSAGE, key: 3, message: 'Test message', isClosing: false},
          {
            type: Alert.Type.MESSAGE,
            key: 4,
            message: <span>Message <Link href="#">with link</Link></span>,
            isClosing: false
          }
        ]
      };

      yetAnotherMessage = () => {
        this.setState(prevState => ({
          ...prevState,
          alerts: [
            {
              type: Alert.Type.MESSAGE,
              key: Date.now(),
              message: `Another message at ${new Date()}`
            },
            ...prevState.alerts
          ]
        }));
      }

      onCloseAlert = closedAlert => {
        this.setState(prevState => ({
          ...prevState,
          alerts: prevState.alerts.filter(alert => alert !== closedAlert)
        }));
      }

      onCloseAlertClick = alert => {
        const alertToClose = this.state.alerts.filter(it => alert.key === it.key)[0];
        alertToClose.isClosing = true;
        this.setState(prevState => ({
          ...prevState,
          alerts: [...prevState.alerts]
        }));
      }

      render() {
        return (
          <div>
            <Button onClick={this.yetAnotherMessage}>Create another message</Button>

            <Container>
              {this.state.alerts.map(alert => {
                const {message, ...rest} = alert;
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Alert
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

    const node = document.createElement('div');
    render(<AlertContainerDemo/>, node);
    return node;
  });
