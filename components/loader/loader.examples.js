import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from './loader';


storiesOf('Components|Loader', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class Example extends React.Component {
      render() {
        return (
          <Loader message="Loading..."/>
        );
      }
    }

    return <Example/>;
  });
