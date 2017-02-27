import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import styles from '../index.css';

const Item = ({title, ...linkProps}) => (
  <li className={styles.item}>
    <Link {...linkProps}>{title}</Link>
  </li>
);

Item.propTypes = {
  ...Link.propTypes,
  title: PropTypes.string
};

export default Item;
