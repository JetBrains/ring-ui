import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import ButtonGroup, {Caption} from '@jetbrains/ring-ui/components/button-group/button-group';

export default {
  title: 'Components/Button Group',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Allows to group several buttons.'
  }
};

export const buttonGroup = () => (
  <div className="container">
    <div>
      <ButtonGroup>
        <Button>1st button</Button>
        <Button active>2nd button</Button>
        <Button disabled>3rd button</Button>
        <Button>4th button</Button>
        <Button short>...</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <Caption>Side:</Caption>
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <span>
          <Button>1st button</Button>
        </span>
        <span>
          <Button>2nd button</Button>
        </span>
        <Button>3rd button</Button>
      </ButtonGroup>
    </div>
  </div>
);

buttonGroup.parameters = {
  storyStyles: `
    <style>
      .container > div {
        margin: 1em 0;
      }
    </style>
  `
};
