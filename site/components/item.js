import React, {PropTypes} from 'react';
import classNames from 'classnames';

import Link from 'ring-ui/components/link/link';

import {currentPath} from '../utils';

import styles from '../index.css';

const Item = ({url, title, legacy}) => {
  const active = url === currentPath();
  return (
    <li className={styles.item}>
      <Link
        href={url}
        active={active}
        className={classNames(styles.item, {
          [styles.legacy]: legacy,
          [styles.active]: active
        })}
      >{title}</Link>
    </li>
  );
};

Item.propTypes = {
  url: PropTypes.string,
  legacy: PropTypes.bool,
  title: PropTypes.string
};

export default Item;
