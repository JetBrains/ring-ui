import React from 'react';
import PropTypes from 'prop-types';
import Link from '@jetbrains/ring-ui/components/link/link';

import {currentPath} from './utils';
import styles from './index.css';

const Item = ({url, title}) => (
  <Link
    href={url}
    active={url === currentPath()}
    className={styles.headerItem}
  >{title}</Link>
);

Item.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string
};

export default Item;
