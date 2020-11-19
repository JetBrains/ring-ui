import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Badge from '@jetbrains/ring-ui/components/badge/badge';
import Link from '@jetbrains/ring-ui/components/link/link';

import Group from '@jetbrains/ring-ui/components/group/group';

export default {
  title: 'Components/Group',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Places inner components with fixed spacing between them.'
  }
};

export const basic = () => (
  <Group>
    <Badge valid>Badge</Badge>
    <span>Text</span>
    <Link>Link</Link>
  </Group>
);

basic.storyName = 'Group';
