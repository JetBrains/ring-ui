import React from 'react';
import TestUtils from 'react-addons-test-utils';
import LoaderInline from './loader-inline';

describe('LoaderInline', () => {
  let loader;

  beforeEach(() => {
    loader = TestUtils.renderIntoDocument(React.createElement(LoaderInline));
  });

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(loader, LoaderInline).should.be.true;
  });

  it('should add custom class', () => {
    loader.rerender({
      className: 'test'
    });

    loader.node.should.have.class('test');
  });
});
