import {PureComponent, HTMLAttributes} from 'react';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import dataTests from '../global/data-tests';

import style from './badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  gray?: boolean | null | undefined
  valid?: boolean | null | undefined
  invalid?: boolean | null | undefined
  disabled?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

const warn = deprecate(() => {}, 'Badge is deprecated and will be removed in RingUI 7.0. Use Tag instead.');

/**
 * @name Badge
 */
// TODO remove in 7.0
export default class Badge extends PureComponent<BadgeProps> {
  render() {
    warn();
    const {
      // Modifiers
      gray,
      valid,
      invalid,
      disabled,

      // Props
      className,
      children,
      'data-test': dataTest,
      ...props
    } = this.props;

    const classes = classNames(
      style.badge,
      className,
      {
        [style.gray]: gray,
        [style.valid]: valid,
        [style.invalid]: invalid,
        [style.disabled]: disabled
      }
    );

    return (
      <span
        {...props}
        data-test={dataTests('ring-badge', dataTest)}
        className={classes}
      >
        {children}
      </span>
    );
  }
}
