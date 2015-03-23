require('angular/angular');
require('angular-mocks/angular-mocks');
require('./select-ng');
/* global inject, angular */

describe('SelectNg', function () {

  var scope;
  var element;
  var ctrl;
  var $compile;
  var fakeItems = [
    {key: 1, label: '11'},
    {key: 2, label: '22'},
    {key: 3, label: '33'}
  ];

  beforeEach(window.module('Ring.select'));

  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.items = angular.copy(fakeItems);
    scope.selectedItem = null;

    element = $compile('<rg-select options="items" ng-model="selectedItem"></rg-select>')(scope);
    ctrl = element.controller('rgSelect');
    scope.$digest();
  }));

  it('Should receive ngModel controller', function () {
    expect(ctrl.ngModelCtrl).to.be.defined;
  });

});
