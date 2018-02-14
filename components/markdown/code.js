import React from 'react';
import PropTypes from 'prop-types';

import Code from '../code/code';

const MarkdownCode = ({value, language, inline}) => (
  <Code
    language={language}
    code={value || ''}
    inline={inline}
  />
);

MarkdownCode.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string,
  inline: PropTypes.bool
};

export default MarkdownCode;
