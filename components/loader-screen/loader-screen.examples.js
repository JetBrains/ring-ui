import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import LoaderScreen from './loader-screen';

export default {
  title: 'Components|Loader Screen',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  class Example extends React.Component {
    render() {
      return <LoaderScreen/>;
    }
  }

  return <Example/>;
};

basic.story = {
  name: 'basic'
};

export const withMessage = () => {
  class Example extends React.Component {
    render() {
      return <LoaderScreen message={'Some message'}/>;
    }
  }

  return <Example/>;
};

withMessage.story = {
  name: 'with message'
};
