/**
 * @jsx React.DOM
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @fileoverview component represents the progress of a task.
 * (like HTML5 progress tag).
 */

require('./progress-bar.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

/**
 * @name Progress Bar
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="progress-bar">
    <file name="index.html">
      <div id='progress-bar'></div>
    </file>
    <file name="index.js" webpack="true">
      var React = require('react');
      var ProgressBar = require('progress-bar/progress-bar');

      var progressBar = React.renderComponent(ProgressBar({
          value: 0
        }), document.getElementById('progress-bar'));

      setInterval(function updateProgress(){
          var currentValue = progressBar.props.value;

          progressBar.setProps({
            value: (currentValue >=1 ? 0 : currentValue + 0.1)
          });
      }, 500);
    </file>
   </example>
 */
var ProgressBar = React.createClass({
  propTypes: {

    /**
     * ring-progress-bar_global  - Progress bar on top of the screen.
     * Should be placed directly inside body, will be positioned right below .ring-header
     * if placed adjacent to it.
     * @type {string}
     */
    className: ReactPropTypes.string,

    /**
     * A floating point number that specifies how much work the task requires
     * in total before it can be considered complete. Default value is 1.0.
     * @type {number}
     */
    max: ReactPropTypes.number,

    /**
     * A floating point number that specifies how much of the
     * task has been completed
     * @type {number}
     */
    value: ReactPropTypes.number
  },

  getDefaultProps: function() {
    return {
      max: 1.0,
      value: 0
    };
  },

  /**
   * @param {number} value The progress task value
   * @return {number} The progress task value in percents
   * @private
   */
  _progressValueToPercents: function(value) {
    var percents = (value * 100) / this.props.max;
    return percents > 100 ? 100 : percents;
  },

  render: function() {
    var progress = {
      width: this.props.value ? this._progressValueToPercents(this.props.value) + '%' : ''
    };

    return this.transferPropsTo(
      <div className='ring-progress-bar'
          ref="progressbarWrapper">
        <div className="ring-progress-bar__i"
            ref="progressbar"
            role="progressbar"
            aria-valuenow={this.props.value}
            aria-valuemin={0}
            aria-valuemax={this.props.max}
            style={progress} />
      </div>);
  }
});

module.exports = ProgressBar;
