describe('LoaderInline', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var LoaderInline = require('./loader-inline');
  var $ = require('jquery');
  var loader;

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

  it('should create inline loader', function () {
    loader.rerender({
      modifier: LoaderInline.Modifier.INLINE
    });

    $(loader.node).should.have.class(LoaderInline.Modifier.INLINE);
  });
});
