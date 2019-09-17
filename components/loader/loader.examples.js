import React from 'react';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from './loader';

export default {
  title: 'Components|Loader',
  decorators: [reactDecorator(), withKnobs],

  parameters: {
    notes:
      'Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  class Example extends React.Component {
    render() {
      return <Loader message="Loading..." stop={boolean('Stop animation', false)}/>;
    }
  }

  return <Example/>;
};

basic.story = {
  name: 'basic'
};
