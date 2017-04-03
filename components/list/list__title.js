import React, {PureComponent, PropTypes} from 'react';
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
    ])
  };

  render() {
    const {description, label} = this.props;
    return (
      <span
        className={styles.title}
        data-test="ring-list-title"
      >
      <span className={styles.title}>
        <span
          className={classnames(styles.label, styles.text)}
        >{label}</span>
        <div className={styles.description}>{description}</div>
    </span>
    );
  }
}
