import React, {PropTypes} from 'react';

import Code from '../code/code';

const MarkdownCode = ({literal, inline}) => (
  <Code
    code={literal}
    {...{inline}}
  />
);

MarkdownCode.propTypes = {
  literal: PropTypes.string,
  inline: PropTypes.bool
};

export default MarkdownCode;
