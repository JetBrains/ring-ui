import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';


import Code, {code, highlight} from './code';

highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('xml', xml);

export default {
  title: 'Components/Code',

  parameters: {
    notes: `
Displays a block of code. Syntax highlighting is loaded lazily using [dynamic imports](https://webpack.js.org/api/module-methods/#import-1).

You can also preload the languages you need:

\`import {highlight} from '../code/code'\`

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
            <div>
              <ChildComponent/>
            </div>
          );
        `}
  />
);

basic.storyName = 'basic';

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
      import {code} from '../code/code';

      const el = code\`some('js')\`;
    `;

taggedTemplate.storyName = 'tagged template';

taggedTemplate.parameters = {
  screenshots: {skip: true}
};
