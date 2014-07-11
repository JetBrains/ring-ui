/** @jsx React.DOM */

/**
 * The <ProgressBar> component represents the progress of a task.
 * (like HTML5 progress tag)
 *
 * Markup:
 *   <ProgressBar value=0 max=100 className={modifiers}/>
 */
'use strict';

require('./progress-bar.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

var ProgressBar = React.createClass({
  propTypes: {

    /**
     * ring-progress-bar_global  - Progress bar on top of
     * the screen. Should be placed directly inside body, will be positioned right below .ring-header
     * if placed adjacent to it.
     */
    className: ReactPropTypes.string,

    /**
     * A floating point number that specifies how much work the task requires
     * in total before it can be considered complete. Default value is 1.0.
     */
    max: ReactPropTypes.number,

    /**
     * A floating point number that specifies how much of the
     * task has been completed
     */
    value: ReactPropTypes.number
  },

  getInitialState: function() {
    return {
      max: this.props.max || 1.0,
      value: this.props.value,
      className: this.props.className || ''
    };
  },

  /**
   * @param {Number} value The progress task value
   * @return {Number} The progress task value in percents
   */
  _progressValueToPercents: function(value) {
    var percents = (value * 100) / this.state.max;
    return percents > 100 ? 100 : percents;
  },

  render: function() {
    var className = 'ring-progress-bar ' + this.state.className;
    var progress = {
      width: this.state.value ? this._progressValueToPercents(this.state.value) + '%' : ''
    };

    return (
      <div className={className}
        ref="progressbarWrapper">
        <div className="ring-progress-bar__i"
          ref="progressbar"
          role="progressbar"
          aria-valuenow={this.state.value}
          aria-valuemin={0}
          aria-valuemax={this.state.max}
          style={progress}>
        </div>
      </div>
    );
  }
});

module.exports = ProgressBar;
