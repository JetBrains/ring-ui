import {PureComponent, type HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import styles from './button-set.css';

export interface ButtonSetProps extends HTMLAttributes<HTMLElement> {
  'data-test'?: string | null | undefined;
}

/**
 * @name Button Set
 */
export default class ButtonSet extends PureComponent<ButtonSetProps> {
  render() {
    const {className, 'data-test': dataTest, children, ...restProps} = this.props;
    const classes = classNames(styles.buttonSet, className);
    return (
      <div {...restProps} data-test={dataTests('ring-button-set', dataTest)} className={classes}>
        {children}
      </div>
    );
  }
}
