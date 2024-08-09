import {PureComponent, HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './button-toolbar.css';

export interface ButtonToolbarProps extends HTMLAttributes<HTMLElement> {
  'data-test'?: string | null | undefined
}

/**
 * @name Button Toolbar
*/

export default class ButtonToolbar extends PureComponent<ButtonToolbarProps> {
  render() {
    const {className, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles.buttonToolbar, className);

    return (
      <div
        {...restProps}
        data-test={dataTests('ring-button-toolbar', dataTest)}
        className={classes}
      />
    );
  }
}

