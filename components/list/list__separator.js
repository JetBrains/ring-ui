import React, {PropTypes} from 'react';
import styles from './list.css';

export default function ListSeparator({description}) {
  return (
    <span className={styles.separator}>{description}</span>
  );
}

ListSeparator.propTypes = {
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
