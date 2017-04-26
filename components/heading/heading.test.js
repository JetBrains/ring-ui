import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Heading, {H2} from './heading';

describe('Heading', () => {
  const renderComponent = props => renderIntoDocument(<Heading {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Heading).should.be.true;
  });

  it('should wrap children with h1 by default', () => {
    findDOMNode(renderComponent()).should.match('h1');
  });

  it('should accept level prop', () => {
    findDOMNode(renderComponent({level: Heading.Levels.H3})).should.match('h3');
  });

  it('should export helpers', () => {
    findDOMNode(renderIntoDocument(<H2/>)).should.match('h2');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });
});
