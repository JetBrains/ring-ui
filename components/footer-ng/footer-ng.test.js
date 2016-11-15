/*global inject*/
import 'angular';
import 'angular-mocks';

import Footer from './footer-ng';

describe('Footer', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(Footer));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile(`
      <rg-footer>
        <rg-footer-left>
          <rg-footer-line>Left column</rg-footer-line>
        </rg-footer-left>
        <rg-footer-center>
          <rg-footer-line><rg-footer-copyright year="2000" company-name="JetBrains"></rg-footer-copyright></rg-footer-line>
        </rg-footer-center>
      </rg-footer>
    `)(scope)[0];
    scope.$digest();
  }));

  it('should have root div element', () => {
    element.should.contain('div');
  });

  it('should render left column', () => {
    element.should.contain.text('Left column');
  });

  it('should copyright', () => {
    element.should.contain.text('JetBrains · All rights reserved');
  });
});
