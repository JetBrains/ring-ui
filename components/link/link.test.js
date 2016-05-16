import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Link from './link';

describe('Link', () => {
  let link;

  beforeEach(() => {
    link = TestUtils.renderIntoDocument(React.createElement(Link));
  });

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(link, Link).should.be.true;
  });

  it('should add custom class', () => {
    link.rerender({
      className: 'test'
    });

    link.node.should.have.class('test');
  });
});
