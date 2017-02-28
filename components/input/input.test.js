import 'dom4';import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Input from './input';

describe('Input', () => {
  const renderComponent = props => renderIntoDocument(<Input {...props} />);
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Input).should.be.true;
  });

  it('should wrap children with div', () => {
    renderNode().should.match('div');
  });

  it('should create input by default', () => {
    renderComponent().input.should.match('input');
  });

  it('should create textarea with multiline option', () => {
    renderComponent({multiline: true}).input.should.match('textarea');
  });

  it('should use passed className', () => {
    renderNode({className: 'test-class'}).should.match('.test-class');
  });

  // TODO Add more tests
});
