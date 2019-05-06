import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import LoaderInlineNg from './loader-inline-ng';

storiesOf('Legacy Angular|Loader Inline Ng', module).
  addParameters({
    notes: 'Wraps markup for loader-inline component.'
  }).
  addDecorator(angularDecorator()).
  add('simple', () => {
    angular.module(APP_NAME, [LoaderInlineNg]);

    return `
      <div>
        <span>some text on top</span>
        <div>before <rg-loader-inline/> Some text after</div>
        <div>some text under loader</div>
      </div>
    `;
  });
