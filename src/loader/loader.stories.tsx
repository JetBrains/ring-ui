import {type StoryFn, type StoryObj} from '@storybook/react-webpack5';

import Loader, {type LoaderProps} from './loader';

export default {
  title: 'Components/Loader',

  component: Loader,
};

export const basic: StoryFn<LoaderProps> = args => <Loader {...args} />;

basic.storyName = 'Loader';
basic.args = {message: 'Loading...'};
basic.parameters = {
  screenshots: {skip: true},
};

export const squares: StoryObj<LoaderProps> = {
  args: {message: 'Loading...', squares: true},
};
