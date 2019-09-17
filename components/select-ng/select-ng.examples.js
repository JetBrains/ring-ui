import angular from 'angular';

import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import SelectNG from '../select-ng/select-ng';
import TabsNG from '../tabs-ng/tabs-ng';
import DialogNG from '../dialog-ng/dialog-ng';

export default {
  title: 'Legacy Angular|Select Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: `
## Provides an Angular wrapper for Select.
Options argument has one of the following forms:

+ \`label\` **\`in\`** \`items\`
+ \`label\` **\`for\`** \`item\` **\`in\`** \`items\`
+ \`label\` **\`for\`** \`item\` **\`in\`** \`items\` **\`track by\`** \`trackexpr\`
+ \`label\` **\`select as\`** \`buttontext\` **\`describe as\`** \`description\` **\`for\`** \`item\` **\`in\`** \`items\` **\`track by\`** \`trackexpr\`
+ \`select\` **\`as\`** \`label\` **\`select as\`** \`buttontext\` **\`for\`** \`item\` **\`in\`** \`items\`

Where:

+ \`items\` is an expression that evaluates to a datasource containing data to iterate over. Datasource can be an array or a function that accepts the \`query\` parameter and returns a promise of an array filtered by the query.
+ \`item\` is a local variable that will refer to each item in the items.
+ \`label\` – the result of this expression will be the label for &lt;option&gt; element. The expression will most likely refer to the value variable (e.g. item.name).
+ \`select\` – the result of this expression will be bound to the model of the parent &lt;select&gt; element. If not specified, select expression will default to item.
+ \`trackexpr\` is used when working with an array of objects. The result of this expression will be used to identify the objects in the array. The trackexpr will most likely refer to the item variable (e.g. item.id). Used to preserve selection even when the options are recreated (e.g. reloaded from the server).
+ \`buttontext\` – label for the selected item to be displayed on the button.
+ \`description\` – description of an item to display in the option list.

Examples:

+ \`item in items\`
+ \`item in dataSource(query)\`
+ \`item.text for item in items\`
+ \`item.text for item in items track by item.id\`
+ \`item.text select as item.fullText describe as item.fullDescription for item in items track by item.id\`
+ \`item as item.text select as makeFullText(item) for item in items\`
    `,

    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];

    this.rerender = () => {
      this.selectedItem = this.options[2];
    };

    this.selectedItem = this.options[1];
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItem"
          size="M"
          config="ctrl.config"
          select-type="button"
          clear="true"
          options="item.text for item in ctrl.options track by item.id"
          label="Select item" ng-disabled="ctrl.disabled"></rg-select>
        <div>Selected item: {{ctrl.selectedItem | json}}</div>
        <div>
          <button ng-click="ctrl.disabled = true">Disable</button>
          <button ng-click="ctrl.disabled = false">Enable</button>
          <button ng-click="ctrl.rerender()"}>Update model</button>
        </div>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};

export const inRgTabs = () => {
  angular.module(APP_NAME, [SelectNG, TabsNG]).controller('testCtrl', function ctrl() {
    this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];

    this.selectConfig = {};

    this.selectedItem = this.options[1];
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-tabs>
          <rg-tabs-pane x-title="With select">
            <div>tab 1</div>
            <rg-select ng-model="ctrl.selectedItem" config="ctrl.selectConfig"
              size="M"
              options="item.text for item in ctrl.options track by item.id"
              label="Select item"></rg-select>
          </rg-tabs-pane>
          <rg-tabs-pane x-title="Another tab" counter="7">Tab 2</rg-tabs-pane>
        </rg-tabs>
      </div>
    `;
};

inRgTabs.story = {
  name: 'in rg-tabs'
};

export const asInput = () => {
  angular.module(APP_NAME, [SelectNG, TabsNG]).controller('testCtrl', function ctrl() {
    this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];

    this.selectedItem = this.options[1];
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItem" size="M"
          options="item.text for item in ctrl.options track by item.id"
          label="Select item" ng-disabled="ctrl.disabled"
          type="input"></rg-select>
        <div>Selected item: {{ctrl.selectedItem | json}}</div>
        <div>
          <button ng-click="ctrl.disabled = true">Disable</button>
          <button ng-click="ctrl.disabled = false">Enable</button>
        </div>
      </div>
    `;
};

asInput.story = {
  name: 'as input'
};

export const asModel = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];

    this.selectedItem = this.options[1];
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItem" size="M"
          options="item.id as item.text for item in ctrl.options track by item.id"
          label="Select item" ng-disabled="ctrl.disabled"></rg-select>
        <div>Selected item: {{ctrl.selectedItem}}</div>
      </div>
    `;
};

asModel.story = {
  name: 'as model'
};

export const asModelLazy = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl($timeout) {
    this.selectedItem = 2;

    $timeout(() => {
      this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];
    }, 1000);
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <p>Be carefully using <b>lazy=false</b> may significantly decrease your
          performance</p>
        <p>This case describe when we take from server ng-model and then
          asynchronous take options for this model</p>
  
        <rg-select
          ng-model="ctrl.selectedItem"
          size="M"
          lazy="false"
          options="item.id as item.text for item in ctrl.options track by item.id"></rg-select>
        <div>Selected item: {{ctrl.selectedItem}}</div>
      </div>
    `;
};

