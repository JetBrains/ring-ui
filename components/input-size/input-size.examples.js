import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import '../input/input.scss';
import '../form/form.scss';
import '../input-size/input-size.scss';

import SelectNG from '../select-ng/select-ng';
import QueryAssistNG from '../query-assist-ng/query-assist-ng';

storiesOf('Style-only|Input Sizes', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [QueryAssistNG, SelectNG]).
      controller('ExampleCtrl', function ctrl() {
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
              class="ring-input-size_xs"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Extra-short'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Extra-short Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              class="ring-input-size_s"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Short'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Short Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              class="ring-input-size_md"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Medium'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Medium Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
              class="ring-input-size_l"
              x-data-source="exampleCtrl.dataSource"
              glass="true"
              placeholder="'Long'">
            </rg-query-assist>
            <div class="ring-error-bubble active">Long Query Assist</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <rg-query-assist
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
            <rg-select class="ring-input-size_md"
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
            <rg-select class="ring-input-size_md"
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
            <input type="number" class="ring-input ring-input-size_xs">
            <div class="ring-error-bubble active">Extra-short Input</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input type="number" class="ring-input ring-input-size_s">
            <div class="ring-error-bubble active">Short Input</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input type="number" class="ring-input ring-input-size_md">
            <div class="ring-error-bubble active">Medium Input</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input type="number" class="ring-input ring-input-size_l">
            <div class="ring-error-bubble active">Long Input</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <input type="number" class="ring-input">
            <div class="ring-error-bubble active">Full-width Input</div>
          </div>
        </div>
  
        <h3 class="example-block">Textareas</h3>
        <div class="example-block">
          <div class="ring-error-bubble-wrapper">
            <textarea class="ring-input ring-input-size_xs"></textarea>
            <div class="ring-error-bubble active">Extra-short Textarea</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea class="ring-input ring-input-size_s"></textarea>
            <div class="ring-error-bubble active">Short Textarea</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea class="ring-input ring-input-size_md"></textarea>
            <div class="ring-error-bubble active">Medium Textarea</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea class="ring-input ring-input-size_l"></textarea>
            <div class="ring-error-bubble active">Long Textarea</div>
          </div>
          <div class="ring-error-bubble-wrapper">
            <textarea class="ring-input"></textarea>
            <div class="ring-error-bubble active">Full-width Textarea</div>
          </div>
        </div>
      </div>
    `;
  }, {
    storyStyles: `
<style>
  .example-block {
    margin: 16px;
    max-width: 600px;
  }
</style>`
  });
