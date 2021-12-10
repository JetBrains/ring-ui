import React, {ReactNode} from 'react';
import PropTypes from 'prop-types';

import Link from '../link/link';

export interface MarkdownLinkProps {
  href?: string | undefined
  title?: string | undefined
  children?: ReactNode
}

const MarkdownLink = ({href, title, children}: MarkdownLinkProps) =>
  <Link href={href} title={title}>{children}</Link>;

MarkdownLink.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node
};

export default MarkdownLink;
