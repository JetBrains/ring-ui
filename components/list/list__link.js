import React, {PropTypes} from 'react';
import classnames from 'classnames';
import Link from '../link/link';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListLink(props) {
  const {className, label, active, description, rgItemType, url, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames(styles.item, className);

  return (
    <Link
      hover={active}
      pseudo={!props.href}
      {...restProps}
      className={classes}
    >
      {label}
    </Link>
  );
}

ListLink.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  description: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  rgItemType: PropTypes.number,
  url: PropTypes.string
};
