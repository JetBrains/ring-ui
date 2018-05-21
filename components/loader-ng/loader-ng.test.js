/*global inject*/
import 'angular';
import 'angular-mocks';

import loaderStyles from '../loader/loader.css';

import Loader from './loader-ng';

describe('Loader', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(Loader));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    scope.message = 'foo';
    $compile = _$compile_;
    element = $compile('<rg-loader message="{{message}}"></rg-loader>')(scope)[0];
    scope.$digest();
  }));

  it('should init', () => {
    element.should.exist;
  });

  it('should render loader', () => {
    element.should.contain(`.${loaderStyles.canvas}`);
  });

  it('should render text', () => {
    element.querySelector(`.${loaderStyles.text}`).textContent.should.equal('foo');
  });

  it('should update text', () => {
    scope.message = 'bar';
    scope.$digest();
    element.querySelector(`.${loaderStyles.text}`).textContent.should.equal('bar');
  });
});
