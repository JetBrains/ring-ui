import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Code, {code} from './code';

export default {
  title: 'Components|Code',
  decorators: [reactDecorator()],

  parameters: {
    notes: `
Displays a block of code. Syntax highlighting is available by default for the following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.

Highlighting of other languages is available as well:

\`import {highlight} from '@jetbrains/ring-ui/components/code/code'\`

\`import 1c from 'highlight.js/lib/languages/1c';\`

\`highlight.registerLanguage('1c', 1c);\`
    `
  }
};

export const basic = () => (
  <Code
    code={`
          import React, {Component} from 'react';
          import ChildComponent from './child-component';

          const MyComponent = () => (
            <div className="class">
              <ChildComponent prop="value" />
            </div>
          );
        `}
  />
);

basic.story = {
  name: 'basic'
};

export const taggedTemplate = () =>
  code`
      import React from 'react';
      import {code} from '@jetbrains/ring-ui/components/code/code';

      const el = code\`some('js')\`;
    `;

taggedTemplate.story = {
  name: 'tagged template',

  parameters: {
    hermione: {skip: true}
  }
};
