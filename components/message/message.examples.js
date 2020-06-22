import React from 'react';
import {action} from '@storybook/addon-actions';
import searchIcon from '@jetbrains/icons/search.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '@jetbrains/ring-ui/components/popup/popup';
import Icon from '@jetbrains/ring-ui/components/icon/icon';

import Message from '@jetbrains/ring-ui/components/message/message';

const {Directions} = Popup.PopupProps;

export default {
  title: 'Components/Message',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a popup containing a message.'
  }
};

export const basic = () => (
  <div style={{padding: 200}} id="message-example">
    <span>
      Anchor
      <Message
        title="This is title"
        onClose={action('got it')}
        direction={Directions.TOP_RIGHT}
        tailOffset={32}
      >
        This is long long long long long long long long long long long long long long long long long
        long description
      </Message>
    </span>
  </div>
);

basic.story = {
  name: 'basic'
};

export const withOnDissmiss = () => (
  <div style={{padding: 200}}>
    <span>
      Anchor
      <Message
        title="This is title"
        onClose={action('got it')}
        onDismiss={action('dismiss')}
        direction={Directions.TOP_RIGHT}
        tailOffset={32}
      >
        This is long long long long long long long long long long long long long long long long long
        long description
      </Message>
    </span>
  </div>
);

withOnDissmiss.story = {
  name: 'with onDissmiss'
};

export const wishNarrowAnchor = () => (
  <div style={{padding: 200}}>
    <span>
      <Icon glyph={searchIcon}/>
      <Message
        title="This is title"
        direction={Directions.TOP_RIGHT}
        popupProps={{left: -8}}
      >
        This is long long long long long long long long long long long long long long long long long
        long description
      </Message>
    </span>
  </div>
);

wishNarrowAnchor.story = {
  name: 'with narrow anchor'
};
