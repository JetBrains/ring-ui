import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Code, {code} from '../code/code';

storiesOf('Components|Code', module).
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
  ));
