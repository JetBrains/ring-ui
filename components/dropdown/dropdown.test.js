import React from 'react';
import {
  Simulate
} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import Popup from '../popup/popup';

import Dropdown from './dropdown';

describe('Dropdown', () => {
  let anchor;
  let popup;

  const anchorElement = (
    <span
      ref={function anchorRef(el) {
        anchor = el;
      }}
    />
  );

  const popupElement = (
    <Popup
      ref={function popupRef(el) {
        popup = el;
      }}
    />
  );

  const shallowDropdown = (props, children = popupElement) => shallow(
    <Dropdown
      anchor={anchorElement}
      {...props}
    >
      {children}
    </Dropdown>
  );
  const mountDropdown = (props, children = popupElement) => mount(
    <Dropdown
      anchor={anchorElement}
      {...props}
    >
      {children}
    </Dropdown>
  );

  it('should create component', () => {
    mountDropdown().should.have.type(Dropdown);
  });

  it('should wrap children with div', () => {
    shallowDropdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowDropdown({className: 'test-class'}).should.have.className('test-class');
  });

  it('should not show popup by default', () => {
    mountDropdown();
    popup.isVisible().should.be.false;
  });

  it('should show popup on anchor click', () => {
    mountDropdown();
    Simulate.click(anchor);
    popup.isVisible().should.be.true;
  });

  it('should hide popup on second anchor click', () => {
    mountDropdown();
    Simulate.click(anchor);
    Simulate.click(anchor);
    popup.isVisible().should.be.false;
  });

  it('should hide popup on outside click', done => {
    mountDropdown();
    Simulate.click(anchor);
    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
      popup.isVisible().should.be.false;
      done();
    }, 0);
  });

  it('should show popup when inited with initShown=true', () => {
    mountDropdown({initShown: true});
    popup.isVisible().should.be.true;
  });

  it('should accept function as anchor', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});

    anchorFunc.should.have.been.calledWithMatch({active: false});
  });

  it('should pass active property to anchor function', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});
    Simulate.click(anchor);

    anchorFunc.should.have.been.calledTwice;
    anchorFunc.getCall(1).calledWithMatch({active: true}).should.be.true;
  });
});
