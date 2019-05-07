import React from 'react';

import {storiesOf} from '@storybook/html';

import packageInfo from '../package.json';
import ReadMe from '../README.md';
import Contributing from '../CONTRIBUTING.md';
import Changelog from '../CHANGELOG.md';
import Markdown from '../components/markdown/markdown';
import reactDecorator from '../.storybook/react-decorator';

import License from 'raw-loader!../LICENSE.txt';

storiesOf(`Ring UI [${packageInfo.version}]|Welcome`, module).
  addParameters({hermione: {skip: true}}).
  addDecorator(reactDecorator()).
  add('Getting Started', () => <Markdown source={ReadMe}/>).
  add('Contributing', () => <Markdown source={Contributing}/>).
  add('Changelog', () => <Markdown source={Changelog}/>).
  add('License', () => <pre>{License}</pre>);
