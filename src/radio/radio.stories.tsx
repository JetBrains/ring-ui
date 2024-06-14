import React, {useState, Fragment} from 'react';


import {ControlLabel, LabelType} from '../control-label/control-label';

import Radio from './radio';

export default {
  title: 'Components/Radio',

  parameters: {
    notes:
      'Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc703afd36a8d65af24c'
  }
};

export const Basic = () => {
  const [value, onChange] = useState('one');
  return (
    <Fragment>
      <ControlLabel type={LabelType.FORM}>Group Description</ControlLabel>
      <Radio value={value} onChange={onChange}>
        <Radio.Item value="one" help="Help text">One</Radio.Item>
        <Radio.Item value="two">Two</Radio.Item>
        <Radio.Item value="three">Three</Radio.Item>
      </Radio>
    </Fragment>
  );
};

Basic.storyName = 'basic';

export const Multiline = () => {
  const [value, onChange] = useState('one');
  return (
    <div style={{width: 200}}>
      <ControlLabel>Group Description</ControlLabel>
      <Radio value={value} onChange={onChange}>
        <Radio.Item value="one">One</Radio.Item>
        <Radio.Item value="two">This is a multiline radio item that should wrap</Radio.Item>
      </Radio>
    </div>
  );
};

Multiline.storyName = 'multiline';

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
uncontrolled.parameters = {screenshots: {skip: true}};

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
