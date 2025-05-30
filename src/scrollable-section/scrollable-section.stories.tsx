import {StoryFn} from '@storybook/react-webpack5';
import {HTMLAttributes} from 'react';

import ScrollableSection from './scrollable-section';

export default {
  title: 'Components/Scrollable Section',
  component: ScrollableSection,
};

export const Default: StoryFn<HTMLAttributes<HTMLDivElement>> = () => (
  // should be focusable because it's scrollable and has no interactive content
  <ScrollableSection tabIndex={0} style={{height: 100, width: 200}}>
    <div style={{width: 300}}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </ScrollableSection>
);
