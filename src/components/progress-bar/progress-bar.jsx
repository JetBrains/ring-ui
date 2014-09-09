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

/**
 * @constructor
 * @extends {ReactComponent}
 */
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

  getDefaultProps: function() {
    return {
      max: 1.0
    };
  },

  /**
   * @param {Number} value The progress task value
   * @return {Number} The progress task value in percents
   */
  _progressValueToPercents: function(value) {
    var percents = (value * 100) / this.props.max;
    return percents > 100 ? 100 : percents;
  },

  render: function() {
    /* jshint ignore:start */
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
          style={progress}>
        </div>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = ProgressBar;
