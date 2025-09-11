import {type StoryFn} from '@storybook/react-webpack5';

import Loader, {type LoaderProps} from './loader';

export default {
  title: 'Components/Loader',

  component: Loader,
  parameters: {
    screenshots: {skip: true},
  },
};

export const basic: StoryFn<LoaderProps> = args => <Loader {...args} />;

basic.storyName = 'Loader';
basic.args = {message: 'Loading...'};
