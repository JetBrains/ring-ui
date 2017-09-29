import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './button-set.css';

/**
 * @name Button Set
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Allows to group several buttons and ensures that margins between them are consistent.
 * @extends {ReactComponent}
 * @example-file ./button-set.examples.html
 */
export default class ButtonSet extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const classes = classNames(styles.buttonSet, this.props.className);
    return (
      <div
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}
