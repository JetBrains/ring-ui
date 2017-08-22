import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Caption from './caption';
import styles from './button-group.css';

/**
 * @name Button Group
 * @tags Ring UI Language
 * @category Components
 * @constructor
 * @description Allows to group several buttons.
 * @extends {ReactComponent}
 * @example-file ./button-group.examples.html
 */
export default class ButtonGroup extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  }

  render() {
    const {className} = this.props;
    const classes = classNames(styles.buttonGroup, className);

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}

export {Caption};
