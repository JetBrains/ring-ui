import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './list.css';

export default class ListSeparator extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    isFirst: PropTypes.bool
  };

  render() {
    const {description, isFirst, className} = this.props;

    const classes = classNames(styles.separator, className, {
      [styles.separator_first]: isFirst
    });

    return (
      <span
        className={classes}
      >{description}</span>
    );
  }
}
