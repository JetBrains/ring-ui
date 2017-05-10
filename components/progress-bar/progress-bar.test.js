/* eslint-disable func-names */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import ProgressBar from './progress-bar';

describe('Progress Bar', () => {
  beforeEach(function () {
    this.progress = renderIntoDocument(React.createElement(ProgressBar));
  });

  it('should create component', function () {
    this.progress.should.exist;
  });

  describe('default value for attributes', () => {
    it('should set default value for max attribute', function () {
      this.progress.props.max.should.equal(1.0);
    });
  });

  describe('client interaction with progress bar API', () => {
    it('should set max value for progress bar', function () {
      const MAX = 100;

      this.progress.rerender({
        max: MAX
      });

      this.progress.props.max.should.equal(MAX);
    });

    it('should set progress task value', function () {
      const MIDDLE = 0.5;

      this.progress.rerender({
        value: MIDDLE
      });

      this.progress.props.value.should.equal(MIDDLE);
    });

    it('should set additional classes(modifiers) to the component', function () {
      this.progress.rerender({
        className: 'ring-button__loader'
      });

      findDOMNode(this.progress.progressbarWrapper).should.have.class('ring-button__loader');
    });

    it('should set light modifier', function () {
      this.progress.rerender({
        light: true
      });
      findDOMNode(this.progress.progressbarWrapper).should.have.class('ring-progress-bar_light');
    });

    it('should set global modifier', function () {
      this.progress.rerender({
        global: true
      });

      findDOMNode(this.progress.progressbarWrapper).should.have.class('ring-progress-bar_global');
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', () => {
    it('should set min value to equal zero', function () {
      findDOMNode(this.progress.progressbar).should.have.attr('aria-valuemin', '0');
    });

    it('should update max value in DOM', function () {
      this.progress.rerender({
        max: 100
      });

      findDOMNode(this.progress.progressbar).should.have.attr('aria-valuemax', '100');
    });

    it('should update progress value in DOM', function () {
      this.progress.rerender({
        value: 0.5
      });

      findDOMNode(this.progress.progressbar).should.have.attr('aria-valuenow', '0.5');
      findDOMNode(this.progress.progressbar).should.have.attr('style').match(/width: 50%;/);
    });

    it('should set width equal 100% if progress value more than max value', function () {
      this.progress.rerender({
        max: 1.0,
        value: 10
      });

      findDOMNode(this.progress.progressbar).should.have.attr('style').match(/width: 100%;/);
    });

    it('should not set style if value is not a number', function () {
      this.progress.rerender({
        value: null
      });
      findDOMNode(this.progress.progressbar).should.not.have.attr('style');
    });
  });
});
