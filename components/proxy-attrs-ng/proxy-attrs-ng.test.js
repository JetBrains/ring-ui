import 'dom4';

import 'angular';
import 'angular-mocks';

import proxyAttrsModule from './proxy-attrs-ng';

describe('Proxy attrs Ng', () => {
  let proxyAttrs;

  const ngModelValue = 'wow';
  const ngDisabledValue = '!getDisabledState()';

  beforeEach(window.module(proxyAttrsModule));

  /* global inject */
  beforeEach(inject(_proxyAttrs_ => {
    proxyAttrs = _proxyAttrs_;
  }));

  it('should return untouched template if there in nothing to replace', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model>Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {$attr: {}});

    expect(replacedTemplate).to.be.equal(sourceTemplate);
  });

  it('should return template with replacement; last attribute', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model>Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, $attr: {ngModel: 'ng-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('data-proxy-ng-model', `ng-model="${ngModelValue}"`));
  });

  it('should return template with replacement; middle attribute', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model class="">Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, $attr: {ngModel: 'ng-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('data-proxy-ng-model', `ng-model="${ngModelValue}"`));
  });

  it('should return template with replacement; before new line', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model\n class="">Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, $attr: {ngModel: 'ng-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('data-proxy-ng-model', `ng-model="${ngModelValue}"`));
  });

  it('should return template with replacement; with quotes', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model="">Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, $attr: {ngModel: 'ng-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('data-proxy-ng-model=""', `ng-model="${ngModelValue}"`));
  });

  it('should respect whitelist instead if attrs', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model>Some text</button><span>';
    const whitelist = [];
    const replacedTemplate = proxyAttrs(sourceTemplate, whitelist)({}, {ngModel: ngModelValue, $attr: {ngModel: 'ng-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate);
  });

  it('should proxy multiple directives', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model>Some text</button><input type="text" data-proxy-ng-disabled></span>';

    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, ngDisabled: ngDisabledValue, $attr: {ngModel: 'ng-model', ngDisabled: 'ng-disabled'}});

    const expectedTemplate = sourceTemplate.
      replace('data-proxy-ng-model', `ng-model="${ngModelValue}"`).
      replace('data-proxy-ng-disabled', `ng-disabled="${ngDisabledValue}"`);

    expect(replacedTemplate).to.be.equal(expectedTemplate);
  });

  it('should proxy one directive to multiple placeholders', () => {
    const sourceTemplate = '<span><button data-proxy-ng-model>Some text</button><input type="text" data-proxy-ng-model></span>';

    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {ngModel: ngModelValue, ngDisabled: ngDisabledValue, $attr: {ngModel: 'ng-model', ngDisabled: 'ng-disabled'}});

    const expectedTemplate = sourceTemplate.
      replace(/data-proxy-ng-model/g, `ng-model="${ngModelValue}"`);

    expect(replacedTemplate).to.be.equal(expectedTemplate);
  });

  it('should proxy attribute value to other attribute', () => {
    const sourceTemplate = '<span><button my-own-model="%data-x-model%">Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {dataXModel: ngModelValue, $attr: {dataXModel: 'data-x-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('%data-x-model%', ngModelValue));
  });

  it('should proxy attribute value to many placeholders', () => {
    const sourceTemplate = '<span><button my-own-model="%data-x-model%" my-other-model="%data-x-model%">%data-x-model%</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {dataXModel: ngModelValue, $attr: {dataXModel: 'data-x-model'}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace(/%data-x-model%/g, ngModelValue));
  });

  it('should clean unused placeholders with their attributes', () => {
    const sourceTemplate = '<span><button my-own-model="%data-x-model%" my-other-model="%data-x-model%">Some text</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {$attr: {}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('my-own-model="%data-x-model%"', '').replace('my-other-model="%data-x-model%"', ''));
  });

  it('should clean unused placeholders', () => {
    const sourceTemplate = '<span><button>%data-x-model%</button><span>';
    const replacedTemplate = proxyAttrs(sourceTemplate)({}, {$attr: {}});

    expect(replacedTemplate).to.be.equal(sourceTemplate.replace('%data-x-model%', ''));
  });
});
