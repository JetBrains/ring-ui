import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Group from '@jetbrains/ring-ui/components/group/group';

import Text from '@jetbrains/ring-ui/components/text/text';

export default {
  title: 'Components/Text',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for rendering text content.'
  }
};

export const basic = () => (
  <Group>
    <Text>Text</Text>
    <Text info>with an info message</Text>
  </Group>
);

basic.storyName = 'Text';
