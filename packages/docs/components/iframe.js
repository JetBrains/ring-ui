import React from 'react';
import PropTypes from 'prop-types';
import Link from '@jetbrains/ring-ui/components/link/link';
import className from 'classnames';

import styles from './index.css';

const Iframe = ({src, disableAutoSize}) => (
  <div className={styles.iframe}>
    <iframe
      id={src}
      width="100%"
      height="auto"
      src={src}
      data-resize={disableAutoSize ? 'disabled' : 'enabled' }
      className={className({
        [styles.frame]: true,
        [styles.frameFixedHeight]: disableAutoSize
      })}
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
  src: PropTypes.string,
  disableAutoSize: PropTypes.bool
};

export default Iframe;
