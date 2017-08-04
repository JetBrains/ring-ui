import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';
import LoaderCore from '../loader/loader__core';

/**
 * @name Loader Ng
 * @category Legacy Angular Components
 * @tags 3.0
 * @framework Angular
 * @constructor
 * @description Displays the loader.
 * @example
    <example name="Loader Ng">
      <file name="index.html">
        <div id="loader" ng-app="TestApp" ng-strict-di ng-controller="TestCtrl as testCtrl">
          <rg-loader message="{{testCtrl.message}}"></rg-loader>
        </div>
      </file>
      <file name="index.js">
        import angular from 'angular';
        import Loader from  '@jetbrains/ring-ui/components/loader-ng/loader-ng';

        angular.module('TestApp', [Loader]).
          controller('TestCtrl', function () {
            this.message = 'Loading...';
          })
      </file>
  </example>
 */


const angularModule = angular.module('Ring.loader', []);

class RgLoaderComponent extends RingAngularComponent {
  static $inject = ['$element'];

  static bindings = {
    message: '@'
  };

  constructor(...args) {
    super(...args);
    const {$element} = this.$inject;
    this.loader = new LoaderCore($element[0], {message: this.message});
  }

  $onDestroy() {
    this.loader.destroy();
  }

  $onChanges(changes) {
    this.loader.updateMessage(changes.message.currentValue);
  }
}

angularModule.component('rgLoader', RgLoaderComponent);

export default angularModule.name;
