import {PureComponent, type HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './button-toolbar.css';

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export interface ButtonToolbarProps extends HTMLAttributes<HTMLElement> {
  'data-test'?: string | null | undefined;
}

/**
 * @name Button Toolbar
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export default class ButtonToolbar extends PureComponent<ButtonToolbarProps> {
  render() {
    const {className, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles.buttonToolbar, className);

    return <div {...restProps} data-test={dataTests('ring-button-toolbar', dataTest)} className={classes} />;
  }
}
