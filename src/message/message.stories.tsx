import searchIcon from '@jetbrains/icons/search';
import {type StoryFn} from '@storybook/react-webpack5';

import Popup from '../popup/popup';
import Icon from '../icon/icon';
import Theme from '../global/theme';
import Message, {type MessageAttrs} from './message';

const {Directions} = Popup.PopupProps;

export default {
  title: 'Components/Message',

  component: Message,
  args: {
    title: 'This is title',
    direction: Directions.TOP_RIGHT,
    children:
      'This is long long long long long long long long long long long long long long long long long long description',
  },
};

export const basic: StoryFn<MessageAttrs> = args => (
  <div style={{padding: 200}} id='message-example'>
    <span>
      Anchor
      <Message {...args} />
    </span>
  </div>
);

basic.storyName = 'basic';
basic.args = {
  tailOffset: 32,
  onClose: () => {},
};

export const light: StoryFn<MessageAttrs> = args => (
  <div style={{padding: 200}} id='message-example'>
    <span>
      Anchor
      <Message {...args} />
    </span>
  </div>
);
light.args = {
  theme: Theme.LIGHT,
  onClose: () => {},
  onDismiss: () => {},
};

export const withOnDissmiss: StoryFn<MessageAttrs> = args => (
  <div style={{padding: 200}} id='message-example'>
    <span>
      Anchor
      <Message {...args} />
    </span>
  </div>
);

withOnDissmiss.storyName = 'with onDissmiss';
withOnDissmiss.args = {
  tailOffset: 32,
  onClose: () => {},
  onDismiss: () => {},
};

export const wishNarrowAnchor: StoryFn<MessageAttrs> = args => (
  <div style={{padding: 200}}>
    <span>
      <Icon glyph={searchIcon} />
      <Message {...args} />
    </span>
  </div>
);

wishNarrowAnchor.storyName = 'with narrow anchor';
wishNarrowAnchor.args = {
  popupProps: {left: -8},
};
