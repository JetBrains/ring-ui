import React from 'react';
import {storiesOf} from '@storybook/html';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from './loader';

storiesOf('Components|Loader', module).
  addParameters({
    notes: 'Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.',
    hermione: {skip: true}
  }).
  addDecorator(reactDecorator()).
  addDecorator(withKnobs).
  add('basic', () => {
    class Example extends React.Component {
      render() {
        return (
          <Loader message="Loading..." stop={boolean('Stop animation', false)}/>
        );
      }
    }

    return <Example/>;
  });
