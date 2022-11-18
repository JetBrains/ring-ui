import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '../button/button';

import ButtonGroup, {Caption} from './button-group';

export default {
  title: 'Components/Button Group',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Allows to group several buttons.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc709f3bcaad55fd8530'
  }
};

export const buttonGroup = () => (
  <div className="container">
    <div>
      <ButtonGroup>
        <Button>1st button</Button>
        <Button active>2nd button</Button>
        <Button disabled>3rd button</Button>
        <Button disabled active>4th button</Button>
        <Button >5th button</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <Button>1st button</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <Button disabled>1st disabled</Button>
        <Button disabled active>2nd disabled</Button>
        <Button disabled>3rd disabled</Button>
      </ButtonGroup>
    </div>
    <div>
      <Caption>Side:</Caption>
      <ButtonGroup>
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
    <div>
      <ButtonGroup split>
        <Button>Split</Button>
        <Button short>...</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup split>
        <Button primary>Primary</Button>
        <Button primary short>...</Button>
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
