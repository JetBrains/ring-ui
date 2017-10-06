import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './toggle.css';

/**
  * @name Toggle
  * @category Components
  * @tags Ring UI Language
  * @framework React
  * @constructor
  * @description Visual toggle wrapper around checkbox.
  * @example-file ./toggle.examples.html
  */

export default class Toggle extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
  };

  render() {
    const {className, disabled, ...restProps} = this.props;

    const classes = classNames(
      className,
      styles.toggle,
      disabled && styles.disabled
    );

    return (
      <label className={classes}>
        <input
          {...restProps}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
        />

        <span className={styles.switch}/>
      </label>
    );
  }
}
