import 'dom4';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import Code from '@jetbrains/ring-ui/components/code/code';
import {H3} from '@jetbrains/ring-ui/components/heading/heading';
import {LinkIcon} from '@jetbrains/ring-ui/components/icon';

import styles from './index.css';
import Iframe from './iframe';
import {currentPath} from './utils';

const componentRE = /^'(@jetbrains\/ring-ui\/components\/([\w-]+)(?:\/.*)?)'$/;

const injectLinks = code => code.queryAll('.hljs-string')
  .forEach(node => {
    const match = node.textContent.match(componentRE);

    if (!match) {
      return;
    }

    const href = `${match[2]}.html`;

    if (href === currentPath()) {
      return;
    }

    node.innerHTML = `'<a href="${href}" class="${styles.codeLink}">${match[1]}</a>'`;
  });

function Example({name, url, disableAutoSize, files}) {
  const id = encodeURIComponent(name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div className={styles.example}>
      <Link href={`#${id}`} className={styles.exampleAnchor} tabIndex={-1}>
        {() => <Button icon={LinkIcon}/>}
      </Link>
      <H3 id={id} className={styles.exampleTitle}>{name}</H3>
      <Link
        href={url}
        className={styles.exampleLink}
        target="_blank"
        title="Open in new tab"
      >{'Example'}</Link>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={url} disableAutoSize={disableAutoSize}/>
      }
      {files.map(({showCode, content, type}) => showCode && (
        <Code
          code={content}
          key={type}
          replacer={injectLinks}
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
