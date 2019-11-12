import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import '../form/form.scss';

import ButtonNG from '../button-ng/button-ng';
import SelectNG from '../select-ng/select-ng';
import CheckboxNG from '../checkbox-ng/checkbox-ng';

import InputNG from '../input-ng/input-ng';

import FormNG from './form-ng';

export default {
  title: 'Legacy Angular|Form Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Form.'
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [FormNG, CheckboxNG, SelectNG, ButtonNG, InputNG]).
    controller('FormExampleCtrl', function ctrl() {
      this.checkedModel = true;
      this.data = [{name: 'Ada'}, {name: 'Nik'}];
    });

  return `
      <div style="width: 700px"
        ng-controller="FormExampleCtrl as formExampleCtrl">
  
        <form class="ring-form" name="ExampleForm" novalidate>
          <span class="ring-form__title">Form Title</span>
  
          <div class="ring-form__group">
            <rg-input size="M" required ng-model="formExampleCtrl.inputValue" label="Medium Input" name="inputMD" type="text"></rg-input>
            <div rg-error-bubble="ExampleForm.inputMD"></div>
          </div>
  
          <div class="ring-form__group">
            <rg-select options="item.name for item in formExampleCtrl.data track by item.name"></rg-select>
            <div class="ring-form__control__description">I am a simple description</div>
          </div>
  
          <div class="ring-form__group">
            <div>
              <rg-checkbox ng-model="formExampleCtrl.checkedModel">Checkbox 1</rg-checkbox>
            </div>
            <div>
              <rg-checkbox ng-model="formExampleCtrl.checkedModel">Checkbox 2</rg-checkbox>
            </div>
            <div>
              <rg-checkbox>Checkbox 3</rg-checkbox>
            </div>
            <div>
              <rg-checkbox>Checkbox 4</rg-checkbox>
            </div>
          </div>
  
          <div class="ring-form__footer">
            <rg-button mode="primary">Save</rg-button>
            <rg-button>Cancel</rg-button>
          </div>
        </form>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
