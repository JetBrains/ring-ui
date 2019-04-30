import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import AvatarEditorNG from '../avatar-editor-ng/avatar-editor-ng';

storiesOf('Legacy Angular|Avatar Editor Ng', module).
  addParameters({hermione: {skip: true}}).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [AvatarEditorNG]).
      controller('testCtrl', function controller() {
        this.data = `data:image/svg+xml;utf8,
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" style="fill: #00cc00"/>
          </svg>
        `;
      });

    return `
      <div ng-controller="testCtrl as ctrl">
        <rg-avatar-editor
          on-select="ctrl.name = name"
          delete-label="Clear"
          ng-model="ctrl.data"
        ></rg-avatar-editor>
        
        <h3>{{ ctrl.name || 'No file name' }}</h3>
        <img style="max-width: 300px; max-height: 300px;" ng-src="{{ctrl.data}}" />
      </div>
    `;
  });
