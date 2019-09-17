import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Markdown, {md} from '../markdown/markdown';

export default {
  title: 'Components|Markdown',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Renders Markdown.'
  }
};

export const basic = () => (
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
);

basic.story = {
  name: 'basic'
};

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

    - List
    - List

    Ordered list:

    1. One
    2. Two

    Horizontal line

    ---

    Some \`inline(code)\` inside text

    ## Block code

    ~~~js
    import React from 'react';

    import { md } from '@jetbrains/ring-ui/components/markdown/markdown';

    const MarkdownHeader = ({ children }) =>
      md\`
    #\${children}
      \`;
    ~~~
  `;

taggedTemplate.story = {
  name: 'tagged template'
};
