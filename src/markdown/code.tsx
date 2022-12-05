import React from 'react';
import PropTypes from 'prop-types';

import {CodeProps, ComponentType} from 'react-markdown/lib/ast-to-react';

import Code from '../code/code';

export interface MarkdownCodeProps extends CodeProps {
  language?: string
}

const MarkdownCode = ({children, language, inline, className}: MarkdownCodeProps) => {
  // Hack for updated react-markdown RG-2193
  const lang = language ?? (
    className?.
      split(' ').
      find(name => name.startsWith('language-'))?.
      replace('language-', '')
  );

  return (
    <Code
      language={lang}
      className={className}
      code={children?.join('') || ''}
      inline={inline}
    />
  );
};

(MarkdownCode as ComponentType<MarkdownCodeProps>).propTypes = {
  language: PropTypes.string,
  children: PropTypes.array.isRequired,
  inline: PropTypes.bool
};

export default MarkdownCode;
