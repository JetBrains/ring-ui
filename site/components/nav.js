import React, {PropTypes} from 'react';

import Category from './category';

const Nav = ({version, categories}) => (
  <div className="app__sidebar">
    <h3 className="header nav__header">
      {'Ring UI library '}<div className="ring-ui-version">{version}</div>
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
  categories: PropTypes.arrayOf(PropTypes.shape(Category.propTypes))
};

export default Nav;
