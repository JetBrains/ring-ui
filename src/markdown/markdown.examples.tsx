import React from 'react';

import javascript from 'highlight.js/lib/languages/javascript';

import xml from 'highlight.js/lib/languages/xml';

import reactDecorator from '../../.storybook/react-decorator';

import {highlight} from '../code/code';

import Markdown, {md} from './markdown';

highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('xml', xml);

export default {
  title: 'Components/Markdown',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Renders Markdown.'
  }
};

export const basic = () => (
  <Markdown>{`
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
            <div className="class">
              <ChildComponent prop="value" />
            </div>
          );
          \`\`\`
        `}
  </Markdown>
);

basic.storyName = 'basic';

export const taggedTemplate = () =>
  md`
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

    ---
    Some \`inline(code)\` inside text

    ## Block code
    \`\`\`js
    import React from 'react';

    import {md} from '@jetbrains/ring-ui/components/markdown/markdown';

    const MarkdownHeader = ({children}) => md\`#\${children}\`;
    \`\`\`
  `;

taggedTemplate.storyName = 'tagged template';
