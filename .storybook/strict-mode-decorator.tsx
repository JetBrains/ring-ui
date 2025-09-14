import {type FunctionComponent, StrictMode} from 'react';

const strictModeDecorator = (Story: FunctionComponent) => (
  <StrictMode>
    <Story />
  </StrictMode>
);

export default () => strictModeDecorator;
