describe('Link', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var Link = require('./link');
  var $ = require('jquery');
  var link;

  beforeEach(function () {
    link = TestUtils.renderIntoDocument(React.createElement(Link));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(link, Link).should.be.true;
  });

  it('should add custom class', function () {
    link.rerender({
      className: 'test'
    });

    $(link.node).should.have.class('test');
  });
});
