import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './list.css';

export default class ListTitle extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    isFirst: PropTypes.bool
  };

  render() {
    const {className, description, label, isFirst} = this.props;

    const classes = classnames(styles.title, className, {
      [styles.title_first]: isFirst
    });

    return (
      <span
        className={classes}
        data-test="ring-list-title"
      >
        <span
          className={classnames(styles.label, styles.text)}
          data-test="ring-list-title-label"
        >{label}</span>
        <div
          className={styles.description}
          data-test="ring-list-title-description"
        >{description}</div>
      </span>
    );
  }
}
