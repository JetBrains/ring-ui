import React from 'react';
import {storiesOf} from '@storybook/react';
import Alert from './alert';

storiesOf('Alert', module).add('with text', () => (
  <Alert>Hello Button</Alert>
)).add('danger', () => (
  <Alert type={Alert.Type.ERROR}>DANGER</Alert>
));
