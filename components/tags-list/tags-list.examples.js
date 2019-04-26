import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import TagsList from '../tags-list/tags-list';
import {CheckmarkIcon} from '../icon';

storiesOf('Components|Tags List', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <TagsList
      className="test-additional-class"
      tags={[
        {key: 'test1', label: 'test1'},
        {key: 'test2', label: 'test2'}
      ]}
    />
  )).
  add('with icons', () => (
    <TagsList
      tags={[
        {key: 'test1', label: 'test1', rgTagIcon: CheckmarkIcon},
        {key: 'test2', label: 'test2'}
      ]}
    />
  )).
  add('disabled', () => (
    <TagsList
      disabled
      tags={[
        {key: 'test1', label: 'test1'},
        {key: 'test2', label: 'test2'}
      ]}
    />
  ));
