import React, {Fragment, useState} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Radio from './radio';

export default {
  title: 'Components/Radio',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).'
  }
};

function RadioExample() {
  const [value, onChange] = useState('one');
  return (
    <Fragment>
      Selected: {value}
      <Radio value={value} onChange={onChange}>
        <Radio.Item value="one">One</Radio.Item>
        <Radio.Item value="two">Two</Radio.Item>
        <Radio.Item value="three">Three</Radio.Item>
      </Radio>
    </Fragment>
  );
}

export const basic = () => <RadioExample/>;

basic.storyName = 'basic';

export const uncontrolled = () => (
  <Radio>
    <Radio.Item value="one" defaultChecked>
      One
    </Radio.Item>
    <Radio.Item value="two">Two</Radio.Item>
    <Radio.Item value="three">Three</Radio.Item>
  </Radio>
);

uncontrolled.storyName = 'uncontrolled';
uncontrolled.parameters = {hermione: {skip: true}};

export const disabled = () => (
  <Radio disabled>
    <Radio.Item value="one" defaultChecked>
      One
    </Radio.Item>
    <Radio.Item value="two">Two</Radio.Item>
    <Radio.Item value="three">Three</Radio.Item>
  </Radio>
);

disabled.storyName = 'disabled';
