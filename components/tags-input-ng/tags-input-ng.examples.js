import angular from 'angular';

import {action} from '@storybook/addon-actions';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import TagsInputNG from '@jetbrains/ring-ui/components/tags-input-ng/tags-input-ng';

export default {
  title: 'Legacy Angular/Tags Input Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Tags Input.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [TagsInputNG]).controller('ExampleCtrl', function ctrl($q) {
    this.tags = [{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}];

    this.dataSource = () =>
      $q.when([{key: 'test3', label: 'test3'}, {key: 'test4', label: 'test4'}]);

    this.onAddTag = action('onAddTag');

    this.removeTag = action('removeTag');
  });
  return `
      <div ng-controller="ExampleCtrl as ctrl">
        <rg-tags-input
          tags="ctrl.tags"
          x-data-source="ctrl.dataSource"
          placeholder="'Type something'"
          on-add-tag="ctrl.onAddTag"
          on-remove-tag="ctrl.removeTag"
        ></rg-tags-input>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
