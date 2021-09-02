import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import ButtonSet from '@jetbrains/ring-ui/components/button-set/button-set';

export default {
  title: 'Components/Button Set',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Allows to group several buttons and ensures that margins between them are consistent.'
  }
};

export const buttonSet = () => (
  <ButtonSet>
    <Button>1st button</Button>
    <Button>2nd button</Button>
    <Button>3rd button</Button>
  </ButtonSet>
);
