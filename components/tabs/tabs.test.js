import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-dom/test-utils';
import React from 'react';
import {findDOMNode} from 'react-dom';

import {Tabs, Tab} from './tabs';

describe('Tabs', () => {
  const renderComponent = props => renderIntoDocument(
    <Tabs {...props}>
      <Tab title="1"/>
      <Tab title="2"/>
    </Tabs>
  );
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Tabs).should.be.true;
  });

  it('should wrap children with div', () => {
    renderNode().should.match('div');
  });

  it('should use passed className', () => {
    renderNode({className: 'test-class'}).should.match('.test-class');
  });

  // TODO Add more tests
});
