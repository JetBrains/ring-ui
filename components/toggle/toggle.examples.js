import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Toggle from './toggle';

export default {
  title: 'Components|Toggle',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a checkbox as an animated on/off toggle.'
  }
};

export const basic = () => (
  <div>
    <div>
      <Toggle>Unchecked by default</Toggle>
    </div>
    <div>
      <Toggle defaultChecked>Checked by default</Toggle>
    </div>
    <div>
      <Toggle disabled>Disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle disabled defaultChecked>Disabled checked</Toggle>
    </div>
    <div>
      <Toggle pale>Pale unchecked by default</Toggle>
    </div>
    <div>
      <Toggle pale defaultChecked>Pale checked by default</Toggle>
    </div>
    <div>
      <Toggle pale disabled>Pale disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle pale disabled defaultChecked>Pale disabled checked</Toggle>
    </div>
    <div>
      <Toggle leftLabel="With label on the left"/>
    </div>
  </div>
);

basic.story = {
  name: 'basic'
};
