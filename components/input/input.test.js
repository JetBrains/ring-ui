import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import Input from './input';

describe('Input', () => {
  const renderComponent = params => renderIntoDocument(<Input {...params}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Input).should.be.true;
  });

  it('should create input by default', () => {
    findDOMNode(renderComponent()).should.match('input');
  });

  it('should create textarea with multiline option', () => {
    findDOMNode(renderComponent({multiline: true})).should.match('textarea');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.have.class('test-class');
  });
});
