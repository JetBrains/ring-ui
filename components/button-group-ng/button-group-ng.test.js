/* global inject */

import 'angular';
import 'angular-mocks';

import ButtonGroupNg from './button-group-ng';

describe('Button Group Ng', () => {
  beforeEach(window.module(ButtonGroupNg));


  let element;
  beforeEach(inject(($compile, $rootScope) => {
    element = $compile('<div rg-button-group=""><i>A</i></div>')($rootScope.$new());
  }));

  it('should create component', () => {
    element.should.not.be.undefined;
  });


  it('should add ring-button-group class', () => {
    [...element[0].classList].should.contains('ring-button-group');
  });
});
