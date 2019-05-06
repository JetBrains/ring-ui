import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Code, {code} from '../code/code';

storiesOf('Components|Code', module).
  addParameters({
    notes: `
Displays a block of code. Syntax highlighting is available by default for the following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.

Highlighting of other languages is available as well:

\`import {highlight} from '@jetbrains/ring-ui/components/code/code'\`

\`import 1c from 'highlight.js/lib/languages/1c';\`

\`highlight.registerLanguage('1c', 1c);\`
    `
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
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
  )).
  add('tagged template', () => (
    code`
      import React from 'react';
      import {code} from '@jetbrains/ring-ui/components/code/code';

      const el = code\`some('js')\`;
    `
  ), {
    hermione: {skip: true}
  });
