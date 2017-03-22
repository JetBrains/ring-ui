import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';
import Code from 'ring-ui/components/code/code';
import {H2} from 'ring-ui/components/heading/heading';

import Iframe from './iframe';

import styles from '../index.css';

function Example({name, url, files}) {
  const id = encodeURIComponent(name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div className={styles.example}>
      <H2 id={id}>{name} <Link href={`#${id}`}>{'#'}</Link></H2>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={url}/>
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