asModelLazy.story = {
  name: 'as model lazy'
};

export const withPromise = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl($timeout, $q) {
    this.options = [
      {key: 1, label: '1'},
      {key: 2, label: '2'},
      {key: 3, label: '3'},
      {key: 4, label: '4'},
      {key: 5, label: '5'}
    ];

    this.selectedItem = this.options[1];

    this.getItems = query => {
      // eslint-disable-next-line angular/deferred
      const defer = $q.defer();
      $timeout(() => {
        defer.resolve(this.options.filter(op => (query ? op.label === query : true)));
      }, 1000 * Math.random());
      return defer.promise;
    };
  });

  return `
      <h4>Getting items from promise on click with external filtering. (Filter
        value should be equal to label, not just part)</h4>
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItem"
          size="M"
          options="item in ctrl.getItems(query)" label="Select item"
          external-filter="true" loading-message="Hey! I'm loading!"></rg-select>
        <div>Selected item: {{ctrl.selectedItem | json}}</div>
      </div>
    `;
};

withPromise.story = {
  name: 'with promise'
};

export const dropdownMode = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    this.clicks = [];

    this.options = [
      {key: 1, label: '11111'},
      {key: 2, label: '22222'},
      {key: 3, label: '33333'}
    ];

    this.onSelect = item => this.clicks.push(item);
  });

  return `
      <h4>Select-ng as dropdown</h4>
      <div ng-controller="testCtrl as ctrl">
        <button rg-select options="item in ctrl.options" select-type="dropdown"
          on-change="ctrl.onSelect(selected)" size="M">Click Me
          &#9660;</button>
        <ol>
          <li ng-repeat="click in ctrl.clicks track by $index">{{click.label}}
          </li>
        </ol>
      </div>
    `;
};

dropdownMode.story = {
  name: 'dropdown mode'
};

export const insideDialog = () => {
  function fillScrollableContent() {
    let html = '<h2>Text to scroll</h2>';
    for (let i = 0; i < 100; i++) {
      html += 'Text<br/>';
    }
    return html;
  }

  fillScrollableContent();

  angular.
    module(APP_NAME, [SelectNG, DialogNG]).
    run($templateCache => {
      const tpl = `
          <rg-select
            ng-model="data.selectedItem"
            filter="true"
            size="M"
            options="item in data.getOptions()"
          ></rg-select>
        `;
      $templateCache.put('test-tpl.html', tpl);
    }).
    controller('testCtrl', function ctrl($timeout, dialog) {
      const data = {
        getOptions: () =>
          $timeout(() => [{key: 1, label: '11111'}, {key: 2, label: '22222'}], 1000)
      };

      $timeout(() => {
        dialog.show({
          title: 'Select in dialog demo',
          description: 'Select popup should not scroll with background page content',
          data,
          content: 'test-tpl.html'
        });
      }, 100);
    });

  return `
      <div ng-controller="testCtrl as ctrl">
        <div>
          <h1>Text content to make scroll</h1>
          <div>${fillScrollableContent()}</div>
          <rg-dialog></rg-dialog>
        </div>
      </div>
    `;
};

insideDialog.story = {
  name: 'inside dialog'
};

export const multipleMode = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    this.multiple = true;

    this.options = [
      {key: 1, label: '11111'},
      {key: 2, label: '22222'},
      {key: 3, label: '33333'},
      {key: 4, label: '4444444'},
      {key: 5, label: '5555'}
    ];

    this.selectedItems = [this.options[1], this.options[2]];
  });

  return `
      <h4>Multiple select</h4>
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItems" options="item in ctrl.options"
          size="M"
          label="Select item" multiple="ctrl.multiple"
        ></rg-select>
        <div>Selected items: {{ctrl.selectedItems | json}}</div>
        <button ng-click="ctrl.selectedItems.splice(0, 1)">Deselect first item</button>
        <button ng-click="ctrl.options.splice(0, 1)">Remove first option</button>
        <button ng-click="ctrl.multiple = !ctrl.multiple">Toggle multiple</button>
      </div>
    `;
};

