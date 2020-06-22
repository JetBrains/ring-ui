import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Code, {code} from '@jetbrains/ring-ui/components/code/code';

export default {
  title: 'Components/Code',
  decorators: [reactDecorator()],

  parameters: {
    notes: `
Displays a block of code. Syntax highlighting is preloaded by default for the following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.

Highlighting of other languages is loaded lazily using [dynamic imports](https://webpack.js.org/api/module-methods/#import-1).

You can also preload the languages you need:

\`import {highlight} from '@jetbrains/ring-ui/components/code/code'\`

\`import 1c from 'highlight.js/lib/languages/1c';\`

\`highlight.registerLanguage('1c', 1c);\`

To opt out of preloading default set of languages and decrease your bundle size, add following to your plugins list in webpack config:
\`\`\`
new webpack.NormalModuleReplacementPlugin(/@jetbrains\\/ring-ui\\/components\\/code\\/highlight.js$/, './highlight-lazy.js')
\`\`\`
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

export const lazy = () => (
  <Code
    language="actionscript"
    code={`
      package org.example.dummy {
          import org.dummy.*;

          /*define package inline interface*/
          public interface IFooBarzable {
              public function foo(... pairs):Array;
          }

          public class FooBar implements IFooBarzable {
              static private var cnt:uint = 0;
              private var bar:String;

              //constructor
              public function TestBar(bar:String):void {
                  bar = bar;
                  ++cnt;
              }

              public function foo(... pairs):Array {
                  pairs.push(bar);
                  return pairs;
              }
          }
      }
    `}
  />
);

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
