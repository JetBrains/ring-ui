import React from 'react';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import Confirm from '../confirm/confirm';

storiesOf('Components|Confirm', module).
  addParameters({
    notes: 'A component that shows a confirmation dialog.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'}
  }).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class ConfirmDemo extends React.Component {
      state = {
        confirm: {
          show: true,
          text: 'Do you really wish to proceed?',
          description: 'A description of an action that is about to take place.',
          inProgress: false,
          onConfirm: () => {},
          onReject: () => {}
        }
      };

      componentDidMount() {
        this.showConfirm();
      }

      hideConfirm = () => {
        this.setState({confirm: {show: false}});
      };

      showConfirm = () => new Promise((resolve, reject) => {
        this.setState({
          confirm: {
            show: true,
            text: 'Do you really wish to proceed?',
            description: 'A description of an action that is about to take place.',
            onConfirm: () => this.hideConfirm() || resolve(),
            onReject: () => this.hideConfirm() || reject()
          }
        });
      }).
        then(action('Confirmed')).
        catch(action('Rejected'));

      showWithAnotherText = () => new Promise((resolve, reject) => {
        this.setState({
          confirm: {
            show: true,
            text: 'There is another question',
            onConfirm: () => this.hideConfirm() || resolve(),
            onReject: () => this.hideConfirm() || reject()
          }
        });
      }).
        then(action('Confirmed')).
        catch(action('Rejected'));

      render() {
        return (
          <div>
            <Button onClick={this.showConfirm}>Show confirm</Button>
            <Button onClick={this.showWithAnotherText}>Show another message</Button>
            <Confirm
              show={this.state.confirm.show}
              text={this.state.confirm.text}
              description={this.state.confirm.description}
              inProgress={this.state.inProgress}
              confirmLabel="OK"
              rejectLabel="Cancel"
              onConfirm={this.state.confirm.onConfirm}
              onReject={this.state.confirm.onReject}
            />
          </div>
        );
      }
    }

    return <ConfirmDemo/>;
  });
