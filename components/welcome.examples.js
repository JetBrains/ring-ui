import React from 'react';
import {render} from 'react-dom';

import {storiesOf} from '@storybook/html';

import ReadMe from '../README.md';
import Contributing from '../CONTRIBUTING.md';
import Changelog from '../CHANGELOG.md';
import Markdown from '../components/markdown/markdown';

storiesOf('Ring UI|Welcome', module).
  add('Getting Started', () => {
    const node = document.createElement('div');
    render(<Markdown source={ReadMe}/>, node);
    return node;
  }).
  add('Contributing', () => {
    const node = document.createElement('div');
    render(<Markdown source={Contributing}/>, node);
    return node;
  }).
  add('Changelog', () => {
    const node = document.createElement('div');
    render(<Markdown source={Changelog}/>, node);
    return node;
  });
