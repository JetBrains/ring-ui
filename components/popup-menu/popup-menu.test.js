import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import PopupMenu from './popup-menu';

describe('Popup Menu', () => {
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
    ReactDOM.findDOMNode(popup.refs.List.items).childNodes.length.should.equal(0);
  });

  it('should pass params to List', () => {
    popup.rerender({data: [
      {}
    ]});

    ReactDOM.findDOMNode(popup.refs.List.inner).hasChildNodes().should.be.true;
  });
});
