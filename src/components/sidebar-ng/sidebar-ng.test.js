'use strict';
require('angular/angular');
require('angular-mocks/angular-mocks');
require('./sidebar-ng');
var $ = require('jquery');

describe('SidebarNg', function () {

  var scope, directiveScope, element, $compile;

  beforeEach(window.module('Ring.sidebar'));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.isShowSidebar = true;

    element = $compile('<div>' +
      '<rg-sidebar show="isShowSidebar" place-under-sibling=".test-sibling">Test sidebar message</rg-sidebar>' +
      '<div class="test-sibling" style="height: 100px;">test</div>'+
    '</div>')(scope);
    scope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('Should be showed if showSidebar = true', function () {
    element.should.have.descendants('.sidebar_active');
  });

  it('Should not be showed if showSidebar = false', function () {
    scope.isShowSidebar = false;
    scope.$digest();

    element.should.not.have.descendants('.sidebar_active');
  });
});
