import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Pager from './pager';

describe('Pager', () => {
  const props = {total: 100, currentPage: 1, onPageChange: () => {}};
  const renderComponent = params => renderIntoDocument(<Pager {...{...props, ...params}}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Pager).should.be.true;
  });

  it('should return null instead of node when total is less than 2', () => {
    should.not.exist(renderComponent({total: 1}).node);
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });
});
