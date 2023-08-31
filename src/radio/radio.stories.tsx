import React, {useState, Fragment} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Radio from './radio';

export default {
  title: 'Components/Radio',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc703afd36a8d65af24c'
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

function MultilineRadioExample() {
  const [value, onChange] = useState('one');
  return (
    <div style={{width: 200}}>
      Selected: {value}
      <Radio value={value} onChange={onChange}>
        <Radio.Item value="one">One</Radio.Item>
        <Radio.Item value="two">This is a multiline radio item that should wrap</Radio.Item>
      </Radio>
    </div>
  );
}

export const multiline = () => <MultilineRadioExample/>;

multiline.storyName = 'multiline';

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
