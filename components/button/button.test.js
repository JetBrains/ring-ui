import $ from 'jquery';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Button from './button';

describe('Button', function () {
  beforeEach(function () {
    this.button = TestUtils.renderIntoDocument(React.createElement(Button));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.button, Button).should.equal(true);
  });

  it('should set theme', function () {
    this.button.rerender({
      modifier: Button.Modifiers.BLUE
    });

    $(this.button.node).should.have.class('ring-btn_blue');
  });

  it('should set custom class', function () {
    const CUSTOM_CLASS = 'test';

    this.button.rerender({
      className: CUSTOM_CLASS
    });

    $(this.button.node).should.have.class(CUSTOM_CLASS);
  });
});
