// __tests__/hello-world-test.js

/** @jsx React.DOM */
/* jshint ignore:start */
jest.dontMock('../../../blocks/hello-world/hello-world.jsx');

describe('hello-world', function () {
  it('test test', function () {
    var React = require('react/addons');
    var HelloWorld = require('../../../blocks/hello-world/hello-world.jsx');
    var TestUtils = React.addons.TestUtils;

    var helloworld = HelloWorld({
      firstPart: 'Jet',
      secondPart: 'Brains'
    });
    TestUtils.renderIntoDocument(helloworld);
    var el = TestUtils.scryRenderedDOMComponentsWithTag(
      helloworld, 'span');
    expect(el[0].getDOMNode().textContent).toEqual('Hello');
    expect(el[1].getDOMNode().textContent).toEqual('Jet');
    expect(el[2].getDOMNode().textContent).toEqual('Brains');

  });
});
/* jshint ignore:end */