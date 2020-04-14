import React from 'react';
import {action} from '@storybook/addon-actions';
import {useState} from '@storybook/client-api';

import reactDecorator from '../../.storybook/react-decorator';

import {Header, Content} from '@jetbrains/ring-ui/components/island/island';
import Button from '@jetbrains/ring-ui/components/button/button';
import Input from '@jetbrains/ring-ui/components/input/input';
import Group from '@jetbrains/ring-ui/components/group/group';
import Toggle from '@jetbrains/ring-ui/components/toggle/toggle';
import Panel from '@jetbrains/ring-ui/components/panel/panel';

import Dialog from '@jetbrains/ring-ui/components/dialog/dialog';

export default {
  title: 'Components/Dialog',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'The Dialog component is a simple way to present content above an enclosing view.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {element: '#root,*[data-test~=ring-dialog]'}
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
        <div className="long-page">
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
                enableShortcuts
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
      height: 200vh;
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

export const withOverflowScrollOnHtml = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);

  return (
    <div className="container">
      <div>Scroll down</div>
      <Button className="button" onClick={() => setOpen(true)}>Show dialog</Button>
      <Dialog show={open} onCloseAttempt={() => setOpen(false)}>
        <Header>Dialog title</Header>
      </Dialog>
    </div>
  );
};
withOverflowScrollOnHtml.story = {
  parameters: {
    storyStyles: `
      <style>
        html {
          overflow-y: scroll;
        }

        html, body {
          height: 100%;
        }

        body {
          margin: 0;
        }

        .container {
          height: 200vh;
        }

        .button {
          margin-top: 100vh;
        }
      </style>
    `,
    hermione: {
      actions: [
        {type: 'click', selector: '.button'},
        {type: 'capture', selector: '*[data-test~=ring-dialog-container]'}
      ]
    }
  }
};
