import React from 'react';
import PropTypes from 'prop-types';

import {ReactMarkdownProps} from 'react-markdown/lib/complex-types';

import Link from '../link/link';

const MarkdownLink = ({href, title, children}: JSX.IntrinsicElements['a'] & ReactMarkdownProps) =>
  <Link href={href} title={title}>{children}</Link>;

MarkdownLink.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.array.isRequired
};

export default MarkdownLink;
