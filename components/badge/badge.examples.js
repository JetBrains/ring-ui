import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Group from '../group/group';

import Badge from './badge';

export default {
  title: 'Components|Badge',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a badge.'
  }
};

export const basic = () => (
  <Group>
    <Badge>simple</Badge>
    <Badge gray>gray</Badge>
    <Badge valid>valid</Badge>
    <Badge invalid>invalid</Badge>
    <Badge disabled>disabled</Badge>
  </Group>
);

basic.story = {
  name: 'basic'
};
