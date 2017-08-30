import RingAngularComponent from '../ring-angular-component/ring-angular-component';

import styles from './<%= paramCaseNameSuffix %>.css';

/**
  * @name <%= titleCaseName %>
  * @category Legacy Angular Components
  * @framework Angular
  * @constructor
  * @description TODO add <%= titleCaseName %> description
  * @example
     <example name="<%= paramCaseNameSuffix %>">
       <file name="index.html">
         <div id="<%= paramCaseName %>" ng-app="TestApp" ng-controller="testCtrl">
           <<%= ngDirectiveTagName%> name="{{name}} ({{clicks}} clicks)" ng-click="clicks = clicks + 1"></<%= ngDirectiveTagName%>>
         </div>
       </file>
       <file name="index.js">
         import angular from 'angular';
         import <%= pascalCaseName %> from  '@jetbrains/ring-ui/components/<%= paramCaseNameSuffix %>/<%= paramCaseNameSuffix %>';

         angular.module('TestApp', [<%= pascalCaseName %>]).controller('testCtrl', $scope => {
           $scope.name = '<%= titleCaseName %>';
           $scope.clicks = 0;
         });
       </file>
   </example>
  */

import angular from 'angular';
const angularModule = angular.module('Ring.<%= paramCaseName %>', []);

class <%= ngComponentName %>Component extends RingAngularComponent {
  static $inject = ['$scope', '$element', '$attrs', '$compile'];

  static bindings = {
    name: '@'
  };

  static template = require('./<%= paramCaseNameSuffix %>.html');

  constructor(...args) {
    super(...args);
    const {$attrs, $compile, $element, $scope} = this.$inject;
    this.styles = styles;
  }
}

angularModule.component('<%= ngComponentName %>', <%= ngComponentName %>Component);

export default angularModule.name;
