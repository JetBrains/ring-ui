import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import PopupMenu from './popup-menu';

describe('PopupMenu', () => {
  let popup;

  beforeEach(() => {
    popup = TestUtils.renderIntoDocument(React.createElement(PopupMenu));
  });

  it('should create component', () => {
    popup.should.exist;
  });

  it('should have List', () => {
    popup.refs.List.should.exist;

    // We need it to maintain compatibility between Popup Menu and List
    ReactDOM.findDOMNode(popup.refs.List.refs.inner).childNodes.length.should.equal(2);
  });

  it('should pass params to List', () => {
    popup.rerender({data: [
      {}
    ]});

    ReactDOM.findDOMNode(popup.refs.List.refs.inner).hasChildNodes().should.be.true;
  });
});
