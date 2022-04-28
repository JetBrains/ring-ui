import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import Caption from './caption';
import styles from './button-group.css';

/**
 * @name Button Group
 */
export default class ButtonGroup extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    'data-test': PropTypes.string
  };

  render() {
    const {className, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles.buttonGroup, className);

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
