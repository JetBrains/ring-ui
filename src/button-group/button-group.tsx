import React, {PureComponent, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Caption from './caption';
import styles from './button-group.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLElement> {
  split?: boolean | null | undefined
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
    const {className, split, ...restProps} = this.props;
    const classes = classNames(split ? styles.split : styles.buttonGroup, className);

    return (
      <div
        {...restProps}
        className={classes}
      />
    );
  }
}

export {Caption};
