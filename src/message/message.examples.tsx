import React from 'react';
import searchIcon from '@jetbrains/icons/search';

import {Story} from '@storybook/react';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '../popup/popup';
import Icon from '../icon/icon';

import Theme from '../global/theme';

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
  tailOffset: 32,
  onClose: () => {}
};

export const light: Story<MessageAttrs> = args => (
  <div style={{padding: 200}} id="message-example">
    <span>
      Anchor
      <Message {...args}/>
    </span>
  </div>
);
light.args = {
  theme: Theme.LIGHT,
  onClose: () => {},
  onDismiss: () => {}
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
  tailOffset: 32,
  onClose: () => {},
  onDismiss: () => {}
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
