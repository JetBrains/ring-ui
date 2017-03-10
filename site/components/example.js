import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';
import Code from 'ring-ui/components/code/code';

import Iframe from './iframe';

const LangMap = {
  js: Code.Languages.JS,
  html: Code.Languages.HTML,
  css: Code.Languages.CSS,
  scss: Code.Languages.CSS
};

function Example({name, url, files}) {
  const id = encodeURIComponent(name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div>
      <h3 id={id}>{name} <Link href={`#${id}`}>{'#'}</Link></h3>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={url}/>
      }
      {files.map(({showCode, content, type}) => showCode && (
        <Code
          language={LangMap[type]}
          code={content}
          key={type}
          beautify={true}
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
