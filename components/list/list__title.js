import React, {PropTypes} from 'react';
import classnames from 'classnames';
import styles from './list.css';

export default function ListTitle({description, label}) {
  return (
    <span className={styles.title}>
      <span className={classnames(styles.label, styles.text)}>{label}</span>
      <div className={styles.description}>{description}</div>
    </span>
  );
}

ListTitle.propTypes = {
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
