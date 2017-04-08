import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-dom/test-utils';

import Group from './group';

describe('Group', () => {
  const renderComponent = props => renderIntoDocument(<Group {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Group).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('span');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });
});
