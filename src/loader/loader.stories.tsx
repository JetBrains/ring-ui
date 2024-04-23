import React from 'react';

import {StoryFn} from '@storybook/react';


import Loader, {LoaderProps} from './loader';

export default {
  title: 'Components/Loader',

  component: Loader,
  parameters: {
    hermione: {skip: true}
  }
};

export const basic: StoryFn<LoaderProps> = args => <Loader {...args}/>;

basic.storyName = 'Loader';
basic.args = {message: 'Loading...'};
