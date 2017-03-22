import React, {PropTypes} from 'react';

import Code from '../code/code';

const MarkdownCode = ({literal, language, inline}) => (
  <Code
    language={language}
    code={literal}
    inline={inline}
  />
);

MarkdownCode.propTypes = {
  language: PropTypes.string,
  literal: PropTypes.string,
  inline: PropTypes.bool
};

export default MarkdownCode;
