/* global inject */
import AutoFocus from './autofocus-ng';
import RingSelect from '../select-ng/select-ng';
import 'angular';
import 'angular-mocks';

describe('Autofocus', function () {
  let element;
  let $compile;
  let $scope;

  beforeEach(window.module(AutoFocus));
  beforeEach(window.module(RingSelect));

  beforeEach(inject((_$compile_, $rootScope) => {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.vm = {
      focus: false
    };
    element = $compile('<input rg-autofocus="vm.focus"/>')($scope);

  }));

  it('Should focus when flag changed', function () {

    this.sinon.spy(element[0], 'focus');

    $scope.vm.focus = true;
    $scope.$digest();

    element[0].focus.should.have.been.called;
  });

  it('Should focus on select button', function () {
    element = $compile('<rg-select rg-autofocus="vm.focus" options="item in []"/>')($scope);
    const selectButton = element[0].querySelector('.ring-select');

    this.sinon.spy(selectButton, 'focus');

    $scope.vm.focus = true;
    $scope.$digest();

    selectButton.focus.should.have.been.called;
  });
});
