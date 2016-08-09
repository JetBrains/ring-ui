import 'angular';
import 'angular-mocks';
import Sidebar from './sidebar-ng';

describe('Sidebar Ng', () => {
  let scope;
  let element;
  let $compile;

  beforeEach(window.module(Sidebar));

  /* global inject */
  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.isShowSidebar = true;

    element = $compile('<div>' +
      '<rg-sidebar show="isShowSidebar" place-under-sibling=".test-sibling">Test sidebar message</rg-sidebar>' +
      '<div class="test-sibling" style="height: 100px;">test</div>' +
    '</div>')(scope);

    scope.$digest();
  }));

  it('Should be showed if showSidebar = true', () => {
    element[0].should.contain('.ring-sidebar_active');
  });

  it('Should not be showed if showSidebar = false', () => {
    scope.isShowSidebar = false;
    scope.$digest();

    element[0].should.not.contain('.ring-sidebar_active');
  });
});
