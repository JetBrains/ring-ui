import React, {PropTypes} from 'react';

import Category from './category';

import Version from './version';

const Nav = ({version, url, categories}) => (
  <div className="app__sidebar">
    <h3 className="header nav__header">
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
