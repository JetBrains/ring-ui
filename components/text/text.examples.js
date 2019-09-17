import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Text from '../text/text';
import Group from '../group/group';

export default {
  title: 'Components|Text',
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

basic.story = {
  name: 'basic'
};
