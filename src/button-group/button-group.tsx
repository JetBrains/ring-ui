import React, {PureComponent, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Caption from './caption';
import styles from './button-group.css';

/**
 * @name Button Group
 */
export default class ButtonGroup extends PureComponent<HTMLAttributes<HTMLElement>> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

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
