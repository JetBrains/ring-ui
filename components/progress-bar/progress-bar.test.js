/**
 * Describe using progress bar
 */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ProgressBar from './progress-bar';

describe('ProgressBar', function () {
  beforeEach(function () {
    this.progress = TestUtils.renderIntoDocument(React.createElement(ProgressBar));
  });

  it('should create component', function () {
    this.progress.should.exist;
  });

  describe('default value for attributes', function () {
    it('should set default value for max attribute', function () {
      this.progress.props.max.should.equal(1.0);
    });
  });

  describe('client interaction with progress bar API', function () {
    it('should set max value for progress bar', function () {
      this.progress.rerender({
        max: 100
      });

      this.progress.props.max.should.equal(100);
    });

    it('should set progress task value', function () {
      this.progress.rerender({
        value: 0.5
      });

      this.progress.props.value.should.equal(0.5);
    });

    it('should set additional classes(modifiers) to the component', function () {
      this.progress.rerender({
        className: 'ring-progress-bar_global'
      });

      $(ReactDOM.findDOMNode(this.progress.refs.progressbarWrapper)).should.have.class('ring-progress-bar_global');
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', function () {
    it('should set min value to equal zero', function () {
      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('aria-valuemin', '0');
    });

    it('should update max value in DOM', function () {
      this.progress.rerender({
        max: 100
      });

      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('aria-valuemax', '100');
    });

    it('should update progress value in DOM', function () {
      this.progress.rerender({
        value: 0.5
      });

      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('aria-valuenow', '0.5');
      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('style').match(/width: 50%;/);
    });

    it('should set width equal 100% if progress value more than max value', function () {
      this.progress.rerender({
        max: 1.0,
        value: 10
      });

      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('style').match(/width: 100%;/);
    });

    it('should not set width if value is not a number', function () {
      this.progress.rerender({
        value: null
      });

      $(ReactDOM.findDOMNode(this.progress.refs.progressbar)).should.have.attr('style').match(/^(width:;)?$/);
    });
  });
});
