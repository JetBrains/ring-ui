/**
 * Describe using progress bar
 */
describe('ProgressBar', function() {
  var $ = require('jquery');
  var React = require('react/addons');
  var ProgressBar = require('./progress-bar');

  beforeEach(function() {
    this.progress = React.addons.TestUtils.renderIntoDocument(React.createElement(ProgressBar));
  });

  it('should create component', function() {
    this.progress.should.exist;
  });

  describe('default value for attributes', function() {
    it('should set default value for max attribute', function() {
      this.progress.props.max.should.equal(1.0);
    });
  });

  describe('client interaction with progress bar API', function() {
    it('should set max value for progress bar', function() {
      this.progress.rerender({
        max: 100
      });

      this.progress.props.max.should.equal(100);
    });

    it('should set progress task value', function() {
      this.progress.rerender({
        value: 0.5
      });

      this.progress.props.value.should.equal(0.5);
    });

    it('should set additional classes(modifiers) to the component', function() {
      this.progress.rerender({
        className: 'ring-progress-bar_global'
      });

      $(this.progress.refs.progressbarWrapper.getDOMNode()).should.have.class('ring-progress-bar_global');
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', function() {
    it('should set min value to equal zero', function() {
      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('aria-valuemin', '0');
    });

    it('should update max value in DOM', function() {
      this.progress.rerender({
        max: 100
      });

      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('aria-valuemax', '100');
    });

    it('should update progress value in DOM', function() {
      this.progress.rerender({
        value: 0.5
      });

      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('aria-valuenow', '0.5');
      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('style').match(/width: 50%;/);
    });

    it('should set width equal 100% if progress value more than max value', function() {
      this.progress.rerender({
        max: 1.0,
        value: 10
      });

      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('style').match(/width: 100%;/);
    });

    it('should not set width if value is not a number', function() {
      this.progress.rerender({
        value: null
      });

      $(this.progress.refs.progressbar.getDOMNode()).should.have.attr('style').match(/^(width:;)?$/);
    });
  });
});
