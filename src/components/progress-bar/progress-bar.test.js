/**
 * Describe using progress bar
 */
describe('progress-bar', function() {
  var React = require('react/addons');
  var ProgressBar = require('./progress-bar.jsx');
  var container = null;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function() {
    this.progress = renderIntoDocument(new ProgressBar());
  });

  it('should create component', function() {
    expect(this.progress).toBeDefined();
  });

  describe('default value for attributes', function() {
    it('should set default value for max attribute', function() {
      expect(this.progress.state.max).toEqual(1.0);
    });

    it('should not define attribute value by default', function() {
      expect(this.progress.state.value).not.toBeDefined();
    });
  });

  describe('client interaction with progress bar API', function() {
    it('should set max value for progress bar', function() {
      this.progress.setState({
        max: 100
      });

      expect(this.progress.state.max).toEqual(100);
    });

    it('should set progress task value', function() {
      this.progress.setState({
        value: 0.5
      });

      expect(this.progress.state.value).toEqual(0.5);
    });

    it('should set additional classes(modifiers) to the component', function() {
      this.progress.setState({
        className: 'ring-progress-bar_global'
      });

      expect(this.progress.refs.progressbarWrapper.getDOMNode())
        .toHaveClass('ring-progress-bar_global');
    });
  });

  /**
   * Test internal(DOM) representation of the
   * component's state
   */
  describe('#render', function() {
    it('should set min value to equal zero', function() {
      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('aria-valuemin'))
        .toEqual('0');
    });

    it('should update max value in DOM', function() {
      this.progress.setState({
        max: 100
      });

      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('aria-valuemax'))
        .toEqual('100');
    });

    it('should update progress value in DOM', function() {
      this.progress.setState({
        value: 0.5
      });

      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('aria-valuenow'))
        .toEqual('0.5');
      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('style'))
        .toMatch('width: 50%;');
    });

    it('should set width equal 100% if progress value more than max value', function() {
      this.progress.setState({
        max: 1.0,
        value: 10
      });

      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('style'))
        .toMatch('width: 100%;');
    });

    it('should not set width if value is not a number', function() {
      this.progress.setState({
        value: 'string'
      });

      expect(this.progress.refs.progressbar.getDOMNode().getAttribute('style'))
        .toEqual('width:;');
    });
  });
});
