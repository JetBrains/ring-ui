import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../heading/heading';

const MarkdownHeading = ({level, children}) => <Heading level={level}>{children}</Heading>;

MarkdownHeading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node
};

export default MarkdownHeading;
