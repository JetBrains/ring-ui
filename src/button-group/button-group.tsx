import React, {PureComponent, HTMLAttributes, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import ControlLabel from '../control-label/control-label';

import ControlHelp from '../control-help/control-help';

import Caption from './caption';
import styles from './button-group.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLElement> {
  split?: boolean | null | undefined
  'data-test'?: string | null | undefined
  label?: ReactNode
  help?: ReactNode
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
    const {className, split, 'data-test': dataTest, label, help, ...restProps} = this.props;
    const classes = classNames(split ? styles.split : styles.buttonGroup, className);

    return (
      <>
        {label && <ControlLabel>{label}</ControlLabel>}
        <div
          {...restProps}
          data-test={dataTests('ring-button-group', dataTest)}
          className={classes}
        />
        {help && <ControlHelp className={styles.help}>{help}</ControlHelp>}
      </>
    );
  }
}

export {Caption};
