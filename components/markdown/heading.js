import React, {PropTypes} from 'react';

import Heading from '../heading/heading';

const MarkdownHeading = ({level, children}) => <Heading level={level}>{children}</Heading>;

MarkdownHeading.propTypes = {
  level: PropTypes.string,
  children: PropTypes.node
};

export default MarkdownHeading;
