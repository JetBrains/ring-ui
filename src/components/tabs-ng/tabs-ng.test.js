'use strict';
require('angular/angular');
require('angular-route/angular-route');
require('angular-mocks/angular-mocks');
require('./tabs-ng');

describe('TabsNg', function () {

  var $rootScope;
  var $compile;

  beforeEach(window.module('Ring.tabs'));

  /* global inject */
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe.only('DOM', function () {
    it('Empty tabs', function () {
      var element = $compile(
        '<ring-tabs>' +
        '<ring-tabs-pane x-title="General">' +
        'General' +
        '</ring-tabs-pane>' +
        '</ring-tabs>'
      )($rootScope);

      $rootScope.$digest();

      console.log(element.html());

      expect(element.html()).to.contain('General');
    });

  });
});
