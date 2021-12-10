/* global inject */
import Template from './template-ng';

describe('Template Ng', () => {
  let $compile;
  let $rootScope;

  beforeEach(window.module(Template));

  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  afterEach(() => {
    $rootScope.$destroy();
  });

  function build(template) {
    const $element = $compile(template)($rootScope);
    const element = $element[0];
    const ctrl = $element.controller('rgTemplate');

    $rootScope.$digest();

    return {element, ctrl};
  }

  it('should work as an element', () => {
    const {element} = build('<rg-template template="\'<test></test>\'"></rg-template>');

    element.should.contain('test');
  });

  it('should work as an attribute', () => {
    const {element} = build('<div rg-template="\'<test></test>\'"></div>');

    element.should.contain('test');
  });

  it('should render a given template', () => {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');

    element.should.contain('test');
  });

  it('should apply a given template class', () => {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template" rg-template-class="test-class"></rg-template>');

    element.querySelector('test').should.match('.test-class');
  });

  it('should watch a given template expression', () => {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');
    $rootScope.template = '<test2></test2>';
    $rootScope.$digest();

    element.should.contain('test2');
  });

  it('should watch a parent scope', () => {
    $rootScope.template = '<test>{{ id }}</test>';
    $rootScope.id = '123';
    const {element} = build('<rg-template template="template"></rg-template>');

    element.should.contain.text('123');

    $rootScope.id = '456';
    $rootScope.$digest();

    element.should.contain.text('456');
  });

  it('should work correctly with an empty template', () => {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');
    $rootScope.template = '';
    $rootScope.$digest();

    element.should.be.empty;
  });

  it('should remove current elements after changing a template expression', () => {
    $rootScope.template = '<test></test>';
    const {element} = build('<div><rg-template template="template"></rg-template></div>');

    element.should.contain('test');

    $rootScope.template = '<test2></test2>';
    $rootScope.$digest();

    element.should.not.contain('test');
  });
});
