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
  * @description Visial toggle wrapper around checkbox.
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
    const {className, ...restProps} = this.props;

    return (
      <label className={classNames(className, styles.toggle)}>
        <input
          {...restProps}
          type="checkbox"
          className={styles.input}
        />

        <span className={styles.switch}/>
      </label>
    );
  }
}
