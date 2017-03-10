import React, {PropTypes} from 'react';

import Item from './item';

import styles from '../index.css';

const Category = ({filterFn, name, items}) => (!filterFn || items.some(({title}) => filterFn(title).matched)) && (
  <div>
    <h4 className={styles.header}>{name}</h4>

    <ul className={styles.nav}>
      {items.map(item =>
        <li
          className={styles.item}
          key={item.title}
        >
          <Item
            {...item}
            {...{filterFn}}
          />
        </li>
      )}
    </ul>
  </div>
);

Category.propTypes = {
  filterFn: PropTypes.func,
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default Category;
