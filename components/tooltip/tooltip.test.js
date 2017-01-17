/* eslint-disable func-names */

import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import 'dom4';

import {isCompositeComponentWithType, renderIntoDocument, Simulate} from 'react-addons-test-utils';

import Tooltip from './tooltip';
import Popup from '../popup/popup';

describe('Tooltip', () => {
  beforeEach(function () {
    this.tooltip = renderIntoDocument(Tooltip.factory({
      title: 'test tooltip',
      className: 'test-class',
      children: 'test elem'
    }));
  });

  it('should create component', function () {
    isCompositeComponentWithType(this.tooltip, Tooltip).should.be.true;
  });

  describe('Children', () => {
    it('should wrap text children', function () {
      this.tooltip.node.should.have.text('test elem');
      this.tooltip.node.should.match('span');
    });

    it('should wrap children', () => {
      const tooltip = renderIntoDocument(Tooltip.factory({
        title: 'test tooltip',
        children: <span>{'test span'}</span>
      }));

      tooltip.node.should.match('span');
      tooltip.node.firstChild.should.have.text('test span');
      tooltip.node.firstChild.should.match('span');
    });

    it('should pass props to children', function () {
      this.tooltip.node.should.have.class('test-class');
    });

    it('should not pass title to children', function () {
      this.tooltip.node.should.not.have.attribute('title');
    });
  });

  describe('Popup', () => {
    it('should unbind listeners when empty title is provided', function () {
      const bindEvents = this.sinon.spy(this.tooltip.node, 'removeEventListener');

      this.tooltip.rerender({
        title: ''
      });

      bindEvents.should.have.been.called.twice;
    });

    it('should render popup', function () {
      this.tooltip.showPopup();

      isCompositeComponentWithType(this.tooltip.popup, Popup).should.be.true;
    });

    it('should not render popup when empty title is provided', function () {
      this.tooltip.rerender({
        title: ''
      });

      this.tooltip.showPopup();
      this.tooltip.popup.isVisible().should.be.false;
    });

    it('should render with delay when provided', function () {
      const clock = this.sinon.useFakeTimers();
      this.tooltip.rerender({
        delay: 100
      });

      this.tooltip.showPopup();

      this.tooltip.popup.isVisible().should.be.false;

      clock.tick(200);
      this.tooltip.popup.isVisible().should.be.true;

      clock.restore();
    });

    it('should pass custom props to popup', function () {
      this.tooltip.rerender({
        popupProps: {
          className: 'tooltip-test-popup'
        }
      });

      this.tooltip.showPopup();
      this.tooltip.popup.popup.should.have.class('tooltip-test-popup');
    });

    it('should close popup on unmount', function () {
      this.tooltip.showPopup();
      unmountComponentAtNode(this.tooltip.node.parentNode);

      should.not.exist(this.tooltip.popup);
    });

    it('should not close popup on click on tooltip', function () {
      this.tooltip.showPopup();
      Simulate.click(this.tooltip.node);

      this.tooltip.popup.isVisible().should.be.true;
    });
  });
});
