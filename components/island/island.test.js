import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';
import React from 'react';
import Island from './island';

describe('Foo', () => {
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
