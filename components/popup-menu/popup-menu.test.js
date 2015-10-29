describe('PopupMenu', function () {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var TestUtils = require('react-addons-test-utils');
  var PopupMenu = require('./popup-menu');
  var popup;

  beforeEach(function () {
    popup = TestUtils.renderIntoDocument(React.createElement(PopupMenu));
  });

  it('should create component', function () {
    popup.should.exist;
  });

  it('should have List', function () {
    popup.refs.List.should.exist;

    // We need it to maintain compatibility between Popup Menu and List
    ReactDOM.findDOMNode(popup.refs.List.refs.inner).hasChildNodes().should.be.false;
  });

  it('should pass params to List', function () {
    popup.rerender({data: [
      {}
    ]});

    ReactDOM.findDOMNode(popup.refs.List.refs.inner).hasChildNodes().should.be.true;
  });
});
