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
      <div>Unchecked by default</div>
      <Toggle/>
    </div>
    <div>
      <div>Checked by default</div>
      <Toggle defaultChecked/>
    </div>
    <div>
      <div>Disabled unchecked</div>
      <Toggle disabled/>
    </div>
    <div>
      <div>Disabled checked</div>
      <Toggle disabled defaultChecked/>
    </div>
    <div>
      <div>Pale unchecked by default</div>
      <Toggle pale/>
    </div>
    <div>
      <div>Pale checked by default</div>
      <Toggle pale defaultChecked/>
    </div>
    <div>
      <div>Pale disabled unchecked</div>
      <Toggle pale disabled/>
    </div>
    <div>
      <div>Pale disabled checked</div>
      <Toggle pale disabled defaultChecked/>
    </div>
    <div>
      <div>With label</div>
      <Toggle>Label</Toggle>
    </div>
    <div>
      <div>With label on the left</div>
      <Toggle leftLabel="Label"/>
    </div>
  </div>
);

basic.story = {
  name: 'basic'
};
