/**
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @fileoverview component represents the progress of a task.
 * (like HTML5 progress tag).
 */

import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './progress-bar.scss';

/**
 * @name Progress Bar
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="progress-bar">
     <file name="index.html">
       <div>
         <div id='progress-bar' style="height: 25px; padding-top: 25px;"></div>
         <div id='progress-bar-black' style="height: 25px; background: #000; padding-top: 25px;"></div>
         <div id='progress-bar-gray' style="height: 25px; background: #F0F0F0; padding-top: 25px;"></div>
       </div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var ProgressBar = require('ring-ui/components/progress-bar/progress-bar');

       var progressBar = render(
         ProgressBar.factory({ value: 0 }),
         document.getElementById('progress-bar')
       );

       var progressBarBlack = render(
         ProgressBar.factory({ value: 0, bright: true }),
         document.getElementById('progress-bar-black')
       );

       var progressBarGray = render(
         ProgressBar.factory({ value: 0 }),
         document.getElementById('progress-bar-gray')
       );

       setInterval(function updateProgress() {
         const currentValue = progressBar.props.value;
         const value = currentValue >=1 ? 0 : currentValue + 0.1;

         progressBar.rerender({ value });
         progressBarBlack.rerender({ value });
         progressBarGray.rerender({ value });
       }, 500);
     </file>
   </example>
 */
export default class ProgressBar extends RingComponent {
  static propTypes = {
    /**
     * Mode for dark backgrounds
     * @type {boolean}
     */
    bright: PropTypes.bool,

    /**
     * Sets class ring-progress-bar_global to position progress bar on top of the screen.
     * Should be placed directly inside body, will be positioned right below .ring-header
     * if placed adjacent to it.
     * @type {boolean}
     */
    global: PropTypes.bool,

    /**
     * Custom class
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
   * @param {number} max The maximal value
   * @return {number} The progress task value in percents
   * @private
   */
  static toPercent(value, max) {
    const HUNDRED_PERCENT = 100;
    const percents = (value * HUNDRED_PERCENT) / max;
    return percents > HUNDRED_PERCENT ? HUNDRED_PERCENT : percents;
  }

  render() {
    const {bright, className, global, max, value, ...otherProps} = this.props;

    const width = value ? `${ProgressBar.toPercent(value, max)}%` : null;
    const classes = classNames({
      'ring-progress-bar': true,
      'ring-progress-bar_bright': bright,
      'ring-progress-bar_global': global,
      [className]: !!className
    });

    return (
      <div
        {...otherProps}
        className={classes}
        ref="progressbarWrapper"
      >
        <div
          className="ring-progress-bar__i"
          ref="progressbar"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{width}}
        />
      </div>
    );
  }
}
