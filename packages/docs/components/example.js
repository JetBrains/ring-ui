import React from 'react';
import PropTypes from 'prop-types';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import Code from '@jetbrains/ring-ui/components/code/code';
import {H5} from '@jetbrains/ring-ui/components/heading/heading';
import {LinkIcon} from '@jetbrains/ring-ui/components/icon';

import styles from './index.css';
import Iframe from './iframe';

function Example({name, url, disableAutoSize, files}) {
  const id = encodeURIComponent(name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div className={styles.example}>
      <H5 id={id} className={styles.exampleTitle}>
        <Link href={`#${id}`} className={styles.exampleAnchor} tabIndex={-1}>
          {() => <Button icon={LinkIcon}/>}
        </Link>
        {name}
      </H5>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={url} disableAutoSize={disableAutoSize}/>
      }
      {files.map(({showCode, content, type}) => showCode && (
        <Code
          code={content}
          key={type}
        />
      ))}
    </div>
  );
}

Example.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  disableAutoSize: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.shape({
    showCode: PropTypes.bool,
    content: PropTypes.string.isRequired,
    type: PropTypes.string
  }))
};

Example.defaultProps = {
  name: ''
};

export default Example;
