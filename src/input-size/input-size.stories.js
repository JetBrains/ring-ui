import '../input/input-legacy.css';
import '../form/form.css';
import './input-size.css';
import '../error-bubble/error-bubble-legacy.css';

export default {
  title: 'Style-only/Input Sizes',
};

export const basic = () => (
  <div>
    <h3 className="example-block">Inputs</h3>
    <div className="example-block">
      <div className="ring-error-bubble-wrapper">
        <input id="extra-short-input" type="number" className="ring-input ring-input-size_xs" />
        <label htmlFor="extra-short-input" className="ring-error-bubble active">
          Extra-short Input
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <input id="short-input" type="number" className="ring-input ring-input-size_s" />
        <label htmlFor="short-input" className="ring-error-bubble active">
          Short Input
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <input id="medium-input" type="number" className="ring-input ring-input-size_m" />
        <label htmlFor="medium-input" className="ring-error-bubble active">
          Medium Input
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <input id="long-input" type="number" className="ring-input ring-input-size_l" />
        <label htmlFor="long-input" className="ring-error-bubble active">
          Long Input
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <input id="full-width-input" type="number" className="ring-input" />
        <label htmlFor="full-width-input" className="ring-error-bubble active">
          Full-width Input
        </label>
      </div>
    </div>

    <h3 className="example-block">Textareas</h3>
    <div className="example-block">
      <div className="ring-error-bubble-wrapper">
        <textarea id="extra-short-textarea" className="ring-input ring-input-size_xs" />
        <label htmlFor="extra-short-textarea" className="ring-error-bubble active">
          Extra-short Textarea
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <textarea id="short-textarea" className="ring-input ring-input-size_s" />
        <label htmlFor="short-textarea" className="ring-error-bubble active">
          Short Textarea
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <textarea id="medium-textarea" className="ring-input ring-input-size_m" />
        <label htmlFor="medium-textarea" className="ring-error-bubble active">
          Medium Textarea
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <textarea id="long-textarea" className="ring-input ring-input-size_l" />
        <label htmlFor="long-textarea" className="ring-error-bubble active">
          Long Textarea
        </label>
      </div>
      <div className="ring-error-bubble-wrapper">
        <textarea id="full-width-textarea" className="ring-input" />
        <label htmlFor="full-width-textarea" className="ring-error-bubble active">
          Full-width Textarea
        </label>
      </div>
    </div>
  </div>
);

basic.storyName = 'Input Sizes';

basic.parameters = {
  storyStyles: `
<style>
  .example-block {
    margin: 16px;
    max-width: 600px;
  }
</style>`,
};
