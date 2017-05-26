import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-dom/test-utils';

import DataList from './data-list';

describe('Data List', () => {
  const renderComponent = props => {
    const data = [];
    return renderIntoDocument(<DataList {...{...{data}, ...props}}/>);
  };

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), DataList).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).querySelector('ul').should.match('.test-class');
  });

  // TODO Add more tests
});
