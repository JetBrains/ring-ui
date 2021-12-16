import React from 'react';
import PropTypes from 'prop-types';

import {CodeProps, ComponentType} from 'react-markdown/lib/ast-to-react';

import Code from '../code/code';

declare module 'react-markdown/lib/complex-types' {
  interface ReactMarkdownProps {
    language?: string
  }
}

const MarkdownCode = ({children, language, inline}: CodeProps) => (
  <Code
    language={language}
    code={children?.join('') || ''}
    inline={inline}
  />
);

(MarkdownCode as ComponentType<CodeProps>).propTypes = {
  language: PropTypes.string,
  children: PropTypes.array.isRequired,
  inline: PropTypes.bool
};

export default MarkdownCode;
