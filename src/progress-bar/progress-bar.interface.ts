import {HTMLAttributes} from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A floating point number that specifies maximum progress value. Default value is 1.0.
   * @type {number}
   */
  max?: number;
  /**
   * A floating point number that specifies current progress value.
   * @type {number}
   */
  value?: number;
  label?: string;
  /**
   * Sets the ring-progress-bar_global class to position the progress bar on top of the screen.
   * Should be placed directly inside body, will be positioned right below .ring-header
   * if placed adjacent to it.
   * @type {boolean}
   */
  global?: boolean | null | undefined;
  /**
   * Disables Disabled progress bar color animation and sets it to static color.
   * @type {boolean}
   */
  staticColor?: boolean;
}
