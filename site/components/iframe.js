import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

const Iframe = ({src}) => (
  <div className="markdown-example">
    <iframe
      width="100%"
      height="auto"
      src={src}
      className="markdown-example__frame"
    />
    <Link
      href={src}
      className="markdown-example__link"
      target="_blank"
      title="Open in new tab"
    >{'Example'}</Link>
  </div>
);

Iframe.propTypes = {
  src: PropTypes.string
};

export default Iframe;
