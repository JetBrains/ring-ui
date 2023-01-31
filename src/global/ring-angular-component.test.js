/* global inject: false */
import angular from 'angular';
import 'angular-mocks';

import RingAngularComponent from './ring-angular-component';

class TestComponent extends RingAngularComponent {

}
TestComponent.$inject = ['$scope'];

const testModule = angular.module('Test', []).component('testComponent', TestComponent).name;

describe('RingAngularComponent', () => {
  let $componentController;

  beforeEach(window.module(testModule));

  beforeEach(inject(_$componentController_ => {
    $componentController = _$componentController_;
  }));

  it('should return a controller as a static property', () => {
    const ctrl = $componentController('testComponent');
    ctrl.should.not.be.undefined;
  });

  it('should copy dependencies to class instances', () => {
    const ctrl = $componentController('testComponent');
    ctrl.should.have.nested.property('$inject.$scope');
  });
});
