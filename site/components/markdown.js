import React, {PropTypes} from 'react';
import ReactMarkdown from 'react-markdown';

import RingLink from 'ring-ui/components/link/link';

const Link = ({href, title, children}) => <RingLink {...{href, title}}>{children}</RingLink>;

Link.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node
};

const Markdown = ({renderers, ...restProps}) => (
  <ReactMarkdown
    {...restProps}
    renderers={{
      Link,
      ...renderers
    }}
  />
);

Markdown.propTypes = {
  renderers: PropTypes.object
};

export default Markdown;
