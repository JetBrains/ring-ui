import 'dom4';

import 'angular';
import 'angular-mocks';

import sniffer from '../global/sniffer';

import Checkbox from './checkbox-ng';

describe('Checkbox Ng', () => {
  let scope;
  let element;
  let iElement;
  let $compile;
  let $rootScope;

  beforeEach(window.module(Checkbox));

  /* global inject */
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    iElement = $compile('<rg-checkbox ng-disabled="disabled" ng-model="checked">Checkbox</rg-checkbox>')(scope);
    element = iElement[0];
    scope.$digest();
  }));

  it('should not be checked by default', () => {
    element.should.not.contain('input:checked');
    should.not.exist(iElement.controller('ngModel').$viewValue);
  });

  it('should have been set checked by click', () => {
    if (sniffer.browser.name === 'ie') {
      return;
    }

    const click = new MouseEvent('click');
    // Doesn't trigger handler in IE for some reason
    element.query('input').dispatchEvent(click);

    iElement.controller('ngModel').$viewValue.should.be.true;
  });

  it('should have been set checked by ng-model', () => {
    scope.checked = true;
    scope.$digest();
    element.should.contain('input:checked');
  });

  it('should have been set disabled by ng-model', () => {
    scope.disabled = true;
    scope.$digest();
    element.should.contain('input:disabled');
  });

  it('label and input should have same ids', () => {
    element.query('input').id.should.equal(element.htmlFor);
  });

  it('should disable input with disabled expression constant', () => {
    scope = $rootScope.$new();
    element = $compile('<rg-checkbox ng-disabled="true">Checkbox</rg-checkbox>')(scope)[0];
    scope.$digest();
    element.query('input').should.have.property('disabled');
  });
});
