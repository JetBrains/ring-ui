import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';
import LoaderCore from '../loader/loader__core';

/**
 * @name Loader Ng
 */


const angularModule = angular.module('Ring.loader', []);

class RgLoaderComponent extends RingAngularComponent {

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
RgLoaderComponent.$inject = ['$element'];

angularModule.component('rgLoader', RgLoaderComponent);

export default angularModule.name;
