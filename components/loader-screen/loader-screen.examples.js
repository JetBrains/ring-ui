import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import LoaderScreen from './loader-screen';


storiesOf('Components|Loader Screen', module).
  addDecorator(reactDecorator()).
  add('Loader Screen', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderScreen/>
        );
      }
    }

    return <Example/>;
  }).
  add('Loader Screen with message', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderScreen message={'Some message'}/>
        );
      }
    }

    return <Example/>;
  });
