import {forwardRef} from 'react';
import classNames from 'classnames';

import styles from './progress-bar.css';
import {toPercent} from './progress-bar.utils';
import type {ProgressBarProps} from './progress-bar.interface';

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 1.0,
      label = 'Progress',
      staticColor = false,
      disableAnimation = false,
      global,
      className,
      ...otherProps
    },
    ref,
  ) => {
    const width = value ? `${toPercent(value, max)}%` : undefined;
    const classes = classNames(styles.progressBar, className, {
      [styles.globalMode]: global,
      [styles.staticLineColor]: disableAnimation ?? staticColor,
    });

    return (
      <div {...otherProps} className={classes} ref={ref}>
        <div
          className={styles.line}
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{width}}
        />
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
export type {ProgressBarProps};
