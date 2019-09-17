import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';

export default {
  title: 'Components|Button Toolbar',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a toolbar with several buttons.'
  }
};

export const basic = () => (
  <ButtonToolbar>
    <Button primary delayed>
      Run
    </Button>
    <ButtonGroup>
      <Button>Button one</Button>
      <Button>Button two</Button>
      <Button disabled="disabled">Button three</Button>
    </ButtonGroup>
    <Button>Another action</Button>
  </ButtonToolbar>
);

basic.story = {
  name: 'basic'
};
