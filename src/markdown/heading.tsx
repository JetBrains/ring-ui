import React from 'react';
import PropTypes from 'prop-types';

import {HeadingProps} from 'react-markdown/lib/ast-to-react';

import Heading from '../heading/heading';

const MarkdownHeading = ({level, children}: HeadingProps) =>
  <Heading level={level}>{children}</Heading>;

MarkdownHeading.propTypes = {
  level: PropTypes.number.isRequired,
  children: PropTypes.array.isRequired
};

export default MarkdownHeading;
