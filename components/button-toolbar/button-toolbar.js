import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button-toolbar.css';

/**
 * @name Button Toolbar
*/

export default class ButtonToolbar extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {className} = this.props;
    const classes = classNames(styles.buttonToolbar, className);

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}

