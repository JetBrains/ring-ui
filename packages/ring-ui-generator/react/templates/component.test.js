import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import <%= pascalCaseName %> from './<%= paramCaseName %>';

describe('<%= titleCaseName %>', () => {
  const renderComponent = props => renderIntoDocument(<<%= pascalCaseName %> {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), <%= pascalCaseName %>).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  // TODO Add more tests
});
