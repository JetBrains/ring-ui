/* global inject */
import Template from './template-ng';

describe('TemplateNg', function () {
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

  it('should render a given template', function () {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');

    element.should.contain('test');
  });

  it('should replace a template with a new one', function () {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');
    element.setAttribute('template', '"<test2></test2>"');
    $rootScope.$digest();

    element.should.contain('test2');
  });

  it('should watch a given template expression', function () {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');
    $rootScope.template = '<test2></test2>';
    $rootScope.$digest();

    element.should.contain('test2');
  });

  it('should watch a parent scope', function () {
    $rootScope.template = '<test>{{ id }}</test>';
    $rootScope.id = '123';
    const {element} = build('<rg-template template="template"></rg-template>');

    element.should.contain.text('123');

    $rootScope.id = '456';
    $rootScope.$digest();

    element.should.contain.text('456');
  });

  it('should work correct with an empty template', function () {
    $rootScope.template = '<test></test>';
    const {element} = build('<rg-template template="template"></rg-template>');
    element.setAttribute('template', '');
    $rootScope.$digest();

    element.should.be.empty;
  });
});
