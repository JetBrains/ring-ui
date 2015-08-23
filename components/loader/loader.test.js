describe('Loader', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
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
    loader.setProps({
      className: 'test'
    });

    $(loader.getDOMNode()).should.have.class('test');
  });

  it('should create inline loader', function () {
    loader.setProps({
      modifier: Loader.Modifier.INLINE
    });

    $(loader.getDOMNode()).should.have.class(Loader.Modifier.INLINE);
  });
});
