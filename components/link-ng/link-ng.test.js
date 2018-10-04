/*global inject*/
import 'angular';
import 'angular-mocks';

import linkStyles from '../link/link.css';

import Link from './link-ng';

describe('LinkNg', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(Link));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<rg-link href="http://google.com"></rg-link>')(scope)[0];
  }));

  it('should replace with a tag', () => {
    element.should.match(`a.${linkStyles.link.split(' ')[0]}`);
  });

  it('should pass attributes to a tag', () => {
    element.should.have.attribute('href', 'http://google.com');
  });
});
