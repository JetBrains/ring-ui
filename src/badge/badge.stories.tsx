import Group from '../group/group';

import Badge from './badge';

export default {
  title: 'Components/Badge',

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
