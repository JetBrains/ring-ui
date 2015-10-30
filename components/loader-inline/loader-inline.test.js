import React from 'react';
import TestUtils from 'react-addons-test-utils';
import LoaderInline from './loader-inline';
import $ from 'jquery';

describe('LoaderInline', function () {
  let loader;

  beforeEach(function () {
    loader = TestUtils.renderIntoDocument(React.createElement(LoaderInline));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(loader, LoaderInline).should.be.true;
  });

  it('should add custom class', function () {
    loader.rerender({
      className: 'test'
    });

    $(loader.node).should.have.class('test');
  });
});
