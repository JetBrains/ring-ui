import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import styles from '../index.css';

const Iframe = ({src}) => (
  <div className={styles.iframe}>
    <iframe
      width="100%"
      height="auto"
      src={src}
      className={styles.frame}
    />
    <Link
      href={src}
      className={styles.exampleLink}
      target="_blank"
      title="Open in new tab"
    >{'Example'}</Link>
  </div>
);

Iframe.propTypes = {
  src: PropTypes.string
};

export default Iframe;
