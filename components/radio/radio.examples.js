import React, {Fragment} from 'react';
import {withState} from 'recompose';

import reactDecorator from '../../.storybook/react-decorator';
import Radio from '../radio/radio';

export default {
  title: 'Components|Radio',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).'
  }
};

export const basic = () => {
  const RadioExample = withState('value', 'onChange', 'one')(props => (
    <Fragment>
      Selected: {props.value}
      <Radio {...props}>
        <Radio.Item value="one">One</Radio.Item>
        <Radio.Item value="two">Two</Radio.Item>
        <Radio.Item value="three">Three</Radio.Item>
      </Radio>
    </Fragment>
  ));

  return <RadioExample/>;
};

basic.story = {
  name: 'basic'
};

export const uncontrolled = () => (
  <Radio>
    <Radio.Item value="one" defaultChecked>
      One
    </Radio.Item>
    <Radio.Item value="two">Two</Radio.Item>
    <Radio.Item value="three">Three</Radio.Item>
  </Radio>
);

uncontrolled.story = {
  name: 'uncontrolled',
  parameters: {hermione: {skip: true}}
};

export const disabled = () => (
  <Radio disabled>
    <Radio.Item value="one" defaultChecked>
      One
    </Radio.Item>
    <Radio.Item value="two">Two</Radio.Item>
    <Radio.Item value="three">Three</Radio.Item>
  </Radio>
);

disabled.story = {
  name: 'disabled'
};
