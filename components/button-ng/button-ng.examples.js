/* eslint-disable angular/controller-as */
import angular from 'angular';

import pencilIcon from '@jetbrains/icons/pencil.svg';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import IconNG from '@jetbrains/ring-ui/components/icon-ng/icon-ng';
import ThemeNG from '@jetbrains/ring-ui/components/theme-ng/theme-ng';
import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';
import Theme from '@jetbrains/ring-ui/components/global/theme';

import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';

export default {
  title: 'Legacy Angular/Button Ng',
  decorators: [angularDecorator()],
  parameters: {a11y: {options: {rules: {tabindex: {enabled: false}}}}}
};

export const basic = () => {
  angular.
    module(APP_NAME, [IconNG, ThemeNG, CheckboxNG, ButtonNG]).
    controller('testCtrl', function controller($scope) {
      $scope.pencil = pencilIcon;
      $scope.Theme = Theme;
    });

  function renderButtonModifications() {
    return ['active', 'primary', 'danger', 'delayed', 'disabled'].
      map(modifier => `<rg-button ${modifier}="true" data-test="button-${modifier}">Button ${modifier}</rg-button>`).join('');
  }

  function renderTextModifications() {
    return ['primary', 'danger', 'disabled', 'loader'].
      map(modifier => `<rg-button text="true" ${modifier}="true">Text action ${modifier}</rg-button>`).join('');
  }

  function renderIconWithTextModifications() {
    return [
      {label: 'primary', attrs: 'primary="true"'},
      {label: 'danger', attrs: 'danger="true"'},
      {label: 'disabled', attrs: 'disabled="true"'},
      {label: 'primary-disabled', attrs: 'primary="true" disabled="true"'},
      {label: 'danger-disabled', attrs: 'danger="true" disabled=true'}
    ].map(mod => `<rg-button icon="{{pencil}}" ${mod.attrs}>Icon action ${mod.label}</rg-button>`).join('');
  }

  function renderIconActionModifications() {
    return [
      {label: 'primary', attrs: 'primary="true"'},
      {label: 'danger', attrs: 'danger="true"'},
      {label: 'disabled', attrs: 'disabled="true"'},
      {label: 'primary-disabled', attrs: 'primary="true" disabled="true"'},
      {label: 'danger-disabled', attrs: 'danger="true" disabled=true'}
    ].map(mod => `<rg-button title="Just icon action (${mod.label})" icon="{{pencil}}" ${mod.attrs}></rg-button>`).join('');
  }

  function renderAllButtons() {
    return `
        <rg-button>Button default</rg-button>
        <rg-button short="true">...</rg-button>
        <rg-button-link href="/">Button link</rg-button-link>
        <rg-button loader="true">Button loader</rg-button>
        <rg-button mode="primary" loader="true">Primary loader</rg-button>

        <rg-button loader="true" icon="{{pencil}}">Icon loader</rg-button>

        <rg-button>
          <span>With rg-icon inside:</span>
          <rg-icon glyph="{{pencil}}"></rg-icon>
        </rg-button>

        ${renderButtonModifications()}

        <rg-button text="true">Text action</rg-button>
        ${renderTextModifications()}

        <rg-button icon="{{pencil}}">Icon action</rg-button>
        ${renderIconWithTextModifications()}

        <rg-button icon="{{pencil}}" title="Icon action"></rg-button>
        ${renderIconActionModifications()}
    `;
  }

  return `
    <div ng-controller="testCtrl">
      <div class="buttons">${renderAllButtons()}</div>

      <rg-theme theme="Theme.DARK">
        <div class="buttons dark">${renderAllButtons()}</div>
      </rg-theme>
    </div>
  `;

};

basic.story = {
  name: 'basic',
  parameters: {
    hermione: {
      actions: [
        {type: 'capture', name: '', selector: '#root'},
        {type: 'focus', selector: '[data-test=button-active]'},
        {type: 'capture', name: 'focus active', selector: '#root'}
      ]
    },
    storyStyles: `
  <style>
    .buttons > button {
      margin: 8px;
    }

    .dark {
      background: #000;
    }
  </style>`
  }
};
