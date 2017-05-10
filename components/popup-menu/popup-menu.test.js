import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import PopupMenu from './popup-menu';

describe('Popup Menu', () => {
  let popup;

  beforeEach(() => {
    popup = renderIntoDocument(React.createElement(PopupMenu));
  });

  it('should create component', () => {
    popup.should.exist;
  });

  it('should have List', () => {
    popup.list.should.exist;

    // We need it to maintain compatibility between Popup Menu and List
    ReactDOM.findDOMNode(popup.list.items).childNodes.length.should.equal(0);
  });

  it('should pass params to List', () => {
    popup.rerender({data: [
      {}
    ]});

    ReactDOM.findDOMNode(popup.list.inner).hasChildNodes().should.be.true;
  });
});
