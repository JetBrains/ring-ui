import React, {PropTypes} from 'react';

import Category from './category';
import Version from './version';

import styles from '../index.css';

const Nav = ({version, url, categories}) => (
  <div className={styles.sidebar}>
    <h3 className={styles.navHeader}>
      {'Ring UI library '}<Version {...{version, url}} />
    </h3>
    {categories.map(category =>
      <Category
        {...category}
        key={category.name}
      />
    )}
  </div>
);

Nav.propTypes = {
  version: PropTypes.string,
  url: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.shape(Category.propTypes))
};

export default Nav;
