import {HTMLAttributes} from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A floating point number that specifies maximum progress value. Default value is 1.0.
   * @type {number}
   */
  readonly max?: number;
  /**
   * A floating point number that specifies current progress value.
   * @type {number}
   */
  readonly value?: number;
  readonly label?: string;
  /**
   * Positions the progress bar globally at the top of the screen.
   * @type {boolean}
   */
  readonly global?: boolean | null | undefined;
  /**
   * Disables progress bar color animation.
   * @type {boolean}
   */
  readonly disableAnimation?: boolean;
  /**
   * @deprecated Use `disableAnimation` instead.
   * Disables progress bar color animation.
   * @type {boolean}
   */
  readonly staticColor?: boolean;
}
