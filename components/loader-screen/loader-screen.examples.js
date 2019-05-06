import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import LoaderScreen from './loader-screen';


storiesOf('Components|Loader Screen', module).
  addParameters({
    notes: 'Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.',
    hermione: {skip: true}
  }).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderScreen/>
        );
      }
    }

    return <Example/>;
  }).
  add('with message', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderScreen message={'Some message'}/>
        );
      }
    }

    return <Example/>;
  });
