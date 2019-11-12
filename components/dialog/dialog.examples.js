import React from 'react';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';

import {Header, Content} from '../island/island';
import Button from '../button/button';
import Input from '../input/input';
import Group from '../group/group';
import Toggle from '../toggle/toggle';
import Panel from '../panel/panel';

import Dialog from './dialog';

export default {
  title: 'Components|Dialog',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'The Dialog component is a simple way to present content above an enclosing view.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'}
  }
};

export const basic = () => {
  class DialogDemo extends React.Component {
    state = {
      show: true,
      text: '',
      autoFocusEnabled: true
    };

    doAction = () => {
      action('doAction')(`${this.state.text} performed`);
      this.setState({show: false});
    };

    cancelDialog = () => {
      this.setState({show: false});
    };

    render() {
      const {show, text, autoFocusEnabled} = this.state;
      return (
        <div>
          <Group>
            <Button onClick={() => this.setState({show: true})}>Show dialog</Button>
            <Toggle
              checked={this.state.autoFocusEnabled}
              onChange={() => this.setState({autoFocusEnabled: !autoFocusEnabled})}
            >
              Autofocus
            </Toggle>
          </Group>

          <Dialog
            show={show}
            onCloseAttempt={this.cancelDialog}
            trapFocus
            autoFocusFirst={autoFocusEnabled}
            showCloseButton
          >
            <Header>Dialog title</Header>
            <Content>
              <Input
                label="Enter action name"
                value={text}
                onChange={e => this.setState({text: e.target.value})}
              />
            </Content>
            <Panel>
              <Button primary onClick={this.doAction}>
                OK
              </Button>
              <Button onClick={this.cancelDialog}>Cancel</Button>
            </Panel>
          </Dialog>
        </div>
      );
    }
  }
  return <DialogDemo/>;
};

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .long-page {
      height: 2000px;
    }
  </style>`
  }
};

const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
Ipsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen
book. It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged.`;

export const withScroll = () => {
  class DialogDemo extends React.Component {
    state = {
      show: true
    };

    doAction = () => {
      action('doAction')('action performed');
      this.setState({show: false});
    };

    cancelDialog = () => {
      this.setState({show: false});
    };

    render() {
      return (
        <div>
          <div>
            <Button onClick={() => this.setState({show: true})}>Show dialog</Button>
          </div>

          <Dialog
            show={this.state.show}
            onCloseAttempt={this.cancelDialog}
            trapFocus
            showCloseButton
          >
            <Header>Dialog title</Header>
            <Content>
              <div>
                <p>Dialog content (scrollable)</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
                <p>{lorem}</p>
              </div>
            </Content>
            <Panel>
              <Button primary onClick={this.doAction}>
                OK
              </Button>
              <Button onClick={this.cancelDialog}>Cancel</Button>
            </Panel>
          </Dialog>
        </div>
      );
    }
  }

  return <DialogDemo/>;
};

withScroll.story = {
  name: 'with scroll'
};
