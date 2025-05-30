import {StoryFn} from '@storybook/react-webpack5';

import Loader, {LoaderProps} from './loader';

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
