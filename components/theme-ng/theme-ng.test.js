/*global inject*/
import 'angular';
import 'angular-mocks';

import Theme from './theme-ng';

describe('Theme', () => {
  beforeEach(window.module(Theme));

  let $scope;
  let $compile;
  let element;
  let ctrl;

  beforeEach(inject(($rootScope, _$compile_, $componentController) => {
    $scope = $rootScope.$new();
    $compile = _$compile_;

    ctrl = $componentController('rgTheme', {
      $element: {0: {}}
    });
  }));

  it('should render a component', () => {
    $scope.theme = 'foo';
    element = $compile('<rg-theme theme="theme"></rg-theme>')($scope)[0];
    $scope.$digest();

    element.getAttribute('data-test').should.be.equal('ring-theme');
  });

  it('should have a method to subscribe on change a theme', () => {
    ctrl.on.should.exist;
  });

});
