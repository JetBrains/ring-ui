import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import {currentPath} from '../utils';

import styles from '../index.css';

const Item = ({url, title}) => (
  <li className={styles.item}>
    <Link
      href={url}
      active={url === currentPath()}
    >{title}</Link>
  </li>
);

Item.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string
};

export default Item;
