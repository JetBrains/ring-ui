import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Avatar from './avatar';

describe('Avatar', () => {
  const renderComponent = props => renderIntoDocument(<Avatar {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Avatar).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('span');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  // TODO Add more tests
});
