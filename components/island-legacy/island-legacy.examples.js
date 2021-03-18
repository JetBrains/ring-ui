import '@jetbrains/ring-ui/components/island-legacy/island-legacy.css';

export default {
  title: 'Style-only/Island',

  parameters: {
    notes: 'Displays an island.'
  }
};

export const basic = () => `
    <div class="ring-island">
      <div class="ring-island__header">
        <span class="ring-island__title">Title</span>
      </div>
      <div class="ring-island__content">Content</div>
    </div>
    `;

basic.storyName = 'basic';

export const withAHeaderAndButtons = () => `
    <div class="ring-island">
      <div class="ring-island__header">
        <span class="ring-island__title">Title</span>
        <span class="ring-island__header-button">Button1</span>
        <span class="ring-island__header-button">Button2</span>
      </div>
      <div class="ring-island__content">Content</div>
    </div>
  `;

withAHeaderAndButtons.storyName = 'with a header and buttons';
