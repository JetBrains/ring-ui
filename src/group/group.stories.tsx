import Badge from '../badge/badge';
import Link from '../link/link';

import Group from './group';

export default {
  title: 'Components/Group',

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
