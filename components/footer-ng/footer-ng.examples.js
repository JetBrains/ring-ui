import angular from 'angular';

import {storiesOf} from '@storybook/html';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import '../link/link__legacy.css';

import FooterNG from './footer-ng';

storiesOf('Legacy Angular|Footer Ng', module).
  addDecorator(angularDecorator()).
  add('basic', () => {
    angular.module(APP_NAME, [FooterNG]);

    return `
      <rg-footer>
        <rg-footer-left>
          <rg-footer-line>Left</rg-footer-line>
          <rg-footer-line>Build 1.0.0 1234</rg-footer-line>
        </rg-footer-left>
        <rg-footer-center>
          <rg-footer-line>
            <rg-footer-copyright year="2000" company-name="JetBrains"></rg-footer-copyright>
          </rg-footer-line>
          <rg-footer-line><a class="ring-link">License agreement</a></rg-footer-line>
        </rg-footer-center>
        <rg-footer-right>
          <rg-footer-line>Right</rg-footer-line>
        </rg-footer-right>
      </rg-footer>
    `;
  });
