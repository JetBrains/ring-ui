import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import '../input/input-legacy.css';
import '../form/form.css';
import './input-size.css';

import SelectNG from '../select-ng/select-ng';
import QueryAssistNG from '../query-assist-ng/query-assist-ng';

export default {
  title: 'Style-only/Input Sizes',
  decorators: [angularDecorator()]
};

export const basic = () => {
  angular.module(APP_NAME, [QueryAssistNG, SelectNG]).controller('ExampleCtrl', function ctrl() {
    this.dataSource = () => [];

    this.options = ['one', 'two', 'three'];
    this.selected = null;
  });

  return `
      <div ng-controller="ExampleCtrl as exampleCtrl">
        <h3 class="example-block">Query Assists</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              size="'S'"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Extra-short'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Extra-short Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              size="'S'"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Short'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Short Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              size="'M'"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Medium'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Medium Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              size="'L'"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Long'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Long Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              size="'FULL'"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Full-width'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Full-width Query Assist</div>
          </div>
        </div>

        <h3 class="example-block">Rg Selects: Buttons</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_xs"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Extra-short Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_s"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Short Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_m"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Medium Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_l"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Long Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Full-width Select</div>
          </div>
        </div>

        <h3 class="example-block">Rg Selects: Inputs</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_xs"
              type="input"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Extra-short Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_s"
              type="input"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Short Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_m"
              type="input"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Medium Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select class="ring-input-size_l"
              type="input"
              ng-model="exampleCtrl.selected"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Long Select</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-select ng-model="exampleCtrl.selected"
              type="input"
              options="item in exampleCtrl.options"
              label="Select item"></rg-select>
            <div class="ring-error-bubble active">Full-width Select</div>
          </div>
        </div>

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
};

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
