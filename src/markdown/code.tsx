import React from 'react';
import PropTypes from 'prop-types';

import Code from '../code/code';

interface MarkdownCodeProps {
  language?: string | null | undefined
  value?: string | null | undefined
  inline?: boolean | undefined
}

const MarkdownCode = ({value, language, inline}: MarkdownCodeProps) => (
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
