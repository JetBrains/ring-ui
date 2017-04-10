import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon/icon';

const Image = ({src, title, alt}) => (
  <Icon
    glyph={src}
    size={parseInt(alt, 10)}
    title={title}
  />
);

Image.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  alt: PropTypes.string
};

Image.defaultProps = {
  alt: Icon.defaultProps.size.toString()
};

export default Image;
