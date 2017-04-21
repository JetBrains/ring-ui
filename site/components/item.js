import React from 'react';
import PropTypes from 'prop-types';

import Link from '../../components/link/link';
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
