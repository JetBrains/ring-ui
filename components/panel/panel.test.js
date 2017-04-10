import React from 'react';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Panel from './panel';

describe('Panel', () => {
  it('should create component', () => {
    const component = renderIntoDocument(<Panel />);
    isCompositeComponentWithType(component, Panel).should.be.true;
  });

  it('should use provided className', () => {
    const component = renderIntoDocument(<Panel className="custom-class" />);
    component.node.should.have.class('custom-class');
  });

  it('should render children', () => {
    const component = renderIntoDocument(<Panel>{'text'}</Panel>);
    component.node.should.have.text('text');
  });
});
