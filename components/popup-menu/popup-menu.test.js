import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import PopupMenu from './popup-menu';

describe('PopupMenu', function () {
  let popup;

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
