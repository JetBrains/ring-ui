/**
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @fileoverview component represents the progress of a task.
 * (like HTML5 progress tag).
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import './progress-bar.scss';

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
       var render = require('react-dom').render;
       var ProgressBar = require('progress-bar/progress-bar');

       var progressBar = render(
         ProgressBar.factory({ value: 0 }),
         document.getElementById('progress-bar')
       );

       setInterval(function updateProgress() {
         var currentValue = progressBar.props.value;
         progressBar.rerender({ value: currentValue >=1 ? 0 : currentValue + 0.1 });
       }, 500);
     </file>
   </example>
 */
@factory
export default class ProgressBar extends RingComponent {
  static propTypes = {
    /**
     * ring-progress-bar_global  - Progress bar on top of the screen.
     * Should be placed directly inside body, will be positioned right below .ring-header
     * if placed adjacent to it.
     * @type {string}
     */
    className: PropTypes.string,

    /**
     * A floating point number that specifies how much work the task requires
     * in total before it can be considered complete. Default value is 1.0.
     * @type {number}
     */
    max: PropTypes.number,

    /**
     * A floating point number that specifies how much of the
     * task has been completed
     * @type {number}
     */
    value: PropTypes.number
  };

  static defaultProps = {
    max: 1.0,
    value: 0
  };

  /**
   * @param {number} value The progress task value
   * @return {number} The progress task value in percents
   * @private
   */
  _progressValueToPercents(value) {
    let percents = (value * 100) / this.props.max;
    return percents > 100 ? 100 : percents;
  }

  render() {
    let progress = {
      width: this.props.value ? this._progressValueToPercents(this.props.value) + '%' : ''
    };

    let classes = classNames('ring-progress-bar', this.props.className);

    return (
      <div {...this.props} className={classes} ref="progressbarWrapper">
        <div className="ring-progress-bar__i"
            ref="progressbar"
            role="progressbar"
            aria-valuenow={this.props.value}
            aria-valuemin={0}
            aria-valuemax={this.props.max}
            style={progress}
        />
      </div>
    );
  }
}
