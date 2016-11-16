/* eslint-disable func-names */

import 'dom4';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Button from './button';

import styles from './button.css';

describe('Button', () => {
  beforeEach(function () {
    this.button = TestUtils.renderIntoDocument(React.createElement(Button));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.button, Button).should.equal(true);
  });

  it('should set modifiers', function () {
    this.button.rerender({
      active: true,
      danger: true,
      delayed: true,
      loader: true,
      primary: true,
      short: true,
      text: true
    });

    this.button.node.should.have.class(styles.active);
    this.button.node.should.have.class(styles.danger);
    this.button.node.should.have.class(styles.delayed);
    this.button.node.should.have.class(styles.loader);
    this.button.node.should.have.class(styles.primary);
    this.button.node.should.have.class(styles.short);
    this.button.node.should.have.class(styles.text);
  });

  it('should add icon', function () {
    this.button.rerender({
      icon: '#caret-down'
    });

    this.button.node.should.have.class(styles.withIcon);
    this.button.node.should.contain('svg[style*="16"]');
    this.button.node.query('use').should.have.attribute('xlink:href', '#caret-down');
  });

  it('should set custom class', function () {
    const CUSTOM_CLASS = 'test';

    this.button.rerender({
      className: CUSTOM_CLASS
    });

    this.button.node.should.have.class(CUSTOM_CLASS);
  });
});
