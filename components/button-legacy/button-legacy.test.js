/* eslint-disable func-names */

import 'dom4';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Button from './button-legacy';

describe('Button', () => {
  beforeEach(function () {
    this.button = TestUtils.renderIntoDocument(React.createElement(Button));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.button, Button).should.equal(true);
  });

  it('should set _default modifier', function () {
    this.button.node.should.have.class('ring-button_default');
  });

  it('should set modifiers', function () {
    this.button.rerender({
      active: true,
      blue: true,
      danger: true,
      delayed: true,
      loader: true,
      primary: true,
      short: true
    });

    this.button.node.should.have.class('ring-button_active');
    this.button.node.should.have.class('ring-button_blue');
    this.button.node.should.have.class('ring-button_danger');
    this.button.node.should.have.class('ring-button_delayed');
    this.button.node.should.have.class('ring-button_loader');
    this.button.node.should.have.class('ring-button_primary');
    this.button.node.should.have.class('ring-button_short');
  });

  it('should add icon', function () {
    this.button.rerender({
      icon: '#caret-down'
    });

    this.button.node.should.have.class('ring-button_icon');
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
