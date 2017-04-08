import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './progress-bar.scss';

/**
 * @name Progress Bar
 * @category Components
 * @constructor
 * @description Displays the progress of a task (akin to HTML5 progress tag).
 * @extends {ReactComponent}
 * @example-file ./progress-bar.examples.html
 */
export default class ProgressBar extends RingComponent {
  static propTypes = {
    /**
     * Dark background mode
     * @type {boolean}
     */
    light: PropTypes.bool,

    /**
     * Sets the ring-progress-bar_global class to position the progress bar on top of the screen.
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
     * A floating point number that specifies minimum completion rate for a task to be considered
     * complete. Default value is 1.0.
     * @type {number}
     */
    max: PropTypes.number,

    /**
     * A floating point number that specifies current task completion rate.
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
   * @param {number} max The maximum value
   * @return {number} The progress task value in percents
   * @private
   */
  static toPercent(value, max) {
    const HUNDRED_PERCENT = 100;
    const percents = (value * HUNDRED_PERCENT) / max;
    return percents > HUNDRED_PERCENT ? HUNDRED_PERCENT : percents;
  }

  render() {
    const {light, className, global, max, value, ...otherProps} = this.props;

    const width = value ? `${ProgressBar.toPercent(value, max)}%` : null;
    const classes = classNames({
      'ring-progress-bar': true,
      'ring-progress-bar_light': light,
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
