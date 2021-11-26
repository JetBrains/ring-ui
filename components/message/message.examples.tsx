import React from 'react';
import searchIcon from '@jetbrains/icons/search';

import {Story} from '@storybook/react';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '../popup/popup';
import Icon from '../icon/icon';

import Message, {MessageAttrs} from './message';

const {Directions} = Popup.PopupProps;

export default {
  title: 'Components/Message',
  decorators: [reactDecorator()],

  parameters: {
    component: Message,
    framework: 'react'
  },
  args: {
    title: 'This is title',
    direction: Directions.TOP_RIGHT,
    children: 'This is long long long long long long long long long long long long long long long long long long description'
  },
  argTypes: {
    onClose: {},
    onDismiss: {}
  }
};

export const basic: Story<MessageAttrs> = args => (
  <div style={{padding: 200}} id="message-example">
    <span>
      Anchor
      <Message {...args}/>
    </span>
  </div>
);

basic.storyName = 'basic';
basic.args = {
  tailOffset: 32
};
basic.parameters = {
  actions: {argTypesRegex: '^onClose$'}
};

export const withOnDissmiss: Story<MessageAttrs> = args => (
  <div style={{padding: 200}} id="message-example">
    <span>
      Anchor
      <Message {...args}/>
    </span>
  </div>
);

withOnDissmiss.storyName = 'with onDissmiss';
withOnDissmiss.args = {
  tailOffset: 32
};

export const wishNarrowAnchor: Story<MessageAttrs> = args => (
  <div style={{padding: 200}}>
    <span>
      <Icon glyph={searchIcon}/>
      <Message {...args}/>
    </span>
  </div>
);

wishNarrowAnchor.storyName = 'with narrow anchor';
wishNarrowAnchor.args = {
  popupProps: {left: -8}
};
wishNarrowAnchor.parameters = {
  actions: {argTypesRegex: null}
};
