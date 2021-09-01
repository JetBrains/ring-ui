import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Group from '@jetbrains/ring-ui/components/group/group';

import Badge from '@jetbrains/ring-ui/components/badge/badge';

export default {
  title: 'Components/Badge',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a badge.'
  }
};

export const badge = () => (
  <Group>
    <Badge>simple</Badge>
    <Badge gray>gray</Badge>
    <Badge valid>valid</Badge>
    <Badge invalid>invalid</Badge>
    <Badge disabled>disabled</Badge>
  </Group>
);
