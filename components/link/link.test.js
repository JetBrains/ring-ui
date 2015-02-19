describe('Link', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Link = require('./link');
  var $ = require('jquery');
  var link;

  beforeEach(function () {
    link = TestUtils.renderIntoDocument(new Link());
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(link, Link).should.be.true;
  });

  it('should add custom class', function () {
    link.setProps({
      className: 'test'
    });

    $(link.getDOMNode()).should.have.class('test');
  });
});
