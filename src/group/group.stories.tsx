import Tag from '../tag/tag';
import Link from '../link/link';

import Group from './group';

export default {
  title: 'Components/Group',

  parameters: {
    notes: 'Places inner components with fixed spacing between them.',
  },
};

export const basic = () => (
  <Group>
    <Tag>Tag</Tag>
    <span>Text</span>
    <Link>Link</Link>
  </Group>
);

basic.storyName = 'Group';
