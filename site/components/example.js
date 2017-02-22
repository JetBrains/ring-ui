import React, {PropTypes} from 'react';

import Link from 'ring-ui/components/link/link';

import Iframe from './iframe';
import Code from './code';

function Example({attrs, page, files}) {
  const id = encodeURIComponent(attrs.name.replace(/s/g, '_').replace(/:/g, ''));
  return (
    <div>
      <h3 id={id}>{attrs.name} <Link href={`#${id}`}>{'#'}</Link></h3>
      {files.some(({type}) => type === 'html') &&
        <Iframe src={page.url}/>
      }
      {files.filter(file => file.attrs['show-code'] !== false).map(file =>
        <Code
          {...file}
          key={file.type}
        />
      )}
    </div>
  );
}

Example.propTypes = {
  attrs: PropTypes.shape({
    name: PropTypes.string
  }),
  page: PropTypes.shape({
    url: PropTypes.string
  }),
  files: PropTypes.arrayOf(PropTypes.shape(Code.propTypes))
};

export default Example;
