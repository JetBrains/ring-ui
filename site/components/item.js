import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';
import Markdown from 'ring-ui/components/markdown/markdown';

import {currentPath} from '../utils';

const Item = ({filterFn, url, title}) => {
  const filtered = filterFn && filterFn(title);
  return (!filtered || filtered.matched) && (
    <Link
      href={url}
      active={url === currentPath()}
    >{filtered ? <Markdown source={filtered.highlight}/> : title}</Link>
  );
};

Item.propTypes = {
  filterFn: PropTypes.func,
  url: PropTypes.string,
  title: PropTypes.string
};

export default Item;
