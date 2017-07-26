import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './list.css';

export default class ListSeparator extends PureComponent {
  static propTypes = {
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    isFirst: PropTypes.bool
  };

  render() {
    const {description, isFirst} = this.props;

    const classes = classNames(styles.separator, {
      [styles.separator_first]: isFirst
    });

    return (
      <span
        className={classes}
      >{description}</span>
    );
  }
}
