import MarkdownIt from 'markdown-it';
import highlightJs from 'highlight.js';

import ReadMe from '../README.md?raw';
import Contributing from '../CONTRIBUTING.md?raw';
import Changelog from '../CHANGELOG.md?raw';
import Markdown from './markdown/markdown';
import License from '../LICENSE.txt?raw';

import highlightStyles from './code/highlight.module.css';

const markdownIt = new MarkdownIt('commonmark', {
  html: false,
  highlight(str, lang) {
    if (lang && highlightJs.getLanguage(lang)) {
      return highlightJs.highlight(str, {language: lang}).value;
    }

    return '';
  },
}).enable('table');

export default {
  title: 'Ring UI/Welcome',

  parameters: {
    screenshots: {skip: true},
  },
};

export const gettingStarted = () => {
  const renderedMarkdown = markdownIt.render(ReadMe);
  return (
    <Markdown>
      <div className={highlightStyles.highlightContainer} dangerouslySetInnerHTML={{__html: renderedMarkdown}} />
    </Markdown>
  );
};
export const contributing = () => {
  const renderedMarkdown = markdownIt.render(Contributing);
  return (
    <Markdown>
      <div className={highlightStyles.highlightContainer} dangerouslySetInnerHTML={{__html: renderedMarkdown}} />
    </Markdown>
  );
};
export const changelog = () => {
  const renderedMarkdown = markdownIt.render(Changelog);
  return (
    <Markdown>
      <div className={highlightStyles.highlightContainer} dangerouslySetInnerHTML={{__html: renderedMarkdown}} />
    </Markdown>
  );
};
export const license = () => <pre>{License}</pre>;
