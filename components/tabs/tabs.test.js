import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';
import React from 'react';

import {Tabs, Tab} from './tabs';

describe('Tabs', () => {
  const renderComponent = props => renderIntoDocument(
    <Tabs {...props}>
      <Tab title="1"/>
      <Tab title="2"/>
    </Tabs>
  );

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Tabs).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  // TODO Add more tests
});
