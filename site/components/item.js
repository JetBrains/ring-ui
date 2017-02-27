import React, {PropTypes} from 'react';
import classNames from 'classnames';

import Link from 'ring-ui/components/link/link';

import styles from '../index.css';

const Item = ({title, legacy, ...linkProps}) => (
  <li>
    <Link
      {...linkProps}
      className={classNames(styles.item, {
        [styles.legacy]: legacy,
        [styles.active]: linkProps.active
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
