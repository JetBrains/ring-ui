describe('Loader', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var Loader = require('./loader');
  var $ = require('jquery');
  var loader;

  beforeEach(function () {
    loader = TestUtils.renderIntoDocument(React.createElement(Loader));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(loader, Loader).should.be.true;
  });

  it('should add custom class', function () {
    loader.rerender({
      className: 'test'
    });

    $(loader.node).should.have.class('test');
  });

  it('should create inline loader', function () {
    loader.rerender({
      modifier: Loader.Modifier.INLINE
    });

    $(loader.node).should.have.class(Loader.Modifier.INLINE);
  });
});
