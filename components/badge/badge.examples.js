import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Group from '../group/group';

import Badge from './badge';

storiesOf('Components|Badge', module).
  addParameters({
    notes: 'Displays a badge.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Group>
      <Badge>simple</Badge>
      <Badge gray>gray</Badge>
      <Badge valid>valid</Badge>
      <Badge invalid>invalid</Badge>
      <Badge disabled>disabled</Badge>
    </Group>
  ));
