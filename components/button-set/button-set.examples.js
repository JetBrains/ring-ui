import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import ButtonSet from '../button-set/button-set';

storiesOf('Components|Button Set', module).
  addParameters({
    notes: 'Allows to group several buttons and ensures that margins between them are consistent.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <ButtonSet>
      <Button>1st button</Button>
      <Button>2nd button</Button>
      <Button>3rd button</Button>
    </ButtonSet>
  ));
