import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Heading, {H1, H2, H3, H4} from '@jetbrains/ring-ui/components/heading/heading';

const lorem = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </div>
);

export default {
  title: 'Components/Heading',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for rendering h1-h5 tags.'
  }
};

export const basic = () => (
  <div>
    <Heading level={Heading.Levels.H1}>Heading 1</Heading>
    {lorem}
    <H1 caps>Heading 1 caps</H1>
    {lorem}
    <H2>Heading 2</H2>
    {lorem}
    <H3>Heading 3</H3>
    {lorem}
    <H4>Heading 4</H4>
    {lorem}
  </div>
);

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    h3 + div::after, 
    h4 + div::after {
      content: 'Heading';
      display: block;
      position: absolute;
      color: #DDD;
      z-index: -1;
    }
    
    h3 + div::before, 
    h4 + div::before {
      content: 'Lorem ipsum';
      display: block;
      position: absolute;
      color: #CCC;
      z-index: -1;
      transform: translateY(-100%);
    }
  </style>`
  }
};
