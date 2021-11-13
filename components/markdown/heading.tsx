import React, {ReactNode} from 'react';
import PropTypes from 'prop-types';

import Heading, {Levels} from '../heading/heading';

export interface MarkdownHeadingProps {
  level?: Levels | undefined
  children?: ReactNode
}

const MarkdownHeading = ({level, children}: MarkdownHeadingProps) =>
  <Heading level={level}>{children}</Heading>;

MarkdownHeading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node
};

export default MarkdownHeading;
