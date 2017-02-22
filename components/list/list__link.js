import React, {PropTypes} from 'react';
import classnames from 'classnames';
import Link from '../link/link';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListLink(props) {
  const {className, label, hover, description, rgItemType, url, disabled, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames(styles.item, className, {
    [styles.actionLink]: !disabled,
    [styles.hover]: hover && !disabled
  });

  return (
    <Link
      pseudo={!props.href}
      {...restProps}
      hover={hover && !disabled}
      className={classes}
    >
      {label}
    </Link>
  );
}

ListLink.propTypes = {
  ...Link.propTypes,
  className: PropTypes.string,
  hover: PropTypes.bool,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  rgItemType: PropTypes.number,
  url: PropTypes.string
};
