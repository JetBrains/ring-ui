import React, {PureComponent, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import Caption from './caption';
import styles from './button-group.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLElement> {
  split?: boolean | null | undefined
  'data-test'?: string | null | undefined
}
/**
 * @name Button Group
 */
export default class ButtonGroup extends PureComponent<ButtonGroupProps> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {className, split, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles.buttonGroup, className, {[styles.split]: split});

    return (
      <div
        {...restProps}
        data-test={dataTests('ring-button-group', dataTest)}
        className={classes}
      />
    );
  }
}

export {Caption};
