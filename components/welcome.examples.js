import React from 'react';

import ReadMe from '../README.md';
import Contributing from '../CONTRIBUTING.md';
import Changelog from '../CHANGELOG.md';

import reactDecorator from '../.storybook/react-decorator';

import Markdown from './markdown/markdown';

import License from 'raw-loader!../LICENSE.txt';

export default {
  title: 'Ring UI|Welcome',
  decorators: [reactDecorator()],

  parameters: {
    hermione: {skip: true}
  }
};

export const gettingStarted = () => <Markdown source={ReadMe}/>;
export const contributing = () => <Markdown source={Contributing}/>;
export const changelog = () => <Markdown source={Changelog}/>;
export const license = () => <pre>{License}</pre>;
