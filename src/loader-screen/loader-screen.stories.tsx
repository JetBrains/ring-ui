import {Component} from 'react';

import LoaderScreen from './loader-screen';

export default {
  title: 'Components/Loader Screen',

  parameters: {
    notes:
      'Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.',
    screenshots: {skip: true},
  },
};

export const basic = () => {
  class Example extends Component {
    render() {
      return <LoaderScreen />;
    }
  }

  return <Example />;
};

basic.storyName = 'basic';

export const withMessage = () => {
  class Example extends Component {
    render() {
      return <LoaderScreen message={'Some message'} />;
    }
  }

  return <Example />;
};

withMessage.storyName = 'with message';
