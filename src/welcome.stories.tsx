import React from 'react';

import MarkdownIt from 'markdown-it';

import highlightJs from 'highlight.js';

import ReadMe from '../README.md';
import Contributing from '../CONTRIBUTING.md';
import Changelog from '../CHANGELOG.md';

import highlightStyles from './code/highlight.css';


import Markdown from './markdown/markdown';

import License from 'raw-loader!../LICENSE.txt';

const markdownIt = new MarkdownIt('commonmark', {
  html: false,
  highlight(str, lang) {
    if (lang && highlightJs.getLanguage(lang)) {
      return highlightJs.highlight(str, {language: lang}).value;
    }

    return '';
  }
}).enable('table');

export default {
  title: 'Ring UI/Welcome',

  parameters: {
    screenshots: {skip: true}
  }
};

export const gettingStarted = () => {
  const renderedMarkdown = markdownIt.render(ReadMe);
  return (
    <Markdown>
      <div
        className={highlightStyles.highlightContainer}
        dangerouslySetInnerHTML={{__html: renderedMarkdown}}
      />
    </Markdown>
  );
};
export const contributing = () => {
  const renderedMarkdown = markdownIt.render(Contributing);
  return (
    <Markdown>
      <div
        className={highlightStyles.highlightContainer}
        dangerouslySetInnerHTML={{__html: renderedMarkdown}}
      />
    </Markdown>
  );
};
export const changelog = () => {
  const renderedMarkdown = markdownIt.render(Changelog);
  return (
    <Markdown>
      <div
        className={highlightStyles.highlightContainer}
        dangerouslySetInnerHTML={{__html: renderedMarkdown}}
      />
    </Markdown>
  );
};
export const license = () => <pre>{License}</pre>;
