/*global inject*/
import 'angular';
import 'angular-mocks';

import LoaderInline from './loader-inline-ng';

describe('LoaderInline', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(LoaderInline));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<rg-loader-inline></rg-loader-inline>')(scope)[0];
  }));

  it('should render loader markup', () => {
    element.should.contain('.ring-loader-inline');
    element.should.contain('.ring-loader-inline__ball');
  });

});
