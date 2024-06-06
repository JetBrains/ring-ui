import React from 'react';
import {useState} from '@storybook/preview-api';
import type {StoryFn} from '@storybook/react';


import {Header, Content} from '../island/island';
import Button from '../button/button';
import Input from '../input/input';
import Group from '../group/group';
import Toggle from '../toggle/toggle';
import Panel from '../panel/panel';

import Dialog from './dialog';

export default {
  title: 'Components/Dialog',

  parameters: {
    notes: 'The Dialog component is a simple way to present content above an enclosing view.',
    screenshots: {captureSelector: '*[data-test~=ring-dialog]'},
    a11y: {element: '#storybook-root,*[data-test~=ring-dialog]'},
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc71d1f136a8dec29cee'
  }
};

interface Args {
  onAction(action: string): void
}

export const basic: StoryFn<Args> = ({onAction}) => {
  class DialogDemo extends React.Component {
    state = {
      show: true,
      text: '',
      autoFocusEnabled: true
    };

    doAction = () => {
      onAction(`${this.state.text} performed`);
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
            label="Dialog"
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

basic.storyName = 'basic';
basic.argTypes = {onAction: {}};

basic.parameters = {
  storyStyles: `
<style>
  .long-page {
    height: 200vh;
  }
</style>`
};

export const dense: StoryFn = () => (
  <Dialog show dense>
    <Header>Dialog title</Header>
    <Content>
      <Input label="Enter action name"/>
    </Content>
    <Panel>
      <Button primary>OK</Button>
      <Button>Cancel</Button>
    </Panel>
  </Dialog>
);

const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
Ipsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen
book. It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged.`;

export const withScroll: StoryFn<Args> = ({onAction}) => {
  class DialogDemo extends React.Component {
    state = {
      show: true
    };

    doAction = () => {
      onAction('action performed');
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
            label="Dialog"
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

withScroll.storyName = 'with scroll';
withScroll.argTypes = {onAction: {}};

export const WithOverflowScrollOnHtml = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container">
      <div>Scroll down</div>
      <Button className="button" onClick={() => setOpen(true)}>Show dialog</Button>
      <Dialog label="Dialog" show={open} onCloseAttempt={() => setOpen(false)}>
        <Header>Dialog title</Header>
      </Dialog>
    </div>
  );
};

WithOverflowScrollOnHtml.parameters = {
  storyStyles: `
    <style>
      html {
        overflow-y: scroll;
      }

      html, body {
        height: 100%;
      }

      body {
        margin: 0 !important;
      }

      .container {
        height: 200vh;
      }

      .button {
        margin-top: 100vh;
      }
    </style>
  `,
  screenshots: {
    actions: [
      {type: 'click', selector: '.button'},
      {type: 'capture', selector: '*[data-test~=ring-dialog-container]'}
    ]
  }
};
