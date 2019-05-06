import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import ContentEditable from './contenteditable';

storiesOf('Components|ContentEditable', module).
  addParameters({
    notes: 'Provides a ContentEditable component.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <div>
      <ContentEditable className="my-input">
        <span>text <b>bold text</b> text</span>
      </ContentEditable>
      <ContentEditable className="my-input" disabled>
        <span>text <b>bold text</b> text</span>
      </ContentEditable>
    </div>
  ), {
    storyStyles: `
<style>
    .my-input {
      padding-left: 4px;
    }

    .my-input[disabled] {
      border: 1px solid var(--ring-border-disabled-color);
      background-color: var(--ring-disabled-color);
    }
</style>`
  });
