import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/html';
import {withState} from 'recompose';

import reactDecorator from '../../.storybook/react-decorator';
import Radio from '../radio/radio';

storiesOf('Components|Radio', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
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
  }).
  add('uncontrolled', () => (
    <Radio>
      <Radio.Item value="one" defaultChecked>One</Radio.Item>
      <Radio.Item value="two">Two</Radio.Item>
      <Radio.Item value="three">Three</Radio.Item>
    </Radio>
  ), {hermione: {skip: true}}).
  add('disabled', () => (
    <Radio disabled>
      <Radio.Item value="one" defaultChecked>One</Radio.Item>
      <Radio.Item value="two">Two</Radio.Item>
      <Radio.Item value="three">Three</Radio.Item>
    </Radio>
  ));
