// __tests__/hello-world-test.js

/** @jsx React.DOM */
/* jshint ignore:start */
jest.dontMock('../blocks/hello-world/hello-world.jsx');

describe('hello-world', function () {
  it('test test', function () {
    var React = require('react/addons');
    var HelloWorld = require('../blocks/hello-world/hello-world.jsx');
    var TestUtils = React.addons.TestUtils;

    var helloworld = HelloWorld({
      firstPart: 'Jet',
      secondPart: 'Brains'
    });
    TestUtils.renderIntoDocument(helloworld);
    var el = TestUtils.findRenderedDOMComponentWithTag(
      helloworld, 'h1');
    expect(el.getDOMNode().textContent).toEqual('Hello');

  });
});
/* jshint ignore:end */