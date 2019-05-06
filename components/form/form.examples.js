import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import '../input/input.scss';
import '../form/form.scss';
import '../input-size/input-size.scss';

import ButtonNG from '../button-ng/button-ng';

storiesOf('Style-only|Form', module).
  addParameters({
    notes: 'Helps create forms with various types of controls.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [ButtonNG]);

    return `
      <div style="width: 700px">
        <form class="ring-form">
          <span class="ring-form__title">Form Title</span>
        
          <div class="ring-form__group">
            <label for="ring-form-1" class="ring-form__label">Full-Width
              Input</label>
            <div class="ring-form__control">
              <input class="ring-input" id="ring-form-1" type="text">
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-2" class="ring-form__label">Medium Input</label>
            <div class="ring-form__control">
              <input class="ring-input ring-input-size_md" id="ring-form-2"
                type="text">
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-3" class="ring-form__label">Medium Input & Error</label>
            <div class="ring-form__control">
              <input class="ring-input ring-input_error ring-input-size_md"
                id="ring-form-3" type="text">
              <div class="ring-error-bubble active">Error bubble</div>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-4" class="ring-form__label">Long Input</label>
            <div class="ring-form__control">
              <input class="ring-input ring-input-size_l" id="ring-form-4"
                type="text">
              <div class="ring-error-bubble active">Error bubble for a long
                control
              </div>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-5" class="ring-form__label">Full-Width
              Control</label>
            <div class="ring-form__control">
              <input class="ring-input" id="ring-form-5" type="text">
              <div class="ring-error-bubble active">Error bubble for a full-width
                control
              </div>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-7" class="ring-form__label">Textarea</label>
            <div class="ring-form__control">
              <textarea class="ring-input ring-input-size_md"
                id="ring-form-7"></textarea>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-8" class="ring-form__label">Long
              Textarea</label>
            <div class="ring-form__control">
              <textarea class="ring-input ring-input-size_l"
                id="ring-form-8"></textarea>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-9" class="ring-form__label">Full-Width
              Textarea</label>
            <div class="ring-form__control">
              <textarea class="ring-input" id="ring-form-9"></textarea>
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-11" class="ring-form__label">Input in
              a small container</label>
            <div class="ring-form__control ring-form__control_small">
              <input class="ring-input ring-input-size_md" id="ring-form-11"
                type="text">
            </div>
          </div>
        
          <div class="ring-form__group">
            <label for="ring-form-12" class="ring-form__label">Textarea in
              a small container</label>
            <div class="ring-form__control ring-form__control_small">
              <textarea class="ring-input ring-input-size_md"
                id="ring-form-12"></textarea>
            </div>
          </div>
        
          <div class="ring-form__footer">
            <rg-button mode="primary">Save</rg-button>
            <rg-button>Cancel</rg-button>
          </div>
        </form>
      </div>
    `;
  });
