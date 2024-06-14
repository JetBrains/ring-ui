import {HTMLAttributes, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './progress-bar.css';

export interface ProgressBarProps extends HTMLAttributes<HTMLElement>{
  max: number
  value: number
  label: string
  global?: boolean | null | undefined
  staticColor?: boolean;
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
    value: PropTypes.number,

    /**
     * Disables Disabled progress bar color animation and sets it to static color.
     * @type {boolean}
     */
    staticColor: PropTypes.bool
  };

  static defaultProps = {
    max: 1.0,
    value: 0,
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
    const {className, global, max, value, label, staticColor, ...otherProps} = this.props;

    const width = value ? `${ProgressBar.toPercent(value, max)}%` : undefined;
    const classes = classNames(styles.progressBar, className, {
      [styles.globalMode]: global,
      [styles.staticLineColor]: staticColor
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
