import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

const Item = ({title, ...linkProps}) => (
  <li className="nav__item">
    <Link {...linkProps}>{title}</Link>
  </li>
);

Item.propTypes = {
  ...Link.propTypes,
  title: PropTypes.string
};

export default Item;
