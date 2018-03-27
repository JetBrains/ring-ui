/*global inject*/
import 'angular';
import 'angular-mocks';

import styles from '../input/input.css';

import InputNG from './input-ng';

describe('InputNg', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(InputNG));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    scope.testValue = 'foo';
    element = $compile('<rg-input ng-model="testValue"></rg-input>')(scope)[0];
    $rootScope.$digest();
  }));

  it('should render template', () => {
    element.querySelector('[data-test="ring-input-container"]').dataset.test.should.equal('ring-input-container');
    element.querySelector('[data-test="ring-input"]').should.have.class(styles.input);
  });

  it('should pass value', () => {
    element.querySelector('[data-test="ring-input"]').should.have.value(scope.testValue);
  });
});
