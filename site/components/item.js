import React, {PropTypes} from 'react';
import classNames from 'classnames';

import Link from 'ring-ui/components/link/link';

import styles from '../index.css';

const Item = ({title, legacy, ...linkProps}) => (
  <li className={styles.item}>
    <Link
      {...linkProps}
      className={classNames({
        legacy: legacy,
        active: linkProps.active
      })}
    >{title}</Link>
  </li>
);

Item.propTypes = {
  ...Link.propTypes,
  legacy: PropTypes.bool,
  title: PropTypes.string
};

export default Item;
