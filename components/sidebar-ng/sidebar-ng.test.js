import 'angular';
import 'angular-mocks';
import './sidebar-ng';

describe('SidebarNg', function () {
  let scope;
  let element;
  let $compile;

  beforeEach(window.module('Ring.sidebar'));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.isShowSidebar = true;

    element = $compile('<div>' +
      '<rg-sidebar show="isShowSidebar" place-under-sibling=".test-sibling">Test sidebar message</rg-sidebar>' +
      '<div class="test-sibling" style="height: 100px;">test</div>' +
    '</div>')(scope);
    scope.$digest();
  }));

  it('Should be showed if showSidebar = true', function () {
    element.should.have.descendants('.ring-sidebar_active');
  });

  it('Should not be showed if showSidebar = false', function () {
    scope.isShowSidebar = false;
    scope.$digest();

    element.should.not.have.descendants('.ring-sidebar_active');
  });
});