multipleMode.story = {
  name: 'multiple mode'
};

export const insideForm = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    //It is not required to use array of strings. Just for example
    this.options = ['1', '22', '333', '4444'];

    this.selectedItem = null;
  });

  return `
      <h4>Form with validation</h4>
  
      <div ng-controller="testCtrl as ctrl">
        <form name="testForm" class="ring-form ring-form_border" novalidate>
          <div class="ring-form__wrap">
            <div class="ring-form__control">
              <label class="ring-form__label" translate>Required item:</label>
              <rg-select ng-model="ctrl.item1"
                options="item as item for item in ctrl.options"
                size="M"
                label="Select item" required name="requiredSelect"></rg-select>
  
              <div class="installer-form__error-hint ring-error-bubble active"
                ng-if="testForm.requiredSelect.$invalid">
                Error {{testForm.requiredSelect.$error}}
              </div>
            </div>
            <button ng-disabled="testForm.$invalid">Submit</button>
          </div>
          <div>Errors: {{testForm.$error}}</div>
        </form>
      </div>
    `;
};

insideForm.story = {
  name: 'inside form'
};

export const lazyLoadingOnScroll = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl($q, $timeout) {
    const PAGE_SIZE = 20;

    // Result array is increasing after each method call
    this.getOptions = (skip, query) => {
      action('getOptions')('query = ', query, 'skip = ', skip);
      const arr = [];
      if (skip < 50) {
        for (let i = 0; i < PAGE_SIZE; ++i) {
          let labelText = `${skip}-${i}`;
          if (query) {
            labelText = `${query} ${labelText}`;
          }
          arr.push(labelText);
        }
        if (skip === 0) {
          arr.unshift('Unexpected option at the beginning');
        }
      }
      // eslint-disable-next-line angular/deferred
      const defer = $q.defer();
      // Timeout is needed to demonstrate loader in rg-select
      $timeout(() => {
        defer.resolve(arr);
      }, 1000);
      return defer.promise;
    };
    this.selectedItem = null;
  });

  return `
      <h4>Load more elements on scroll</h4>
  
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItem"
          external-filter="true"
          size="M"
          with-infinite-scroll="true"
          infinite-scroll-pack-size="20"
          options="item as item for item in ctrl.getOptions(skip, query)"></rg-select>
      </div>
    `;
};

lazyLoadingOnScroll.story = {
  name: 'lazy loading on scroll'
};

export const performance = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl($timeout) {
    this.renderTime = null;

    this.options = [{id: 1, text: '11111'}, {id: 2, text: '22222'}, {id: 3, text: '33333'}];

    this.renderSelects = () => {
      const date = Date.now();
      const selectsCount = 1000;

      this.selects = new Array(selectsCount).
        join('x').
        split('x').
        map(id => ({id}));

      $timeout(() => {
        this.renderTime = `${(Date.now() - date) / 1000} s`;
      }, 16);
    };
  });

  return `
      <div ng-controller="testCtrl as ctrl">
        <div style="padding: 8px">
          <button type="button" ng-click="ctrl.renderSelects()">Render</button>
          <button type="button" ng-click="ctrl.selects = []">Remove</button>
  
          <span style="color: gray;">
            Last render time: <span ng-bind="ctrl.renderTime"></span>
            | selects counts {{ctrl.selects.length || 0}}
          </span>
        </div>
  
        <rg-select ng-repeat="selectId in ctrl.selects"
          ng-model="ctrl.selectedItem"
          size="M"
          options="item.text for item in ctrl.options track by item.id"
          label="Select item" ng-disabled="ctrl.disabled">
        </rg-select>
      </div>
    `;
};

performance.story = {
  name: 'performance'
};

export const multipleWithManyValues = () => {
  angular.module(APP_NAME, [SelectNG]).controller('testCtrl', function ctrl() {
    this.multiple = true;
    this.options = Array(1000).
      fill(null).
      map((it, i) => ({key: i, label: `label-${i}`}));
  });

  return `
      <h4>Multiple select</h4>
      <div ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItems" options="item in ctrl.options"
                   size="M"
                   label="Select item" multiple="ctrl.multiple"></rg-select>
        <div>Selected items: {{ctrl.selectedItems | json}}</div>
        <button ng-click="ctrl.selectedItems.splice(0, 1)">Deselect first item
        </button>
        <button ng-click="ctrl.options.splice(0, 1)">Remove first option</button>
        <button ng-click="ctrl.multiple = !ctrl.multiple">Toggle multiple</button>
      </div>
    `;
};

multipleWithManyValues.story = {
  name: 'multiple with many values'
};
