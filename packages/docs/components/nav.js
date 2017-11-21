import React from 'react';
import PropTypes from 'prop-types';

import Category from './category';
import {currentPath} from './utils';

const category = ({name, items}) => {
  const isDocs = name === 'Docs';

  return (
    <Category
      key={name}
      collapsible={!isDocs}
      initExpanded={items.some(({url}) => url === currentPath())}
      name={isDocs ? 'Ring UI' : name}
      items={items}
    />
  );
};

const Nav = ({categories}) => categories.map(category);

Nav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({}))
  }))
};

export default Nav;
