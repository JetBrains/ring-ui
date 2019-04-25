import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Badge from '../badge/badge';
import Link from '../link/link';

import Group from './group';

storiesOf('Components|Group', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Group>
      <Badge valid>Badge</Badge>
      <span>Text</span>
      <Link>Link</Link>
    </Group>
  ));
