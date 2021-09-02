import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';
import ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group';

import ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';

export default {
  title: 'Components/Button Toolbar',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a toolbar with several buttons.'
  }
};

export const buttonToolbar = () => (
  <ButtonToolbar>
    <Button primary delayed>
      Run
    </Button>
    <ButtonGroup>
      <Button>Button one</Button>
      <Button>Button two</Button>
      <Button disabled>Button three</Button>
    </ButtonGroup>
    <Button>Another action</Button>
  </ButtonToolbar>
);
