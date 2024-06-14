import './island-legacy.css';

export default {
  title: 'Style-only/Island',

  parameters: {
    notes: 'Displays an island.'
  }
};

export const basic = () => (
  <div className="ring-island">
    <div className="ring-island__header">
      <span className="ring-island__title">Title</span>
    </div>
    <div className="ring-island__content">Content</div>
  </div>
);

basic.storyName = 'basic';

export const withAHeaderAndButtons = () => (
  <div className="ring-island">
    <div className="ring-island__header">
      <span className="ring-island__title">Title</span>
      <span className="ring-island__header-button">Button1</span>
      <span className="ring-island__header-button">Button2</span>
    </div>
    <div className="ring-island__content">Content</div>
  </div>
);

withAHeaderAndButtons.storyName = 'with a header and buttons';
