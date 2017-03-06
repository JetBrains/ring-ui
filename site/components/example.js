import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import Iframe from './iframe';
import Code from './code';

function Example({name, url, files}) {
  const id = encodeURIComponent(name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div>
      <h3 id={id}>{name} <Link href={`#${id}`}>{'#'}</Link></h3>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={url}/>
      }
      {files.map(file =>
        <Code
          {...file}
          key={file.type}
        />
      )}
    </div>
  );
}

Example.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape(Code.propTypes))
};

Example.defaultProps = {
  name: ""
}

export default Example;
