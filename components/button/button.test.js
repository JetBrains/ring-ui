/* eslint-disable func-names */

import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-dom/test-utils';

import Button from './button';
import styles from './button.css';

describe('Button', () => {
  const renderComponent = props => renderIntoDocument(<Button {...props}/>);
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Button).should.equal(true);
  });

  it('should set modifiers', () => {
    const node = renderNode({
      active: true,
      danger: true,
      delayed: true,
      loader: true,
      primary: true,
      short: true,
      text: true
    });

    node.should.have.class(styles.active);
    node.should.have.class(styles.danger);
    node.should.have.class(styles.delayed);
    node.should.have.class(styles.loader);
    node.should.have.class(styles.primary);
    node.should.have.class(styles.short);
    node.should.have.class(styles.text);
  });

  it('should add icon', () => {
    const node = renderNode({
      icon: '#caret-down'
    });

    node.should.have.class(styles.withIcon);
    node.should.contain('svg[style*="16"]');
    node.query('use').should.have.attribute('xlink:href', '#caret-down');
  });

  it('should set custom class', () => {
    const CUSTOM_CLASS = 'test';

    const node = renderNode({
      className: CUSTOM_CLASS
    });

    node.should.have.class(CUSTOM_CLASS);
  });
});
