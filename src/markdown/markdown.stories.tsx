import MarkdownIt from 'markdown-it';
import highlightJs from 'highlight.js';

import highlightStyles from '../code/highlight.css';

import Markdown from './markdown';

export default {
  title: 'Components/Markdown',

  parameters: {
    notes: `
Renders markdown.
Note: it is up to developer to pick the best option fore markdown rendering. We suggest using \`markdown-it\` or \`react-markdown\`.
Be careful with passing user input down to \`dangerouslySetInnerHTML\`!
  `,
  },
};

export const basic = () => {
  const markdownIt = new MarkdownIt('commonmark', {
    html: false,
    highlight(str, lang) {
      if (lang && highlightJs.getLanguage(lang)) {
        return highlightJs.highlight(str, {language: lang}).value;
      }

      return '';
    },
  }).enable('table');

  const renderedMarkdown = markdownIt.render(
    `
# Header

_Various_ types of **highlighting**

[Link](/)

[Link with definition][definition]

[definition]: /

> Blockquote
>
> Second line

Unordered list:

* List
* List

Ordered list:

1. One
2. Two

Horizontal line

| Some | Table |
| --- | --- |
| One | Two |

---
Some \`inline(code)\` inside text

## Block code
\`\`\`js
import React, {Component} from 'react';
import ChildComponent from './child-component';

const MyComponent = () => (
  <div>
    <ChildComponent/>
  </div>
);
\`\`\`
`,
  );

  return (
    <Markdown className={highlightStyles.highlightContainer}>
      {/* Be careful with passing user input down to `dangerouslySetInnerHTML`! */}
      <div dangerouslySetInnerHTML={{__html: renderedMarkdown}} />
    </Markdown>
  );
};

basic.storyName = 'basic';
