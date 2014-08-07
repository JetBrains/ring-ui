describe('loader', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Loader = require('./loader.jsx');
  var loader;

  function renderIntoDocument(instance) {
    var container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    loader = renderIntoDocument(new Loader());
  });

  it('should create component', function () {
    expect(TestUtils.isCompositeComponentWithType(loader, Loader)).toEqual(true);
  });

  it('should add custom class', function () {
    loader.setProps({
      className: 'test'
    });

    expect(loader.getDOMNode()).toHaveClass('test');
  });

  it('should create inline loader', function () {
    loader.setProps({
      modifier: Loader.Modifier.INLINE
    });

    expect(loader.getDOMNode()).toHaveClass(Loader.Modifier.INLINE);
  });
});
