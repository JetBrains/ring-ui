import React, {PropTypes} from 'react';
import classnames from 'classnames';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListHint({label}) {
  return (
    <span
      className={classnames(styles.item, styles.hint)}
      data-test="ring-list-hint"
    >{label}</span>
  );
}

ListHint.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
