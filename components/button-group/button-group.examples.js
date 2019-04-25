import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import ButtonGroup, {Caption} from '../button-group/button-group';


storiesOf('Components|Button Group', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <div>
      <p>
        <ButtonGroup>
          <Button>1st button</Button>
          <Button active>2nd button</Button>
          <Button disabled>3rd button</Button>
          <Button>4th button</Button>
          <Button short>...</Button>
        </ButtonGroup>
      </p>
      <p>
        <ButtonGroup>
          <Caption>Side:</Caption>
          <Button>Left</Button>
          <Button>Right</Button>
        </ButtonGroup>
      </p>
      <p>
        <ButtonGroup>
          <span><Button>1st button</Button></span>
          <span><Button>2nd button</Button></span>
          <Button>3rd button</Button>
        </ButtonGroup>
      </p>
    </div>
  ));
