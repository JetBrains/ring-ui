import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Text from './text';

describe('Text', () => {
  const renderComponent = props => renderIntoDocument(<Text {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Text).should.be.true;
  });

  it('should wrap children with span', () => {
    findDOMNode(renderComponent()).should.match('span');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  // TODO Add more tests
});
