import React, {PropTypes} from 'react';

import Item from './item';

const Category = ({name, items}) => (
  <div>
    {name !== 'Docs' &&
      <h4 className="header">{name}</h4>
    }

    <ul className="nav">
      {items.map(item =>
        <Item
          {...item}
          key={item.title}
        />
      )}
    </ul>
  </div>
);

Category.propTypes = {
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default Category;
