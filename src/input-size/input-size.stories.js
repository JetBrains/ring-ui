import '../input/input-legacy.css';
import '../form/form.css';
import './input-size.css';
import '../error-bubble/error-bubble-legacy.css';

export default {
  title: 'Style-only/Input Sizes'
};

export const basic = () => `
      <div>
        <h3 class="example-block">Inputs</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <input id="extra-short-input" type="number" class="ring-input ring-input-size_xs">
            <label for="extra-short-input" class="ring-error-bubble active">Extra-short Input</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input id="short-input" type="number" class="ring-input ring-input-size_s">
            <label for="short-input" class="ring-error-bubble active">Short Input</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input id="medium-input" type="number" class="ring-input ring-input-size_m">
            <label for="medium-input" class="ring-error-bubble active">Medium Input</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input id="long-input" type="number" class="ring-input ring-input-size_l">
            <label for="long-input" class="ring-error-bubble active">Long Input</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input id="full-width-input" type="number" class="ring-input">
            <label for="full-width-input" class="ring-error-bubble active">Full-width Input</label>
          </div>
        </div>

        <h3 class="example-block">Textareas</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <textarea id="extra-short-textarea" class="ring-input ring-input-size_xs"></textarea>
            <label for="extra-short-textarea" class="ring-error-bubble active">Extra-short Textarea</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea id="short-textarea" class="ring-input ring-input-size_s"></textarea>
            <label for="short-textarea" class="ring-error-bubble active">Short Textarea</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea id="medium-textarea" class="ring-input ring-input-size_m"></textarea>
            <label for="medium-textarea" class="ring-error-bubble active">Medium Textarea</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea id="long-textarea" class="ring-input ring-input-size_l"></textarea>
            <label for="long-textarea" class="ring-error-bubble active">Long Textarea</label>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea id="full-width-textarea" class="ring-input"></textarea>
            <label for="full-width-textarea" class="ring-error-bubble active">Full-width Textarea</label>
          </div>
        </div>
      </div>
    `;

basic.storyName = 'Input Sizes';

basic.parameters = {
  storyStyles: `
<style>
  .example-block {
    margin: 16px;
    max-width: 600px;
  }
</style>`
};
