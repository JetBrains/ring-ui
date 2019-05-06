import React from 'react';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import reactDecorator from '../../.storybook/react-decorator';
import Message from '../message/message';
import Popup from '../popup/popup';

const {Directions} = Popup.PopupProps;

storiesOf('Components|Message', module).
  addParameters({
    notes: 'Displays a popup containing a message.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <div style={{padding: 200}} id="message-example">
      <span>
        Anchor
        <Message
          title="This is title"
          onClose={action('got it')}
          direction={Directions.TOP_RIGHT}
          tailOffset={32}
        >
          This is long long long long long long long long
          long long long long long long long long long long description
        </Message>
      </span>
    </div>
  )).
  add('with onDissmiss', () => (
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
          This is long long long long long long long long
          long long long long long long long long long long description
        </Message>
      </span>
    </div>
  ));
