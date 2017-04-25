import 'dom4';
import React from 'react';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Island from './island-legacy';

describe('Island Legacy', () => {
  const renderComponent = params => renderIntoDocument(<Island {...params}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Island).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });
});
