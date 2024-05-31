import React from 'react';

import {StoryObj} from '@storybook/react';

import Link from '../link/link';

import Breadcrumbs from './breadcrumbs';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs
};

type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: args => (
    <Breadcrumbs {...args} >
      <Link href="/">First Page</Link>
      <Link href="/">Second Page</Link>
      <Link href="/">Third Page</Link>
      <Link href="/" active>Current Page</Link>
    </Breadcrumbs>
  )
};
