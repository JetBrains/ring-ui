import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import {CheckmarkIcon} from '../icon';

import TagsList from './tags-list';

export default {
  title: 'Components|Tags List',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a list of tags.'
  }
};

export const basic = () => (
  <TagsList
    className="test-additional-class"
    tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}
  />
);

basic.story = {
  name: 'basic'
};

export const withIcons = () => (
  <TagsList
    tags={[
      {key: 'test1', label: 'test1', rgTagIcon: CheckmarkIcon},
      {key: 'test2', label: 'test2'}
    ]}
  />
);

withIcons.story = {
  name: 'with icons'
};

export const disabled = () => (
  <TagsList disabled tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}/>
);

disabled.story = {
  name: 'disabled'
};
