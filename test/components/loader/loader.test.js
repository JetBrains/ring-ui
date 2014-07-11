describe('loader', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Loader = require('../../../src/components/loader/loader.jsx');
  var loader;

  function renderIntoDocument(instance) {
    var container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    loader = renderIntoDocument(new Loader());
  });

  it('should create component', function () {
    expect(TestUtils.isComponentOfType(loader, Loader)).toEqual(true);
  });

  it('should add custom class', function () {
    loader.setProps({
      className: 'test'
    });

    expect(loader.getDOMNode()).toHaveClass('test');
  });
});
