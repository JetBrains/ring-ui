import React from 'react';

import {Story} from '@storybook/react';


import Loader, {LoaderProps} from './loader';

export default {
  title: 'Components/Loader',

  parameters: {
    component: Loader,
    framework: 'react',

    hermione: {skip: true}
  }
};

export const basic: Story<LoaderProps> = args => <Loader {...args}/>;

basic.storyName = 'Loader';
basic.args = {message: 'Loading...'};
