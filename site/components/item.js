import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import {currentPath} from '../utils';

const Item = ({url, title}) => (
  <Link
    href={url}
    active={url === currentPath()}
  >{title}</Link>
);

Item.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string
};

export default Item;
