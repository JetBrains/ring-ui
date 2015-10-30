import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Link from './link';
import $ from 'jquery';

describe('Link', function () {
  let link;

  beforeEach(function () {
    link = TestUtils.renderIntoDocument(React.createElement(Link));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(link, Link).should.be.true;
  });

  it('should add custom class', function () {
    link.rerender({
      className: 'test'
    });

    $(link.node).should.have.class('test');
  });
});
