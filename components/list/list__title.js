import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './list.css';

export default class ListTitle extends PureComponent {
  static propTypes = {
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
    const {description, label, isFirst} = this.props;

    const classes = classnames(styles.title, {
      [styles.title_first]: isFirst
    });

    return (
      <span
        className={classes}
        data-test="ring-list-title"
      >
        <span
          className={classnames(styles.label, styles.text)}
        >{label}</span>
        <div className={styles.description}>{description}</div>
      </span>
    );
  }
}
