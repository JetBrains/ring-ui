import '../input/input-legacy.css';
import './form.css';
import '../input-size/input-size.css';
import '../error-bubble/error-bubble-legacy.css';

export default {
  title: 'Style-only/Form',

  parameters: {
    notes: 'Helps create forms with various types of controls.',
  },
};

export const basic = () => (
  <div style={{width: 700}}>
    <form className="ring-form">
      <span className="ring-form__title">Form Title</span>

      <div className="ring-form__group">
        <label htmlFor="ring-form-1" className="ring-form__label">
          Full-Width Input
        </label>
        <div className="ring-form__control">
          <input className="ring-input" id="ring-form-1" type="text" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-2" className="ring-form__label">
          Medium Input
        </label>
        <div className="ring-form__control">
          <input className="ring-input ring-input-size_m" id="ring-form-2" type="text" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-3" className="ring-form__label">
          Medium Input & Error
        </label>
        <div className="ring-form__control">
          <input className="ring-input ring-input_error ring-input-size_m" id="ring-form-3" type="text" />
          <div className="ring-error-bubble active">Error bubble</div>
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-4" className="ring-form__label">
          Long Input
        </label>
        <div className="ring-form__control">
          <input className="ring-input ring-input-size_l" id="ring-form-4" type="text" />
          <div className="ring-error-bubble active">Error bubble for a long control</div>
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-5" className="ring-form__label">
          Full-Width Control
        </label>
        <div className="ring-form__control">
          <input className="ring-input" id="ring-form-5" type="text" />
          <div className="ring-error-bubble active">Error bubble for a full-width control</div>
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-7" className="ring-form__label">
          Textarea
        </label>
        <div className="ring-form__control">
          <textarea className="ring-input ring-input-size_m" id="ring-form-7" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-8" className="ring-form__label">
          Long Textarea
        </label>
        <div className="ring-form__control">
          <textarea className="ring-input ring-input-size_l" id="ring-form-8" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-9" className="ring-form__label">
          Full-Width Textarea
        </label>
        <div className="ring-form__control">
          <textarea className="ring-input" id="ring-form-9" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-11" className="ring-form__label">
          Input in a small container
        </label>
        <div className="ring-form__control ring-form__control_small">
          <input className="ring-input ring-input-size_m" id="ring-form-11" type="text" />
        </div>
      </div>

      <div className="ring-form__group">
        <label htmlFor="ring-form-12" className="ring-form__label">
          Textarea in a small container
        </label>
        <div className="ring-form__control ring-form__control_small">
          <textarea className="ring-input ring-input-size_m" id="ring-form-12" />
        </div>
      </div>

      <div className="ring-form__footer">
        <rg-button mode="primary">Save</rg-button> <rg-button>Cancel</rg-button>
      </div>
    </form>
  </div>
);

basic.storyName = 'Form';
