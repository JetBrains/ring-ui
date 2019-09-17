import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Badge from '../badge/badge';
import Link from '../link/link';

import Group from './group';

export default {
  title: 'Components|Group',
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

basic.story = {
  name: 'basic'
};
