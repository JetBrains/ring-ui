import React from 'react';
import searchIcon from '@jetbrains/icons/search';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '@jetbrains/ring-ui/components/popup/popup';
import Icon from '@jetbrains/ring-ui/components/icon/icon';

import Message from '@jetbrains/ring-ui/components/message/message';

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

export const basic = args => (
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
  onDismiss: null
};

export const withOnDissmiss = args => (
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

export const wishNarrowAnchor = args => (
  <div style={{padding: 200}}>
    <span>
      <Icon glyph={searchIcon}/>
      <Message {...args}/>
    </span>
  </div>
);

wishNarrowAnchor.storyName = 'with narrow anchor';
wishNarrowAnchor.args = {
  popupProps: {left: -8},
  onClose: null,
  onDismiss: null
};
