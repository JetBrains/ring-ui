import angular from 'angular';

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ButtonNG from '../button-ng/button-ng';
import SelectNG from '../select-ng/select-ng';
import InputNG from '../input-ng/input-ng';
import SidebarNG from '../sidebar-ng/sidebar-ng';

import DialogNG from './dialog-ng';

storiesOf('Legacy Angular|Dialog Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Dialog.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'}
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [DialogNG, ButtonNG, SelectNG, InputNG]).
      controller('ExampleCtrl', function controller($q, $timeout, dialog) {
        this.showDialog = () => {
          dialog.show({
            cssClass: 'custom-css-class',
            title: 'Test',
            closeOnClick: true,
            shortcuts: {
              'ctrl+enter': angular.noop
            },
            template: `
              <div class="form-with-inputs">
                <div class="ring-form__group">
                  <rg-input id="dialog__key" label="Key" type="text">
                </div>
      
                <div class="ring-form__group">
                  <rg-input id="dialog__name" label="Name" type="text"
                            error="Wrong value"></rg-input>
                  <div class="ring-form__control__description">Description</div>
                </div>
      
                <div class="ring-form__group">
                  <rg-input id="textarea-demo" multiline="true" label="Textarea"></rg-input>
                </div>
      
                <div class="ring-form__group">
                  <rg-select
                    options="item.name for item in dialogExampleCtrl.arr track by item.name"
                    id="rg-select-demo"
                    label="Select name"
                  ></rg-select>
                </div>
      
              </div>
            `,
            controllerAs: 'dialogExampleCtrl',
            controller: 'DialogExampleCtrl',
            buttons: [
              {
                label: 'Save',
                default: true,
                action: angular.noop
              },
              {
                label: 'Cancel',
                close: true
              },
              {
                label: 'Dangerous Action',
                cssClasses: 'custom-css-class-button-right',
                action: () => $timeout(angular.noop, 2000).then(action('Some error'))
              }
            ]
          }).catch(action('dialog rejected'));
        };

        $timeout(() => this.showDialog());
      }).
      controller('DialogExampleCtrl', function controller() {
        this.arr = [{name: 'Ada'}, {name: 'Nik'}];
      });
    return `
      <div class="long-page">
        <div rg-dialog=""></div>
        <div ng-controller="ExampleCtrl as ctrl">
          <rg-button ng-click="ctrl.showDialog()">Show dialog</rg-button>
        </div>
      </div>
    `;
  }, {
    storyStyles: `
<style>
    .custom-css-class-button-right {
      float: right;
      color: #C10000;
    }

    .form-with-inputs {
      margin-top: -16px;
    }

    .long-page {
      height: 2000px;
    }

    .high-field.high-field {
      padding: 0;
      line-height: 32px;
    }
</style>`
  }).
  add('in sidebar', () => {
    angular.module(APP_NAME, [DialogNG, ButtonNG, SelectNG, InputNG, SidebarNG]).
      controller('ExampleCtrl', function controller($q, $timeout, dialogInSidebar) {
        this.showDialog = () => {
          dialogInSidebar.show({
            title: 'Test',
            shortcuts: {
              'ctrl+enter': angular.noop
            },
            template: `
              <div>
                <div class="ring-form__group">
                  <rg-input id="dialog__key" type="text" label="Key">
                </div>
              </div>
            `,
            controllerAs: 'dialogExampleCtrl',
            controller: function ctrl() {
              this.arr = [{name: 'Ada'}, {name: 'Nik'}];
            },
            buttons: [
              {
                label: 'Save',
                default: true,
                action: angular.noop
              },
              {
                label: 'Cancel',
                close: true
              }
            ]
          });
        };

        $timeout(() => this.showDialog(), 500);
      });

    return `
      <div>
        <rg-sidebar show="true">
          <rg-dialog in-sidebar="true" active="true"></rg-dialog>
        </rg-sidebar>
  
        <div ng-controller="ExampleCtrl as ctrl">
          <rg-button ng-click="ctrl.showDialog()">Show dialog</rg-button>
        </div>
      </div>
    `;
  }).
  add('with overridden styles', () => {
    angular.module(APP_NAME, [DialogNG, ButtonNG, SelectNG, InputNG, SidebarNG]).
      controller('ExampleCtrl', function controller($q, $timeout, dialog) {
        this.showDialog = () => {
          dialog.show({
            cssClass: 'custom-css-class',
            title: 'Test',
            closeOnClick: true,
            template: `
              <div>
                <div class="ring-form__group">
                  <rg-input id="dialog__key" type="text" label="Key">
                </div>
                  
                <rg-dialog-footer>
                  <rg-button>A button</rg-button>
                </rg-dialog-footer>
              </div>
            `,
            controllerAs: 'dialogExampleCtrl',
            controller: function ctrl() {}
          }).catch(action('dialog rejected'));
        };

        $timeout(() => this.showDialog());
      });

    return `
      <div class="long-page">
        <div rg-dialog=""></div>
        <div ng-controller="ExampleCtrl as ctrl">
          <rg-button ng-click="ctrl.showDialog()">Show dialog</rg-button>
        </div>
      </div>
    `;
  }, {
    storyStyles: `
<style>
  .long-page {
    height: 2000px;
  }
  .custom-css-class {
    padding: 40px;
  }
</style>`
  });
