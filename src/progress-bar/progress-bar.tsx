import React, {HTMLAttributes, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Theme from '../global/theme';

import styles from './progress-bar.css';

export interface ProgressBarProps extends HTMLAttributes<HTMLElement>{
  max: number
  value: number
  theme: Theme
  label: string
  global?: boolean | null | undefined
}

/**
 * @name Progress Bar
 */
export default class ProgressBar extends PureComponent<ProgressBarProps> {
  /**
   * @param {number} value The progress task value
   * @param {number} max The maximum value
   * @return {number} The progress task value in percents
   * @private
   */
  static toPercent(value: number, max: number) {
    const HUNDRED_PERCENT = 100;
    const percents = (value * HUNDRED_PERCENT) / max;
    return percents > HUNDRED_PERCENT ? HUNDRED_PERCENT : percents;
  }

  static propTypes = {
    label: PropTypes.string,
    theme: PropTypes.string,

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

    style: PropTypes.object,

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
    value: 0,
    theme: Theme.LIGHT,
    label: 'Progress'
  };

  progressbarWrapper?: (HTMLElement | null);
  progressbarWrapperRef = (el: HTMLElement | null) => {
    this.progressbarWrapper = el;
  };

  progressbar?: (HTMLElement | null);
  progressbarRef = (el: HTMLElement | null) => {
    this.progressbar = el;
  };

  render() {
    const {theme, className, global, max, value, label, ...otherProps} = this.props;

    const width = value ? `${ProgressBar.toPercent(value, max)}%` : undefined;
    const classes = classNames(styles.progressBar, className, {
      [styles.light]: theme === Theme.LIGHT,
      [styles.dark]: theme === Theme.DARK,
      [styles.globalMode]: global
    });

    return (
      <div
        {...otherProps}
        className={classes}
        ref={this.progressbarWrapperRef}
      >
        <div
          className={styles.line}
          ref={this.progressbarRef}
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{width}}
        />
      </div>
    );
  }
}

export type ProgressBarAttrs = JSX.LibraryManagedAttributes<typeof ProgressBar, ProgressBarProps>
