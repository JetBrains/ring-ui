/* eslint-disable angular/controller-as,angular/no-controller */
import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import IconNG from '../icon-ng/icon-ng';
import ThemeNG from '../theme-ng/theme-ng';
import CheckboxNG from '../checkbox-ng/checkbox-ng';
import Theme from '../global/theme';

import {
  PencilIcon,
  Chevron10pxIcon,
  CloseIcon,
  PermissionIcon
} from '../icon';

import ButtonNG from './button-ng';

storiesOf('Legacy Angular|Button Ng', module).
  addDecorator(angularDecorator()).
  add('light', () => {
    angular.module(APP_NAME, [IconNG, ThemeNG, CheckboxNG, ButtonNG]).
      controller('testCtrl', function controller($scope) {
        $scope.pencil = PencilIcon;
        $scope.chevronDown = Chevron10pxIcon;
        $scope.close = CloseIcon;
        $scope.permission = PermissionIcon;
        $scope.Theme = Theme;
      });

    return `
      <div ng-controller="testCtrl">
        <rg-checkbox ng-model="$root.checkbox"><b>Dark theme</b></rg-checkbox>
  
        <rg-theme theme="$root.checkbox ? Theme.DARK : Theme.LIGHT">
          <div style="margin: 8px 0 0 8px; padding: 1px 14px"
               ng-style="{'background-color': $root.checkbox === true ? 'black' : 'inherit'}">
            <p>
              <rg-button>Press me</rg-button>
              <rg-button>Press me Press me Press me Press me Press me</rg-button>
              <rg-button disabled="true">Press me</rg-button>
              <rg-button loader="true">Press me</rg-button>
              <rg-button delayed="true">Press me</rg-button>
              <rg-button text="true">Press me</rg-button>
            </p>
  
            <p>
              <rg-button mode="primary">Press me</rg-button>
              <rg-button mode="primary">Press me Press me Press me Press me Press me</rg-button>
              <rg-button mode="primary" disabled="true">Press me</rg-button>
              <rg-button mode="primary" loader="true">Press me</rg-button>
              <rg-button mode="primary" delayed="true">Press me</rg-button>
              <rg-button mode="primary" text="true">Press me</rg-button>
            </p>
  
            <p>
              <rg-button>Press me</rg-button>
              <rg-button icon="{{close}}">Action with icon</rg-button>
              <rg-button narrow-right="true">Dropdown <rg-icon glyph="{{chevronDown}}" color="GRAY"></rg-icon></rg-button>
              <rg-button icon="{{close}}" mode="primary"></rg-button>
              <rg-button icon="{{permission}}" disabled="true"></rg-button>
              <rg-button icon="{{pencil}}" loader="true"></rg-button>
              <rg-button>Press me</rg-button>
            </p>
  
            <p>
              <rg-button danger="true">Press me</rg-button>
              <rg-button danger="true" disabled="true">Press me</rg-button>
              <rg-button danger="true" loader="true">Press me</rg-button>
              <rg-button danger="true" icon="{{pencil}}"></rg-button>
            </p>
  
            <p>
              <rg-button-link href="/button-link">Button link</rg-button-link>
              <rg-button-link href="/button-link" disabled="true">Button link
              </rg-button-link>
              <rg-button-link href="/button-link" loader="true">Button link
              </rg-button-link>
              <rg-button-link href="/button-link" icon="{{pencil}}"></rg-button-link>
            </p>
  
            <p>
              <rg-button tabindex="1">
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
              </rg-button>
              <rg-button tabindex="2">
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
              </rg-button>
              <rg-button tabindex="3">
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
              </rg-button>
              <rg-button tabindex="4">
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
              </rg-button>
            </p>
          </div>
        </rg-theme>
      </div>
    `;
  }).
  add('dark', () => {
    angular.module(APP_NAME, [IconNG, ThemeNG, CheckboxNG, ButtonNG]).
      run($rootScope => {
        $rootScope.checkbox = true;
        $rootScope.currentTheme = 'dark';
      }).
      controller('testCtrl', function controller($scope) {
        $scope.pencil = PencilIcon;
        $scope.chevronDown = Chevron10pxIcon;
        $scope.close = CloseIcon;
        $scope.permission = PermissionIcon;
        $scope.Theme = Theme;
      });

    return `
      <div ng-controller="testCtrl">
        <rg-checkbox ng-model="$root.checkbox"
                     ng-change="$root.currentTheme = $root.checkbox ? Theme.DARK : Theme.LIGHT">
          <b>Dark theme</b>
        </rg-checkbox>
    
        <rg-theme theme="$root.currentTheme">
          <div style="margin: 8px 0 0 8px; padding: 1px 14px"
               ng-style="{'background-color': $root.checkbox === true ? 'black' : 'inherit'}">
            <p>
              <rg-button>Press me</rg-button>
              <rg-button>Press me Press me Press me Press me Press me</rg-button>
              <rg-button disabled="true">Press me</rg-button>
              <rg-button loader="true">Press me</rg-button>
              <rg-button delayed="true">Press me</rg-button>
              <rg-button text="true">Press me</rg-button>
            </p>
    
            <p>
              <rg-button mode="primary">Press me</rg-button>
              <rg-button mode="primary">Press me Press me Press me Press me Press me</rg-button>
              <rg-button mode="primary" disabled="true">Press me</rg-button>
              <rg-button mode="primary" loader="true">Press me</rg-button>
              <rg-button mode="primary" delayed="true">Press me</rg-button>
              <rg-button mode="primary" text="true">Press me</rg-button>
            </p>
    
            <p>
              <rg-button>Press me</rg-button>
              <rg-button icon="{{close}}">Action with icon</rg-button>
              <rg-button narrow-right="true">Dropdown <rg-icon glyph="{{chevronDown}}" color="GRAY"></rg-icon></rg-button>
              <rg-button icon="{{close}}" mode="primary"></rg-button>
              <rg-button icon="{{permission}}" disabled="true"></rg-button>
              <rg-button icon="{{pencil}}" loader="true"></rg-button>
              <rg-button>Press me</rg-button>
            </p>
    
            <p>
              <rg-button danger="true">Press me</rg-button>
              <rg-button danger="true" disabled="true">Press me</rg-button>
              <rg-button danger="true" loader="true">Press me</rg-button>
              <rg-button danger="true" icon="{{pencil}}"></rg-button>
            </p>
    
            <p>
              <rg-button-link href="/button-link">Button link</rg-button-link>
              <rg-button-link href="/button-link" disabled="true">Button link
              </rg-button-link>
              <rg-button-link href="/button-link" loader="true">Button link
              </rg-button-link>
              <rg-button-link href="/button-link" icon="{{pencil}}"></rg-button-link>
            </p>
    
            <p>
              <rg-button tabindex="1">
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
              </rg-button>
              <rg-button tabindex="2">
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
              </rg-button>
              <rg-button tabindex="3">
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
              </rg-button>
              <rg-button tabindex="4">
                <span>Press me</span>
                <rg-icon glyph="{{close}}"></rg-icon>
                <span>Press me</span>
              </rg-button>
            </p>
          </div>
        </rg-theme>
      </div>
    `;
  });
