import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';

storiesOf('Components|Button Toolbar', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <ButtonToolbar>
      <Button primary delayed>Run</Button>
      <ButtonGroup>
        <Button>Button one</Button>
        <Button>Button two</Button>
        <Button disabled="disabled">Button three</Button>
      </ButtonGroup>
      <Button>Another action</Button>
    </ButtonToolbar>
  ));
