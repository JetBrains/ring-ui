import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Markdown, {md} from '../markdown/markdown';

storiesOf('Components|Markdown', module).
  addParameters({
    notes: 'Renders Markdown.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Markdown
      source={`
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
          import React, {Component} from 'react';
          import ChildComponent from './child-component';

          const MyComponent = () => (
            <div className="class">
              <ChildComponent prop="value" />
            </div>
          );
          \`\`\`
        `}
    />
  )).
  add('tagged template', () => (
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
    `
  ));
