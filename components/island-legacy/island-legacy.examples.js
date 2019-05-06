import {storiesOf} from '@storybook/html';

import '../island-legacy/island-legacy.scss';

storiesOf('Style-only|Island', module).
  addParameters({
    notes: 'Displays an island.'
  }).
  add('basic', () => `
    <div class="ring-island">
      <div class="ring-island__header">
        <span class="ring-island__title">Title</span>
      </div>
      <div class="ring-island__content">Content</div>
    </div>
    `).
  add('with a header and buttons', () => `
    <div class="ring-island">
      <div class="ring-island__header">
        <span class="ring-island__title">Title</span>
        <span class="ring-island__header-button">Button1</span>
        <span class="ring-island__header-button">Button2</span>
      </div>
      <div class="ring-island__content">Content</div>
    </div>
  `);
