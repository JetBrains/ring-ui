import angular from 'angular';
import 'dom4';

import styles from '../button-toolbar/button-toolbar.css';

/**
 * @name Button Toolbar Ng
 * @tags Ring UI Language
 * @category Legacy Angular
 * @description Provides an Angular wrapper for Button Toolbar.
 * @example
   <example name="Button Toolbar Ng">
    <file name="index.html">
      <div ng-app="test" ng-strict-di>
        <div rg-button-toolbar>
          <rg-button mode="primary" delayed="true">Run</rg-button>
          <div rg-button-group>
            <rg-button>Button one</rg-button>
            <rg-button>Button two</rg-button>
            <rg-button disabled>Button three</rg-button>
          </div>
          <rg-button>Another action</rg-button>
        </div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';
      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';
      import ButtonToolbarNg from '@jetbrains/ring-ui/components/button-toolbar-ng/button-toolbar-ng';

      angular.module('test', [ButtonNg, ButtonGroupNg, ButtonToolbarNg]);
    </file>
   </example>
 */

const angularModule = angular.module('Ring.button-toolbar', []);

function rgButtonToolbar() {
  return {
    restrict: 'A',
    link: function link($scope, iElement) {
      const element = iElement[0];
      element.classList.add(...styles.buttonToolbar.split(' '));
    }
  };
}

angularModule.directive('rgButtonToolbar', rgButtonToolbar);

export default angularModule.name;
