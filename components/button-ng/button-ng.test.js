import 'dom4';
import angular from 'angular';
import 'angular-mocks';

import Button from './button-ng';

describe('Button Ng', () => {
  let $compile;
  let $rootScope;

  beforeEach(window.module(Button));

  /* global inject */
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  it('should render button', () => {
    const element = renderButton();
    element.tagName.toLowerCase().should.be.equal('button');
  });

  it('should render button link', () => {
    const element = renderButtonLink();
    element.tagName.toLowerCase().should.be.equal('a');
  });

  it('should transclude content', () => {
    const buttonElement = renderButton();
    const linkElement = renderButtonLink();

    angular.element(buttonElement).text().trim().should.be.equal('A');
    angular.element(linkElement).text().trim().should.be.equal('A');
  });

  it('should render active button', () => {
    const scope = $rootScope.$new();
    scope.active = true;
    const element = renderButton(scope);
    element.should.have.attribute('data-test-active');
  });


  it('should remove active attribute', () => {
    const scope = $rootScope.$new();

    scope.active = true;
    const element = renderButton(scope);
    element.should.have.attribute('data-test-active');

    scope.active = false;
    scope.$digest();
    element.should.not.have.attribute('data-test-active');
  });


  function renderButton(scope = $rootScope.$new()) {
    return compileButton('rg-button', scope);
  }

  function renderButtonLink(scope = $rootScope.$new()) {
    return compileButton('rg-button-link', scope);
  }

  function compileButton(tagName, scope) {
    const iElement = $compile(`<${tagName} loader="loader" active="active">A</${tagName}>`)(scope);
    scope.$digest();
    return iElement[0];
  }
});
