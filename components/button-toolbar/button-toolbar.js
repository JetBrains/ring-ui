import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './button-toolbar.css';

/**
 * @name Button Toolbar
*/

export default class ButtonToolbar extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    'data-test': PropTypes.string
  };

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

