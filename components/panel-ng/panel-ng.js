/**
 * @name Panel Ng
 * @category Legacy Angular
 * @tags Ring UI Language
 * @framework Angular
 * @description Provides an Angular wrapper for Pager.
* @example
   <example name="Docked Panel Ng">
     <file name="index.html" disable-auto-size>
      <div ng-app='PanelNgExample'>
        <div rg-panel>
          <rg-button mode="primary">Save</rg-button>
          <rg-button >Cancel</rg-button>
        </div>
      </div>
     </file>
     <file name="index.js" webpack="true">
      import angular from 'angular';
      import PanelNG from '@jetbrains/ring-ui/components/panel-ng/panel-ng';
      import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';
      angular.module('PanelNgExample', [PanelNG, ButtonNG]);
     </file>
   </example>
 */
import angular from 'angular';

import styles from '../panel/panel.css';
import {addClasses} from '../global/dom';


const angularModule = angular.module('Ring.panel', []);

angularModule.directive('rgPanel', function rgEqualValueDirective() {
  return {
    link: function link(scope, iElement) {
      addClasses(iElement[0].classList, styles.panel);
    }
  };
});

export default angularModule.name;
