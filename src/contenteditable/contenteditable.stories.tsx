import ContentEditable from './contenteditable';

export default {
  title: 'Components/ContentEditable',

  parameters: {
    notes: 'Provides a ContentEditable component.'
  }
};

export const basic = () => (
  <div>
    <ContentEditable className="my-input" aria-label="My input">
      <span>
        text <b>bold text</b> text
      </span>
    </ContentEditable>
    <ContentEditable className="my-input" aria-label="My input" disabled>
      <span>
        text <b>bold text</b> text
      </span>
    </ContentEditable>
  </div>
);

basic.storyName = 'ContentEditable';

basic.parameters = {
  storyStyles: `
<style>
    .my-input {
      padding-left: 4px;
    }

    .my-input[disabled] {
      border: 1px solid var(--ring-border-disabled-color);
      background-color: var(--ring-disabled-background-color);
    }
</style>`
};
