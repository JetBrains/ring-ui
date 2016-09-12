/*global inject*/
import 'angular';
import 'angular-mocks';

import <%= pascalCaseName %> from './<%= paramCaseNameSuffix %>';

describe('<%= pascalCaseName %>', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(<%= pascalCaseName %>));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<<%= ngDirectiveTagName%>></<%= ngDirectiveTagName%>>')(scope)[0];
  }));

  it('should have root div element', () => {
    element.should.contain('div');
  });

  // TODO Add more tests
});
