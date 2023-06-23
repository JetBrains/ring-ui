import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Group from '../group/group';

import Text from './text';

export default {
  title: 'Components/Text',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for rendering text content.'
  }
};

export const basic = () => (
  <div>
    <p>
      <Group>
        <Text>Text</Text>
        <Text info>with an info message</Text>
      </Group>
    </p>

    <p>
      <Group>
        <Text size={Text.Size.S}>Small text</Text>
        <Text size={Text.Size.S} info>with an info message</Text>
      </Group>
    </p>

    <p>
      <Group>
        <Text size={Text.Size.L}>Large text</Text>
        <Text size={Text.Size.L} info>with an info message</Text>
      </Group>
    </p>
  </div>
);

basic.storyName = 'Text';
