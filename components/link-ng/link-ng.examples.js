import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LinkNG from '../link-ng/link-ng';

storiesOf('Legacy Angular|Link Ng', module).
  addParameters({
    notes: 'Displays a link.'
  }).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [LinkNG]);

    return '<rg-link href="http://example.com" class="test-class">Open example</rg-link>';
  });
