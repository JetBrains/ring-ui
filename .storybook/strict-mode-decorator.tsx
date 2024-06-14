
import {StrictMode} from 'react';
import {StoryFn} from '@storybook/react';

const strictModeDecorator = (Story: StoryFn) => (
  <StrictMode>
    <Story/>
  </StrictMode>
);

export default () => strictModeDecorator;
