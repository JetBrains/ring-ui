import 'angular';
import 'angular-mocks';

import Radio from './radio-ng';

describe('Radio Ng', () => {
  let scope;
  let element;
  let iElement;
  let $compile;
  let $rootScope;
  const TEST_ID = 'test-id';

  beforeEach(window.module(Radio));

  /* global inject */
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    const tpl = `
      <div>
        <rg-radio ng-model="radioModel" value="one">One</rg-radio>
        <rg-radio ng-model="radioModel" value="two" id="${TEST_ID}">Two</rg-radio>
      </div>`;
    iElement = $compile(tpl)(scope);
    element = iElement[0];
    scope.$digest();
  }));

  it('should not be checked by default', () => {
    element.should.not.contain('input:checked');
    should.not.exist(scope.radioModel);
  });


  it('should use passed id', () => {
    element.querySelector(`#${TEST_ID}`).should.match('input[value=two]');
    should.exist(element.querySelector(`label[for=${TEST_ID}]`));
  });

  it('should have been set checked by click', () => {
    element.querySelector('input[value=two]').dispatchEvent(new MouseEvent('click'));
    element.querySelector('input[value=two]').dispatchEvent(new Event('change'));

    scope.radioModel.should.equal('two');
  });

  it('should have been set checked by ng-model', () => {
    scope.radioModel = 'two';
    scope.$digest();
    element.querySelector('input[value=two]').should.match('input:checked');
  });
});
