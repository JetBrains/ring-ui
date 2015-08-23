describe('PopupMenu', function () {
  var React = require('react/addons');
  var PopupMenu = require('./popup-menu');
  var popup;

  beforeEach(function() {
    popup = React.addons.TestUtils.renderIntoDocument(React.createElement(PopupMenu));
  });

  it('should create component', function () {
    popup.should.exist;
  });

  it('should have List', function () {
    popup.refs.List.should.exist;

    // We need it to maintain compatibility between Popup Menu and List
    popup.refs.List.refs.inner.getDOMNode().hasChildNodes().should.be.false;
  });

  it('should pass params to List', function () {
    popup.setProps({'data': [
      {}
    ]});

    popup.refs.List.refs.inner.getDOMNode().hasChildNodes().should.be.true;
  });
});
